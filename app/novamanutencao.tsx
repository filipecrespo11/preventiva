import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import {jwtDecode} from "jwt-decode";
import Layout from "./componente/layout";
import {
  TextInput,
  View,
  Button,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator, Image
} from "react-native";
import styles from "./componente/layoutStyles";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";


const urlink = process.env.EXPO_PUBLIC_URI_HOST;

interface DecodedToken {
  id: string;
  nome: string;
}

interface Computador {
  _id: string;
  serviceTag: string;
  setor: string;
}

const NManutencao = () => {
  const { token } = useAuth();
  const router = useRouter();

  const [criamanu, setCriamanu] = useState({
    id_computador: "",
    serviceTag: "",
    setor: "",
    id_usuarios: "",
    chamado: "",
    status_manutencao: "",
    data_manutencao_anterior: "",
    data_manutencao: "",
    tipo_manutencao: "",
    descricao_manutencao: "",
  });

  const [computadores, setComputadores] = useState<Computador[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [dateAnterior, setDateAnterior] = useState(new Date());
  const [showPickerAnterior, setShowPickerAnterior] = useState(false);
  const [dateManutencao, setDateManutencao] = useState(new Date());
  const [showPickerManutencao, setShowPickerManutencao] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Função para gerar um ID aleatório simples
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  useEffect(() => {
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setCriamanu((prev) => ({ ...prev, id_usuarios: decoded.id }));
      setNomeUsuario(decoded.nome);
    }
  }, [token]);

  useEffect(() => {
    const fetchComputadores = async () => {
      try {
        const response = await axios.get(`${urlink}/compurota/computadores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComputadores(response.data);
      } catch (error) {
        console.error("Erro ao buscar computadores:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de computadores.");
      }
    };

    if (token) {
      fetchComputadores();
    }
  }, [token]);

  const handleChange = (name: string, value: string) => {
    setCriamanu((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onChangeDateAnterior = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateAnterior;
    setShowPickerAnterior(false);
    setDateAnterior(currentDate);
    if (selectedDate) {
      handleChange("data_manutencao_anterior", formatDate(currentDate));
    }
  };

  const onChangeDateManutencao = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateManutencao;
    setShowPickerManutencao(false);
    setDateManutencao(currentDate);
    if (selectedDate) {
      handleChange("data_manutencao", formatDate(currentDate));
    }
  };

  const toggleDatePickerAnterior = () => setShowPickerAnterior(!showPickerAnterior);
  const toggleDatePickerManutencao = () => setShowPickerManutencao(!showPickerManutencao);

  const handleSubmit = async () => {
    if (
        !criamanu.id_computador ||
        !criamanu.serviceTag ||
        !criamanu.setor ||
        !criamanu.id_usuarios ||
        !criamanu.data_manutencao ||
        !criamanu.tipo_manutencao ||
        !criamanu.descricao_manutencao
    ) {
        Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    setIsLoading(true);
    const emailId = generateRandomId(); // Gera o ID único para o e-mail
    let dbManutencaoId = "";

    try {
        // Criar registro de manutenção
        const createManuResponse = await axios.post(`${urlink}/manurota/criamanutencao`, criamanu, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Assumindo que a resposta da criação da manutenção retorna o objeto criado, incluindo seu _id.
        // Ajuste o caminho se a estrutura da resposta for diferente. Ex: response.data._id ou response.data.id
        dbManutencaoId = createManuResponse.data.manutencao?._id || createManuResponse.data._id; 

        // Enviar e-mail (não bloqueante)
        axios.post(`${urlink}/manurota/enviaremail`, {
            destinatario: process.env.URIemailfrom,
            assunto: `[ID:${emailId}] Nova manutenção cadastrada do PC Com a Service Tag: ${criamanu.serviceTag}`,
            texto: `Uma nova manutenção foi cadastrada para o computador ${criamanu.serviceTag} por ${nomeUsuario}.`,
            serviceTag: criamanu.serviceTag,
            manutencaoId: dbManutencaoId,      // O _id da manutenção do MongoDB
            emailSubjectId: emailId            // O ID que está no assunto (opcional no corpo, mas pode ser útil)
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).catch((emailError) => {
            console.error("Falha ao enviar e-mail, mas manutenção foi criada:", emailError);
            Alert.alert("Aviso", "Manutenção criada, mas houve um erro ao enviar o e-mail.");
        });

        Alert.alert("Sucesso", "Manutenção criada com sucesso!");
        // Se dbManutencaoId for preferível para o relatório em vez de serviceTag:
        // router.push(`./tabs/relatorioChecklist?id=${dbManutencaoId}` as any); 
        // Ou mantenha serviceTag se for o identificador esperado pela tela de relatório:
        router.push(`./tabs/relatorioChecklist?id=${dbManutencaoId}` as any); 

    } catch (error) {
        console.error("Erro ao criar manutenção:", error);
        Alert.alert("Erro", "Não foi possível criar a manutenção. Tente novamente.");
    } finally {
        setIsLoading(false);
    }
};

  return (
    <Layout>
      <Stack.Screen options={{ title: "",  headerTitle: () => (
                                      <Image
                                          source={require("../assets/images/logo.png")} // ajuste o caminho conforme necessário
                                          style={{ width: 120, height: 40, resizeMode: "contain" }}
                                      />
                                  ),
                              }}
                          />
      <ScrollView>
        <View>
          <Picker
          style={{ ...styles.input }}
            selectedValue={criamanu.id_computador}
            onValueChange={(value) => {
              handleChange("id_computador", value);
              const selectedComputer = computadores.find((computador) => computador._id === value);
              if (selectedComputer) {
                handleChange("serviceTag", selectedComputer.serviceTag);
                handleChange("setor", selectedComputer.setor);
              }
            }}
          >
            <Picker.Item label="Selecione um computador" value="" />
            {computadores.map((computador) => (
              <Picker.Item key={computador._id} label={computador.serviceTag} value={computador._id} />
            ))}
          </Picker>

          <TextInput
            style={{ ...styles.input }}
            placeholder="Service Tag"
            value={criamanu.serviceTag}
            onChangeText={(value) => handleChange("serviceTag", value)}
          />

          <TextInput
            style={{ ...styles.input }}
            placeholder="Setor"
            value={criamanu.setor}
            onChangeText={(value) => handleChange("setor", value)}
          />

          <TextInput
            style={{ ...styles.input }}
            placeholder="Número do Chamado"
            value={criamanu.chamado}
            onChangeText={(value) => handleChange("chamado", value)}
          />

          <Picker
            style={{ ...styles.input }}
            placeholder="Status da Manutenção"
            selectedValue={criamanu.status_manutencao}
            onValueChange={(itemValue) => handleChange("status_manutencao", itemValue)}>
            <Picker.Item label="Selecione o Status da Manutenção" value="" />
            <Picker.Item label="Aguardando Peças" value="Aguardando Peças" />
            <Picker.Item label="Em Andamento" value="Em Andamento" />
            <Picker.Item label="Concluída" value="Concluída" />
            <Picker.Item label="Cancelada" value="Cancelada" />
          </Picker>

          {Platform.OS === "web" ? (
            <input
              type="date"
              value={criamanu.data_manutencao_anterior || ""}
              onChange={(e) => handleChange("data_manutencao_anterior", e.target.value)}
              style={styles.input as any}
            />
          ) : (
            <>
              <TouchableOpacity onPress={toggleDatePickerAnterior}>
                <TextInput
                  style={{ ...styles.input }}
                  placeholder="Selecione a Data da Manutenção Anterior"
                  value={criamanu.data_manutencao_anterior}
                  editable={false}
                />
              </TouchableOpacity>
              {showPickerAnterior && (
                <DateTimePicker
                  value={dateAnterior}
                  mode="date"
                  display="default"
                  onChange={onChangeDateAnterior}
                />
              )}
            </>
          )}

          {Platform.OS === "web" ? (
            <input
              type="date"
              value={criamanu.data_manutencao || ""}
              onChange={(e) => handleChange("data_manutencao", e.target.value)}
              style={styles.input as any}
            />
          ) : (
            <>
              <TouchableOpacity onPress={toggleDatePickerManutencao}>
                <TextInput
                  style={{ ...styles.input }}
                  placeholder="Selecione a Data da Manutenção"
                  value={criamanu.data_manutencao}
                  editable={false}
                />
              </TouchableOpacity>
              {showPickerManutencao && (
                <DateTimePicker
                  value={dateManutencao}
                  mode="date"
                  display="default"
                  onChange={onChangeDateManutencao}
                />
              )}
            </>
          )}

          <Picker
            style={{ ...styles.input }}
            placeholder="Tipo de Manutenção"
            selectedValue={criamanu.tipo_manutencao}
            onValueChange={(itemValue) => handleChange("tipo_manutencao", itemValue)}>
            <Picker.Item label="Selecione o Tipo de Manutenção" value="" />
            <Picker.Item label="Preventiva" value="Preventiva" />
            <Picker.Item label="Corretiva" value="Corretiva" />
            <Picker.Item label="Atualização" value="Atualização" />
            <Picker.Item label="Limpeza" value="Limpeza" />
            <Picker.Item label="Instalação" value="Instalação" />
            <Picker.Item label="Configuração" value="Configuração" />
            <Picker.Item label="Reparo" value="Reparo" />
            <Picker.Item label="Outros" value="Outros" />
          </Picker>

          <TextInput
            style={{ ...styles.input }}
            placeholder="Descrição Detalhada da Manutenção"
            value={criamanu.descricao_manutencao}
            onChangeText={(value) => handleChange("descricao_manutencao", value)}
          />
        </View>

        {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} size="large" color="#4a90e2" />}
        <Button color="rgb(4 155 92)" title="Cadastrar" onPress={handleSubmit} disabled={isLoading} />
        <Button color="rgb(4 155 92)" title="Voltar" onPress={() => router.push("/tabs/menu")} disabled={isLoading} />
      </ScrollView>
    </Layout>
  );
};

export default NManutencao;