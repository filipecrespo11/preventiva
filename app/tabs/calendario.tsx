import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Alert, Platform } from "react-native";
import axios from "axios";
import { Agenda, Calendar } from "react-native-calendars";
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

type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

// ...existing code...
const AgendaManutencao: React.FC = () => {
  const [agendaItems, setAgendaItems] = useState<{ [key: string]: AgendaItem[] }>({});
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); // Data selecionada

 // ...existing code...
useEffect(() => {
  const fetchManutencoes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/manurota/manutencoes");
      const data = response.data;

      // Gera itens para a data atual e para a próxima manutenção (1 ano depois)
      const items = data.reduce((acc: { [key: string]: AgendaItem[] }, manutencao: Manutencao) => {
        // Data da manutenção atual
        const dataAtual = new Date(manutencao.data_manutencao);
        const dataAtualKey = manutencao.data_manutencao.split("T")[0];

        // Próxima manutenção: 1 ano depois
        const proximaData = new Date(dataAtual);
        proximaData.setFullYear(proximaData.getFullYear() + 1);
        const proximaDataKey = proximaData.toISOString().split("T")[0];

        // Adiciona a manutenção atual
        if (!acc[dataAtualKey]) acc[dataAtualKey] = [];
        acc[dataAtualKey].push({
          tipo_manutencao: manutencao.tipo_manutencao,
          setor: manutencao.setor,
          serviceTag: manutencao.serviceTag,
        });

        // Adiciona o agendamento para o próximo ano
        if (!acc[proximaDataKey]) acc[proximaDataKey] = [];
        acc[proximaDataKey].push({
          tipo_manutencao: `Próxima manutenção (${manutencao.tipo_manutencao})`,
          setor: manutencao.setor,
          serviceTag: manutencao.serviceTag,
        });

        return acc;
      }, {});

      setAgendaItems(items);
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error);
      Alert.alert("Erro", "Não foi possível carregar as manutenções. Tente novamente mais tarde.");
    }
  };

  fetchManutencoes();
}, []);
// ...existing code...

  if (Platform.OS === "web") {
    enableScreens(false);
  }

  return (
    <SafeAreaView>
      <Layout>
        <View>
          {/* Calendário acima da agenda */}
          <Calendar
            current={selectedDate}
            onDayPress={(day: CalendarDay) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "blue" },
              // Marcar datas que têm itens
              ...Object.keys(agendaItems).reduce((acc, date) => {
                acc[date] = acc[date] || { marked: true };
                return acc;
              }, {} as any),
            }}
            theme={{
              selectedDayBackgroundColor: "blue",
              todayTextColor: "blue",
              arrowColor: "blue",
            }}
          />

          <Agenda
            items={agendaItems}
            selected={selectedDate}
            onDayPress={(day: CalendarDay) => setSelectedDate(day.dateString)}
            renderItem={(item: AgendaItem) => (
              <View>
                <Text style={{ ...styles.label }}>{item.tipo_manutencao}</Text>
                <Text style={{ ...styles.label }}>{item.setor}</Text>
                <Text style={{ ...styles.label }}>Service Tag: {item.serviceTag}</Text>
              </View>
            )}
            renderKnob={() => (
              <View>
                <Text>Clique para ver as manutenções</Text>
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