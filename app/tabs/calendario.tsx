import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Alert, Platform } from "react-native";
import axios from "axios";
import { Agenda, AgendaList } from "react-native-calendars";
import { enableScreens} from "react-native-screens";
import Layout from "../componente/layout";


interface Manutencao {
  id_computador: string;
  serviceTag: string;
  data_manutencao: string;
  tipo_manutencao: string;
  descricao_manutencao: string;
}

interface AgendaItem {
  name: string;
  description: string;
  serviceTag: string;
}

const AgendaManutencao: React.FC = () => {
  const [agendaItems, setAgendaItems] = useState<{ [key: string]: AgendaItem[] }>({}); // Itens para o componente Agenda

  useEffect(() => {
    const fetchManutencoes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/manurota/manutencoes");
        const data = response.data;

        const hoje = new Date(data[0].data_manutencao); // Data atual
        const umAnoDepois = new Date();
        umAnoDepois.setFullYear(hoje.getFullYear() + 1);

        const manutencoesFiltradas = data.filter((manutencao: Manutencao) => {
          const dataManutencao = new Date(manutencao.data_manutencao);
          return dataManutencao >= hoje && dataManutencao <= umAnoDepois;
        });

        const items = manutencoesFiltradas.reduce((acc: { [key: string]: AgendaItem[] }, manutencao: Manutencao) => {
          const dateKey = manutencao.data_manutencao.split("T")[0]; // Formato YYYY-MM-DD
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push({
            name: manutencao.tipo_manutencao,
            description: manutencao.descricao_manutencao,
            serviceTag: manutencao.serviceTag,
          });
          return acc;
        }, {});

        console.log("Itens do calendário:", items); // Log para verificar os itens
        setAgendaItems(items);
      } catch (error) {
        console.error("Erro ao buscar manutenções:", error);
        Alert.alert("Erro", "Não foi possível carregar as manutenções. Tente novamente mais tarde.");
      }
    };

    fetchManutencoes();
  }, []);


// Desativar o uso do Native Driver no ambiente web
if (Platform.OS === "web") {
  enableScreens(false);
}

  return (





    <SafeAreaView >
      <Layout>
      

    <View >
      <Agenda
        items={agendaItems}

        renderItem={(item: AgendaItem) => (
          <View >
            <Text >{item.name}</Text>
            <Text >{item.description}</Text>
            <Text>Service Tag: {item.serviceTag}</Text>
          </View>
        )}
        
        renderEmptyDate={() => (
          <View >
            <Text >Nenhuma manutenção para esta data.</Text>
          </View>
        )}
        disabledByDefault={true}
        refreshControl={null}
        pastScrollRange={12}
        futureScrollRange={12}
        theme={{
          agendaDayTextColor: "black",
          agendaDayNumColor: "black",
          agendaTodayColor: "blue",
          agendaKnobColor: "blue",
        }}

      />
    </View>
    </Layout>
    </SafeAreaView>
  );
};



export default AgendaManutencao;