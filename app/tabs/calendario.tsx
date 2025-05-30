import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Alert, Platform } from "react-native";
import axios from "axios";
import { Agenda, Calendar } from "react-native-calendars";
import { enableScreens} from "react-native-screens";
import Layout2 from "../componente/layout2";
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
    
        <Layout2
       
      
         children1={<Agenda
  items={agendaItems}
  selected={selectedDate}
  onDayPress={(day: CalendarDay) => setSelectedDate(day.dateString)}
  renderItem={(item: AgendaItem, firstItemInDay: boolean, dayKey: string) => {
    // Formata a data em português
    const dataFormatada = dayKey
      ? new Date(dayKey).toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          marginVertical: 6,
          marginHorizontal: 10,
          elevation: 2,
          borderWidth: 1,
          borderColor: "#e0e0e0",
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#1976d2", marginBottom: 4 }}>
          {dataFormatada}
        </Text>
        <Text style={{ ...styles.label }}>Tipo de manutenção:{item.tipo_manutencao}</Text>
        <Text style={{ ...styles.label }}>Setor:{item.setor}</Text>
        <Text style={{ ...styles.label }}>Service Tag: {item.serviceTag}</Text>
      </View>
    );
  }}
  renderKnob={() => null}
  hideKnob={true}
  showClosingKnob={false}
  showOnlySelectedDayItems={true}
  
  pastScrollRange={12}
  futureScrollRange={12}
  theme={{
    agendaDayTextColor: "black",
    agendaDayNumColor: "black",
    agendaTodayColor: "blue",
    agendaKnobColor: "blue",
  }}
renderCalendar={() => null} // <-- Adicione esta linha!

/>}
>

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




        </Layout2>
     
  );
};



export default AgendaManutencao;