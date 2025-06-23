import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Alert, Platform, Button, Image, StyleSheet, TextInput as RNTextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import { Agenda, Calendar } from "react-native-calendars";
import { enableScreens } from "react-native-screens";
import Layout2 from "../componente/layout2";
import styles from "../componente/layoutStyles";
import * as Print from "expo-print";
import { Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const urlink = process.env.EXPO_PUBLIC_URI_HOST;

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
  const [showPickerInicio, setShowPickerInicio] = useState(false);
  const [showPickerFim, setShowPickerFim] = useState(false);

  useEffect(() => {
    const fetchManutencoes = async () => {
      try {
        const response = await axios.get(`${urlink}/manurota/manutencoes`);
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

  // Estilo customizado para inputs e cards
  const localStyles = StyleSheet.create({
    filterRow: {
      flexDirection: "row",
      alignItems: "center",
      margin: 16,
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    input: {
      borderWidth: 1,
      borderColor: "#d0d0d0",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginHorizontal: 8,
      minWidth: 120,
      backgroundColor: "#f9f9f9",
      fontSize: 15,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 6,
      elevation: 3,
      borderWidth: 1,
      borderColor: "#e0e0e0",
    },
    cardTitle: {
      fontWeight: "bold",
      color: "#1976d2",
      fontSize: 16,
      marginBottom: 4,
    },
    cardLabel: {
      color: "#333",
      fontSize: 15,
      marginBottom: 2,
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: 18,
      marginBottom: 10,
      color: "#1976d2",
      textAlign: "center",
    },
    relatorioBox: {
      padding: 16,
      backgroundColor: "#f5f7fa",
      borderRadius: 12,
      margin: 12,
      borderWidth: 1,
      borderColor: "#e0e0e0",
    },
    exportButton: {
      backgroundColor: "#1976d2",
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 18,
      alignSelf: "flex-end",
      margin: 10,
    },
    exportButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    noDataText: {
      color: "#888",
      textAlign: "center",
      marginVertical: 12,
    },
  });

  return (
    <Layout2
      children1={
        <>
          {/* Filtros de período */}
          <View style={localStyles.filterRow}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Início:</Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                style={localStyles.input}
              />
            ) : (
              <TouchableOpacity onPress={() => setShowPickerInicio(true)}>
                <Text style={localStyles.input}>{dataInicio}</Text>
                {showPickerInicio && (
                  <DateTimePicker
                    value={new Date(dataInicio)}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowPickerInicio(false);
                      if (date) setDataInicio(date.toISOString().split("T")[0]);
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Fim:</Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
                style={localStyles.input}
              />
            ) : (
              <TouchableOpacity onPress={() => setShowPickerFim(true)}>
                <Text style={localStyles.input}>{dataFim}</Text>
                {showPickerFim && (
                  <DateTimePicker
                    value={new Date(dataFim)}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowPickerFim(false);
                      if (date) setDataFim(date.toISOString().split("T")[0]);
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity style={localStyles.exportButton} onPress={exportarRelatorio}>
              <Text style={localStyles.exportButtonText}>Exportar Relatório</Text>
            </TouchableOpacity>
          </View>

          {/* Relatório filtrado */}
          <View style={localStyles.relatorioBox}>
            <Text style={localStyles.sectionTitle}>Próximas Preventivas</Text>
            {getProximasPreventivasPeriodo().length === 0 ? (
              <Text style={localStyles.noDataText}>Nenhuma preventiva agendada neste período.</Text>
            ) : (
              getProximasPreventivasPeriodo().map(({ data, item }, idx) => (
                <View key={idx} style={localStyles.card}>
                  <Text style={localStyles.cardTitle}>{new Date(data).toLocaleDateString("pt-BR")}</Text>
                  <Text style={localStyles.cardLabel}>Setor: {item.setor}</Text>
                  <Text style={localStyles.cardLabel}>Service Tag: {item.serviceTag}</Text>
                  <Text style={localStyles.cardLabel}>{item.tipo_manutencao}</Text>
                </View>
              ))
            )}
          </View>

          {/* Lista customizada de itens da agenda para o dia selecionado */}
          <View style={localStyles.relatorioBox}>
            <Text style={localStyles.sectionTitle}>Manutenções do dia selecionado</Text>
            {agendaItems[selectedDate] && agendaItems[selectedDate].length > 0 ? (
              agendaItems[selectedDate].map((item, idx) => (
                <View key={idx} style={localStyles.card}>
                  <Text style={localStyles.cardLabel}>Tipo de manutenção: {item.tipo_manutencao}</Text>
                  <Text style={localStyles.cardLabel}>Setor: {item.setor}</Text>
                  <Text style={localStyles.cardLabel}>Service Tag: {item.serviceTag}</Text>
                </View>
              ))
            ) : (
              <Text style={localStyles.noDataText}>Nenhuma manutenção agendada para este dia.</Text>
            )}
          </View>
        </>
      }
    >
      <Stack.Screen options={{ title: "", headerTitle: () => (
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 120, height: 40, resizeMode: "contain" }}
        />
      ), }} />

      <Calendar
        current={selectedDate}
        onDayPress={(day: CalendarDay) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#1976d2" },
          ...Object.keys(agendaItems).reduce((acc, date) => {
            acc[date] = acc[date] || { marked: true };
            return acc;
          }, {} as any),
        }}
        theme={{
          selectedDayBackgroundColor: "#1976d2",
          todayTextColor: "#1976d2",
          arrowColor: "#1976d2",
        }}
      />
    </Layout2>
  );
};

export default AgendaManutencao;