import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Alert, Platform } from "react-native";
import axios from "axios";
import { Agenda, AgendaList, Calendar } from "react-native-calendars";
import { enableScreens} from "react-native-screens";
import Layout from "../componente/layout";
import styles from "../componente/layoutStyles";


interface Manutencao {
  id_computador: string;
  serviceTag: string;
  data_manutencao: string;
  tipo_manutencao: string;
  setor: string;
}

interface AgendaItem {
  tipo_manutencao: string;
  setor: string;
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
        tipo_manutencao: manutencao.tipo_manutencao,
            setor: manutencao.setor,
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


const sections = Object.keys(agendaItems).map((date) => ({
  title: date, // Use the date as the section title
  data: agendaItems[date], // Use the array of items as the section data
}));

  return (





    <SafeAreaView >
      <Layout>
      

    <View >
   

    
      <Agenda
        items={agendaItems}

        renderItem={(item: AgendaItem) => (
          <View >
            <Text style={{...styles.label}}>{item.tipo_manutencao}</Text>
            <Text style={{...styles.label}}>{item.setor}</Text>
            <Text style={{...styles.label}}>Service Tag: {item.serviceTag}</Text>
          </View>
        )}
        
        
        renderKnob={() => (
          <View >
            <Text >Clique para ver as manutenções</Text>
          </View>
        )}
        selected={new Date().toISOString().split("T")[0]} // Data atual
        renderItemInfo={() => (
          <View >
            <Text >Clique para ver as manutenções</Text>
          </View>
        )}  


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