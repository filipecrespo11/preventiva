import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Alert, Platform, Button } from "react-native";
import axios from "axios";
import { Agenda, Calendar } from "react-native-calendars";
import { enableScreens} from "react-native-screens";
import Layout2 from "../componente/layout2";
import styles from "../componente/layoutStyles";
import * as Print from "expo-print"; // Se estiver usando Expo




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


const AgendaManutencao: React.FC = () => {
  const [agendaItems, setAgendaItems] = useState<{ [key: string]: AgendaItem[] }>({});
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); // Data selecionada
  const [dataInicio, setDataInicio] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dataFim, setDataFim] = useState<string>(new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0]);

 
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

// Função para gerar o relatório das próximas preventivas por período
const getProximasPreventivasPeriodo = () => {
  const proximas: { data: string; item: AgendaItem }[] = [];
  Object.entries(agendaItems).forEach(([data, items]) => {
    if (data >= dataInicio && data <= dataFim) {
      items.forEach((item) => {
        if (item.tipo_manutencao.startsWith("Próxima manutenção")) {
          proximas.push({ data, item });
        }
      });
    }
  });
  proximas.sort((a, b) => a.data.localeCompare(b.data));
  return proximas;
};

// Função para exportar relatório para impressão
const exportarRelatorio = async () => {
  const relatorio = getProximasPreventivasPeriodo();
  let html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; padding: 0; }
          h2 { color: #1976d2; }
          p { margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #888; padding: 8px; text-align: left; }
          th { background: #e3eafc; }
        </style>
      </head>
      <body>
        <h2>Relatório de Próximas Preventivas</h2>
        <p>Período: ${new Date(dataInicio).toLocaleDateString("pt-BR")} até ${new Date(dataFim).toLocaleDateString("pt-BR")}</p>
        ${
          relatorio.length === 0
            ? '<p style="color: #888;">Nenhuma preventiva agendada neste período.</p>'
            : `
              <table>
                <tr>
                  <th>Data</th>
                  <th>Setor</th>
                  <th>Service Tag</th>
                  <th>Tipo</th>
                </tr>
                ${relatorio
                  .map(
                    ({ data, item }) => `
                  <tr>
                    <td>${new Date(data).toLocaleDateString("pt-BR")}</td>
                    <td>${item.setor}</td>
                    <td>${item.serviceTag}</td>
                    <td>${item.tipo_manutencao}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            `
        }
      </body>
    </html>
  `;

  if (Platform.OS === "web") {
    // Para web: abrir uma nova janela e imprimir
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      Alert.alert("Erro", "Não foi possível abrir a janela de impressão. Verifique as permissões do navegador.");
    }
  } else {
    // Para mobile (Expo): usar Print.printAsync
    await Print.printAsync({ html });
  }
};





  return (
    
    <Layout2
    children1={
      <>
        {/* Filtros de período */}
        <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
          <Text>Início: </Text>
          <input
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <Text>Fim: </Text>
          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
            style={{ marginRight: 10 }}
          />
          </View>
        <View style={{ margin: 10 }}>
          <Button title="Exportar Relatório" onPress={exportarRelatorio} />
        </View>
        {/* Relatório filtrado */}
        <View style={{ padding: 10, backgroundColor: "#f5f5f5", borderRadius: 8, margin: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8, color: "#1976d2" }}>
            Próximas Preventivas
          </Text>
          {getProximasPreventivasPeriodo().length === 0 ? (
            <Text style={{ color: "#888" }}>Nenhuma preventiva agendada neste período.</Text>
          ) : (
            getProximasPreventivasPeriodo().map(({ data, item }, idx) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {new Date(data).toLocaleDateString("pt-BR")}
                </Text>
                <Text>Setor: {item.setor}</Text>
                <Text>Service Tag: {item.serviceTag}</Text>
                <Text>{item.tipo_manutencao}</Text>
              </View>
            ))
          )}
        </View>

        {<Agenda
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
        
      </>
    }
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