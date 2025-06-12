import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, Alert, Platform, TextInput, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Layout from "../componente/layout";
import { Stack } from "expo-router"

const urlink = process.env.EXPO_PUBLIC_URI_HOST; 

interface ChecklistItem {
  nome: string;
  sim: boolean;
  nao: boolean;
  comentario: string;

}

interface manutencao {
    _id: string; // ID do documento
    id_computador: string;
    serviceTag: string;
    setor: string;
    id_usuarios: string;
    chamado: string;
    status_manutencao: string;
    data_manutencao_anterior: string;
    data_manutencao: string;
    tipo_manutencao: string;
    descricao_manutencao: string;   

}

interface computador {
  _id: string;
    nome_computador: string;
    fabricante: string;
    modelo: string;
    serviceTag: string;
    patrimonio: string;
    unidade: string;
    setor: string;
    estado: string;
}

interface usuario {
  _id: string;  
    nome_usuario: string;
}

interface tecnico {
  nome_usuario: string; 
}
interface AuthContextType {
  
  checklist_hardware?: string;
  checklist_software?: string;
  checklist_perifericos?: string;

}
// const { token } = useAuth(); // Esta linha estava solta e é desnecessária aqui, token é pego abaixo.

const RelatorioChecklist = () => {
    const { token, checklist_hardware, checklist_software, checklist_perifericos } = useAuth();

  const params = useLocalSearchParams();
  const router = useRouter();
  const [searchTag, setsearchTag] = useState(params.id ? String(params.id) : "");
  const [manutencao, setManutencao] = useState<any>(null);
  const [computador, setComputador] = useState<any>(null);
  const [tecnico, setTecnico] = useState<any>(null);
  const [usuario, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Estados para os campos de checklist
  const [hardware, setHardware] = useState<ChecklistItem[]>([
    { nome: "Placa Mãe", sim: false, nao: false, comentario: "ok" },
    { nome: "Placa de Vídeo", sim: false, nao: false, comentario: "ok" },
    { nome: "Placa de Rede", sim: false, nao: false, comentario: "ok" },
    { nome: "Processador", sim: false, nao: false, comentario: "ok" },
    { nome: "Fonte de Energia", sim: false, nao: false, comentario: "ok" },
    { nome: "Memória RAM", sim: false, nao: false, comentario: "ok" },
    { nome: "Hard Disk", sim: false, nao: false, comentario: "ok" },
  ]);

  const [software, setSoftware] = useState<ChecklistItem[]>([
    { nome: "Anti Vírus (Sophos)", sim: false, nao: false, comentario: "ok" },
    { nome: "Atualização do Update", sim: false, nao: false, comentario: "ok" },
    { nome: "Limpeza de Disco", sim: false, nao: false, comentario: "ok" },
    { nome: "Versões Anteriores", sim: false, nao: false, comentario: "ok" },
    { nome: "Programas Padrões", sim: false, nao: false, comentario: "ok" },
    { nome: "MV", sim: false, nao: false, comentario: "ok" },
    { nome: "LibreOffice", sim: false, nao: false, comentario: "ok" },
    { nome: "Administrador Local", sim: false, nao: false, comentario: "ok" },
    { nome: "TeamViewer", sim: false, nao: false, comentario: "ok" },
    { nome: "Ultra VNC", sim: false, nao: false, comentario: "ok" },
    { nome: "Nome do Host", sim: false, nao: false, comentario: "ok" },
  ]);

  const [perifericos, setPerifericos] = useState<ChecklistItem[]>([
    { nome: "Teclado", sim: false, nao: false, comentario: "ok" },
    { nome: "Mouse", sim: false, nao: false, comentario: "ok" },
    { nome: "Monitor", sim: false, nao: false, comentario: "ok" },
    { nome: "Cabos", sim: false, nao: false, comentario: "ok" },
    { nome: "No-Break", sim: false, nao: false, comentario: "ok" },
  ]);

  


  // Função para carregar os checklists do useAuth
 const carregarChecklists = async () => {
  try {
    if (checklist_hardware) {
      const parsedHardware = JSON.parse(checklist_hardware);
      setHardware(parsedHardware);
      console.log("Hardware carregado do useAuth:", parsedHardware);
    }
    if (checklist_software) {
      const parsedSoftware = JSON.parse(checklist_software);
      setSoftware(parsedSoftware);
      console.log("Software carregado do useAuth:", parsedSoftware);
    }
    if (checklist_perifericos) {
      const parsedPerifericos = JSON.parse(checklist_perifericos);
      setPerifericos(parsedPerifericos);
      console.log("Periféricos carregado do useAuth:", parsedPerifericos);
    }
  } catch (error) {
    console.error("Erro ao carregar checklists do useAuth:", error);
    Alert.alert("Erro", "Não foi possível carregar os checklists salvos.");
  }
};

  // Função para buscar os dados pelo chamado digitado
  const buscarRelatorio = async () => {
    if (!searchTag) {
      Alert.alert("Atenção", "Digite o ID da manutenção ou Service Tag.");
      return;
    }
    setLoading(true);
    let manutencaoData = null;

    try {
      // Tenta buscar por Service Tag primeiro
      console.log(`Tentando buscar manutenção pela Service Tag: ${searchTag}`);
      const responseServiceTag = await axios.get(`${urlink}/manurota/manutencao/servicetag/${searchTag}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      manutencaoData = responseServiceTag.data;
      console.log("Manutenção encontrada via Service Tag:", manutencaoData);
    } catch (errorServiceTag: any) {
      console.warn(`Falha ao buscar por Service Tag (${searchTag}): ${errorServiceTag.message}`);
      if (errorServiceTag.response && errorServiceTag.response.status === 404) {
        try {
          console.log(`Tentando buscar manutenção pelo ID: ${searchTag}`);
          // Usando a rota similar à de editarManutencao para buscar por ID
          const responseId = await axios.get(`${urlink}/manurota/manut/${searchTag}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          manutencaoData = responseId.data;
          console.log("Manutenção encontrada via ID:", manutencaoData);
        } catch (errorId: any) {
          console.error(`Falha ao buscar por ID (${searchTag}) também: ${errorId.message}`);
          if (errorId.response) {
            console.error("Detalhes do erro na resposta (ID):", errorId.response.data, "Status:", errorId.response.status);
          }
          // O erro será tratado no bloco if (!manutencaoData) abaixo
        }
      } else {
        console.error("Erro não tratado ao buscar por Service Tag:", errorServiceTag.message);
        if (errorServiceTag.response) {
            console.error("Detalhes do erro na resposta (Service Tag):", errorServiceTag.response.data, "Status:", errorServiceTag.response.status);
        }
         // O erro será tratado no bloco if (!manutencaoData) abaixo
      }
    }

    if (!manutencaoData) {
      Alert.alert("Erro", "Nenhuma manutenção encontrada com o identificador fornecido.");
      setManutencao(null);
      setComputador(null);
      setTecnico(null);
      setLoading(false);
      return;
    }

    setManutencao(manutencaoData);

    // Continuar com a busca de computador e técnico
    try {
      if (manutencaoData.id_computador) {
        console.log(`Buscando computador para o ID: ${manutencaoData.id_computador}`);
        const compResponse = await axios.get(`${urlink}/compurota/computadores/${manutencaoData.id_computador}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
        console.log("Resposta da API /compurota/computadores:", compResponse.data);
        setComputador(compResponse.data);
        setSoftware((prev) =>
  prev.map((item) =>
    item.nome === "Nome do Host"
      ? { ...item, comentario: compResponse.data.nome_computador || "" }
      : item
  )
);
      } else {
        console.warn("ID do computador não encontrado na manutenção.");
        Alert.alert("Aviso", "ID do computador não encontrado na manutenção.");
        setComputador(null);
      }

      if (manutencaoData.id_usuarios) {
        const userResponse = await axios.get(`${urlink}/auterota/usuarios`, {
            headers: { Authorization: `Bearer ${token}` }, // Adicionado header de autorização
        });
        const usuarioEncontrado = userResponse.data.find((u: any) => u._id === manutencaoData.id_usuarios);
        console.log("Usuário encontrado (lista completa):", userResponse.data);
        console.log("Tentando encontrar ID:", manutencaoData.id_usuarios);
        console.log("Usuário correspondente:", usuarioEncontrado);
        if (usuarioEncontrado) {
          setTecnico(usuarioEncontrado.nome_usuarios || usuarioEncontrado.nome_usuario || usuarioEncontrado.nome || "(Sem nome)");
          console.log("Técnico definido como:", usuarioEncontrado.nome_usuarios || usuarioEncontrado.nome_usuario || usuarioEncontrado.nome || "(Sem nome)");
        } else {
          setTecnico("(Não encontrado)");
          console.warn("Técnico não encontrado para o ID:", manutencaoData.id_usuarios);
        }
      } else {
        setTecnico("(Não encontrado)");
        console.warn("ID de usuário não encontrado na manutenção.");
      }

      // Carregar checklists do useAuth
      await carregarChecklists();
    } catch (error: any) {
      console.error("Erro ao buscar dados secundários (computador/técnico/checklists):", error.message);
      if (error.response) {
        console.error("Detalhes do erro na resposta:", error.response.data);
        console.error("Status do erro:", error.response.status);
      }
      Alert.alert("Erro", "Não foi possível carregar todos os dados do relatório. Verifique o console para mais detalhes.");
      // Mantém os dados da manutenção se foram carregados, mas outros podem estar nulos ou com erro.
      // Ex: setComputador(null); setTecnico(null); // se quiser resetá-los em caso de erro aqui.
    } finally {
      setLoading(false);
    }
  };

  // Busca automática se vier ID pela URL
  useEffect(() => {
    if (searchTag) {
      buscarRelatorio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTag]);

  // Função para atualizar os campos de checklist
  const atualizarChecklist = (
    tipo: "hardware" | "software" | "perifericos",
    index: number,
    key: "sim" | "nao" | "comentario",
    valor: any
  ) => {
    const setter = tipo === "hardware" ? setHardware : tipo === "software" ? setSoftware : setPerifericos;
    const state = tipo === "hardware" ? hardware : tipo === "software" ? software : perifericos;
    const updatedItems = [...state];
    updatedItems[index] = { ...updatedItems[index], [key]: valor };
    setter(updatedItems);
  };

  const gerarHtmlRelatorio = () => {
    const renderRows = (itens: ChecklistItem[] = []) =>
      itens
        .map(
          (item) => `
          <tr>
            <td>${item.nome}</td>
            <td style="text-align:center">${item.sim ? "x" : ""}</td>
            <td style="text-align:center">${item.nao ? "x" : ""}</td>
            <td>${item.comentario || ""}</td>
          </tr>
        `
        )
        .join("");

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 4px; text-align: left; }
            th { background: #f2f2f2; }
            .cabecalho { font-size: 14px; }
            .secao { background: #ccc; font-weight: bold; text-align: center; }
            .assinatura { font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <table>
            <tr>
              <td class="cabecalho"><b>Setor:</b> ${computador?.setor || ""}</td>
              <td class="cabecalho"><b>Data:</b> ${manutencao?.data_manutencao || ""}</td>
              <td class="cabecalho"><b>Nome do Técnico:</b> ${tecnico || ""}</td>
              <td class="cabecalho"><b>Patrimonio:</b> ${computador?.patrimonio || ""}</td>
            </tr>
            <tr>
              <td class="cabecalho"><b>Fabricante:</b> ${computador?.fabricante || ""}</td>
              <td class="cabecalho"><b>Modelo:</b> ${computador?.modelo || ""}</td>
              <td class="cabecalho"><b>Nome da Máquina:</b> ${computador?.nome_computador || ""}</td>
              <td class="cabecalho"><b>N/S:</b> ${computador?.serviceTag || ""}</td>
            </tr>
          </table>
          <div class="secao">Hardware</div>
          <table>
            <tr>
              <th>Descrição do Micro</th>
              <th>SIM</th>
              <th>NÃO</th>
              <th>Comentários</th>
            </tr>
            ${renderRows(hardware)}
          </table>
          <div class="secao">Software</div>
          <table>
            <tr>
              <th>Descrição do Micro</th>
              <th>SIM</th>
              <th>NÃO</th>
              <th>Comentários</th>
            </tr>
            ${renderRows(software)}
          </table>
          <div class="secao">Periféricos do Micro</div>
          <table>
            <tr>
              <th>Descrição do Micro</th>
              <th>SIM</th>
              <th>NÃO</th>
              <th>Comentários</th>
            </tr>
            ${renderRows(perifericos)}
          </table>
          <table>
          <tr>
            <th>FM-TI-001, Rev.00 </th>
            <th>Elaborado por: Elaborado por: Samuel R. </th>
            <th>Aprovado por: Evandro D. </th>
          </tr>
                  
            </table>
        </body>
      </html>
    `;
  };

  const exportarRelatorio = async () => {
    const html = gerarHtmlRelatorio();
    if (Platform.OS === "web") {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    } else {
      await Print.printAsync({ html });
    }
  };

  return (
    <Layout>
      <Stack.Screen options={{ title: "",  headerTitle: () => (
                                <Image
                                    source={require("../../assets/images/logo.png")} // ajuste o caminho conforme necessário
                                    style={{ width: 120, height: 40, resizeMode: "contain" }}
                                />
                            ),
                        }}
                    />
      
      <ScrollView style={{ padding: 10 }}>
        {/* Campo de pesquisa */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 8,
              flex: 1,
              marginRight: 8,
            }}
            placeholder="ID da manutenção ou Service Tag"
            value={searchTag}
            onChangeText={setsearchTag}
          />
          <Button title="Pesquisar" onPress={buscarRelatorio} color="rgb(4 155 92)" />
        </View>

       
        {/* Exibir dados mesmo que apenas alguns sejam carregados */}
        {(manutencao || computador || tecnico) && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "bold" }}>Setor: {computador?.setor || "Não carregado"}</Text>
            <Text>Data: {manutencao?.data_manutencao || "Não carregado"}</Text>
            <Text>Nome do Técnico: {tecnico || "(Preencher manualmente)"}</Text>
            <Text>Fabricante: {computador?.fabricante || "Não carregado"}</Text>
            <Text>Modelo: {computador?.modelo || "Não carregado"}</Text>
            <Text>Nome da Máquina: {computador?.nome_computador || "Não carregado"}</Text>
            <Text>Service Tag: {computador?.serviceTag || "Não carregado"}</Text>
          </View>
        )}

        {/* Formulário de Checklist */}
        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Checklist de Hardware</Text>
        {hardware.map((item, index) => (
          <View key={item.nome} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <Text style={{ flex: 2 }}>{item.nome}</Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 5,
                marginRight: 5,
                backgroundColor: item.sim ? "#4a90e2" : "white",
              }}
              onPress={() => atualizarChecklist("hardware", index, "sim", !item.sim)}
            >
              <Text style={{ color: item.sim ? "white" : "black" }}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 5,
                marginRight: 5,
                backgroundColor: item.nao ? "#4a90e2" : "white",
              }}
              onPress={() => atualizarChecklist("hardware", index, "nao", !item.nao)}
            >
              <Text style={{ color: item.nao ? "white" : "black" }}>Não</Text>
            </TouchableOpacity>
            <TextInput
              style={{ flex: 2, borderWidth: 1, borderColor: "#ccc", marginLeft: 5, padding: 2 }}
              placeholder="Comentário"
              value={item.comentario}
              onChangeText={(txt) => atualizarChecklist("hardware", index, "comentario", txt)}
            />
          </View>
        ))}

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Checklist de Software</Text>
        {software.map((item, index) => (
          <View key={item.nome} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <Text style={{ flex: 2 }}>{item.nome}</Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 5,
                marginRight: 5,
                backgroundColor: item.sim ? "#4a90e2" : "white",
              }}
              onPress={() => atualizarChecklist("software", index, "sim", !item.sim)}
            >
              <Text style={{ color: item.sim ? "white" : "black" }}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 5,
                marginRight: 5,
                backgroundColor: item.nao ? "#4a90e2" : "white",
              }}
              onPress={() => atualizarChecklist("software", index, "nao", !item.nao)}
            >
              <Text style={{ color: item.nao ? "white" : "black" }}>Não</Text>
            </TouchableOpacity>
            <TextInput
              style={{ flex: 2, borderWidth: 1, borderColor: "#ccc", marginLeft: 5, padding: 2 }}
              placeholder="Comentário"
              value={item.comentario}
              onChangeText={(txt) => atualizarChecklist("software", index, "comentario", txt)}
            />
          </View>
        ))}

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Checklist de Periféricos</Text>
        {perifericos.map((item, index) => (
          <View key={item.nome} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <Text style={{ flex: 2 }}>{item.nome}</Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 5,
                marginRight: 5,
                backgroundColor: item.sim ? "#4a90e2" : "white",
              }}
              onPress={() => atualizarChecklist("perifericos", index, "sim", !item.sim)}
            >
              <Text style={{ color: item.sim ? "white" : "black" }}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 5,
                marginRight: 5,
                backgroundColor: item.nao ? "#4a90e2" : "white",
              }}
              onPress={() => atualizarChecklist("perifericos", index, "nao", !item.nao)}
            >
              <Text style={{ color: item.nao ? "white" : "black" }}>Não</Text>
            </TouchableOpacity>
            <TextInput
              style={{ flex: 2, borderWidth: 1, borderColor: "#ccc", marginLeft: 5, padding: 2 }}
              placeholder="Comentário"
              value={item.comentario}
              onChangeText={(txt) => atualizarChecklist("perifericos", index, "comentario", txt)}
            />
          </View>
        ))}

        {/* Botão de exportar relatório sempre visível após a busca */}
        <Button title="Exportar Relatório" onPress={exportarRelatorio} color="rgb(4 155 92)" />
      </ScrollView>
    </Layout>
  );
};

export default RelatorioChecklist;