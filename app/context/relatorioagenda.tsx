import React, { useState } from "react";
import { View, Text, Button, TextInput, ScrollView } from "react-native";
import * as Print from "expo-print";


interface AgendaItem {
  tipo_manutencao: string;
  setor: string;
  serviceTag: string;
  data: string;
}

interface RelatorioAgendaProps {
  agendaItems: { [data: string]: AgendaItem[] };
}

const RelatorioAgenda: React.FC<RelatorioAgendaProps> = ({ agendaItems }) => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [relatorio, setRelatorio] = useState<AgendaItem[]>([]);

  const gerarRelatorio = () => {
    const itens: AgendaItem[] = [];
    Object.entries(agendaItems).forEach(([data, items]) => {
      if (data >= dataInicio && data <= dataFim) {
        items.forEach(item => {
          itens.push({ ...item, data });
        });
      }
    });
    setRelatorio(itens);
  };

  const exportarPDF = async () => {
    const html = `
      <html>
        <body>
          <h2>Relatório da Agenda</h2>
          <p>Período: ${dataInicio} até ${dataFim}</p>
          <table border="1" cellpadding="5" cellspacing="0">
            <tr>
              <th>Data</th>
              <th>Tipo de Manutenção</th>
              <th>Setor</th>
              <th>Service Tag</th>
            </tr>
            ${relatorio.map(item => `
              <tr>
                <td>${item.data}</td>
                <td>${item.tipo_manutencao}</td>
                <td>${item.setor}</td>
                <td>${item.serviceTag}</td>
              </tr>
            `).join("")}
          </table>
        </body>
      </html>
    `;
    await Print.printAsync({ html });
  };

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Relatório da Agenda</Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
        <TextInput
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 5, width: 120 }}
          placeholder="Data início (YYYY-MM-DD)"
          value={dataInicio}
          onChangeText={setDataInicio}
        />
        <TextInput
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 5, width: 120 }}
          placeholder="Data fim (YYYY-MM-DD)"
          value={dataFim}
          onChangeText={setDataFim}
        />
        <Button title="Gerar Relatório" onPress={gerarRelatorio} />
      </View>
      {relatorio.length > 0 && (
        <ScrollView style={{ maxHeight: 300 }}>
          <Button title="Exportar PDF" onPress={exportarPDF} color="rgb(4 155 92)" />
          {relatorio.map((item, idx) => (
            <View key={idx} style={{ marginVertical: 4, borderBottomWidth: 1, borderColor: "#eee" }}>
              <Text>Data: {item.data}</Text>
              <Text>Tipo: {item.tipo_manutencao}</Text>
              <Text>Setor: {item.setor}</Text>
              <Text>Service Tag: {item.serviceTag}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RelatorioAgenda;