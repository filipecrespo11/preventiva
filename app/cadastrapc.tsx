import { useState } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext"; // Importa o contexto de autenticação
import Layout from "./componente/layout";
import styles from "./componente/layoutStyles";
import { Button, TextInput, View, Text, StyleSheet, Image } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importa o componente Picker

const urlink = process.env.EXPO_PUBLIC_URI_HOST;
const setoruri = process.env.SETORESURI;


const CadastropcScreen = () => {
  const { token } = useAuth(); // Obtém o token do contexto
  const [criapc, setUser] = useState({
    nome_computador: "",
    fabricante: "",
    modelo: "",
    serviceTag: "",
    patrimonio: "",
    unidade: "",
    setor: "",
    estado: "",
  });

  const [unidades] = useState<string[]>(["Hospital", "Operadora"]); // Lista de unidades
  const [setores] = useState<{ [key: string]: string[] }>({
    Hospital: ["Bio Med Corredores", "Hotelaria", "Sala de Treinamento", "Telefonia", "Sala de Laudos (Antiga Marcação de Exames)", "Sala de Laudos", "Endoscopia", "Colonoscopia", "Oncologia", "Agência Transfusional (1º Andar)", "Agência Transfusional (Térreo)", "Coordenação de Enfermagem PA", "Cuidados Paliativos", "Centro Cirúrgico", "Núcleo OPME", "CME", "Coordenação de Enfermagem", "C.D.U (Guichês)", "C.D.U (Entrega)", "Raio-X", "Mamografia", "Tomografia", "Ultrassom", "Manutenção Hospitalar", "Gestão de Pessoas", "Coordenação CDU", "Repouso Pediátrico", "Farmácia P.A", "Supervisão de Enfermagem 1° Andar", "Processos e Qualidade", "CAF 2º andar", "Marcação de Exames CDU", "Arquivo HGU", "Day Clinic", "Farmácia do Centro Cirúrgico", "UTI Adulto 01", "TI (Infra)", "Almoxarifado", "UTI Adulto 02", "Atendo", "Sala de Reunião HGU", "Secretaria da Direção", "Recepção Adulto", "Posto 2B Anexo", "Coord. Atendimento", "Prescrição 2º andar", "SESMT (Corredor Faturamento)", "SESMT (RH)", "Classificação Ped. I e II", "Recepção Pediátrica", "Recepção Internação", "Puericultura", "Hall do Elevador", "Hall da Imagem", "Consultórios da Emergência", "TI (Sistemas)", "Enfermagem 2C", "Enfermagem 2A", "Posto de Enfermagem do 1º Andar", "Posto P.A", "Mal Subito", "Enfermagem 2º B", "Serviço Social", "CCIH", "Triagem Adulto - 01 e 02", "Coord. Enf. UTI Adulto", "Fisioterapia UTI Adulto", "Sala dos Cooperados", "Repouso Médico - UTI NEO", "UTI Neo", "Farmácia Central", "Faturamento", "Autorização de Guias", "Nutrição", "Estoque da Nutrição", "Prescrição 1º andar", "Painéis e Totens MV", "Cozinha", "Guarita Lateral"], // Setores por unidade
    Operadora: ["Administração", "Financeiro", "RH"],
  }); // Setores por unidade
  const [selectedUnidade, setSelectedUnidade] = useState<string>(""); // Unidade selecionada
  const [selectedSetor, setSelectedSetor] = useState<string>(""); // Setor selecionado



  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setUser({ ...criapc, [name]: value.toUpperCase() }); // Atualiza o estado do computador, convertendo o valor para maiúsculas
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("Token não encontrado. Certifique-se de que o usuário está autenticado.");
      return;
    }

    try {
      await axios.post(
        `${urlink}/compurota/criacomputador`,
        criapc,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        }
      );
      router.push("/tabs/menu"); // Redireciona para o menu após o cadastro
    } catch (error) {
      console.error("Erro ao criar computador:", error);
    }
  };

  return (
    <Layout>
      <View>
        <Stack.Screen options={{ title: "" ,headerTitle: () => (
                                          <Image
                                              source={require("../assets/images/logo.png")} // ajuste o caminho conforme necessário
                                              style={{ width: 120, height: 40, resizeMode: "contain" }}
                                          />
                                      ),
                                  }}
                              />
        <TextInput
          style={{...styles.input}}
          placeholder="Nome do computador"
          value={criapc.nome_computador}
          onChangeText={(value) => handleChange("nome_computador", value)}
        />
        <TextInput
          style={{...styles.input}}
          placeholder="Fabricante"
          value={criapc.fabricante}
          onChangeText={(value) => handleChange("fabricante", value)}
        />
        <TextInput
          style={{...styles.input}}
          placeholder="Modelo"
          value={criapc.modelo}
          onChangeText={(value) => handleChange("modelo", value)}
        />
        <TextInput
          style={{...styles.input}}
          placeholder="Service Tag"
          value={criapc.serviceTag}
          onChangeText={(value) => handleChange("serviceTag", value)}
        />
        <TextInput
          style={{...styles.input}}
          placeholder="Patrimônio"
          value={criapc.patrimonio}
          keyboardType="numeric"
          onChangeText={(value) => handleChange("patrimonio", value)}
        />
          {/* Picker para Unidade */}
          
        <Picker
          selectedValue={selectedUnidade}
          onValueChange={(value) => {
            setSelectedUnidade(value);
            setSelectedSetor(""); // Reseta o setor ao mudar a unidade
                setUser({ ...criapc, unidade: value, setor: "" }); // <-- Atualiza o objeto principal
            
          }}
          style={{...styles.input}}
        >
          <Picker.Item label="Selecione a Unidade" value="" />
          {unidades.map((unidade) => (
            <Picker.Item key={unidade} label={unidade} value={unidade} />
          ))}
        </Picker>

        {/* Picker para Setor */}
        {selectedUnidade && (
          <>
            <Picker
              selectedValue={selectedSetor}
              onValueChange={(value) => {setSelectedSetor(value);
                 setUser({ ...criapc, setor: value }); // <-- Atualiza o objeto principal

              }}
              

              style={{...styles.input}}
            >
              <Picker.Item label="Selecione o Setor" value="" />
              {setores[selectedUnidade]?.map((setor) => (
                <Picker.Item key={setor} label={setor} value={setor} />
              ))}
            </Picker>
          </>
        )}
        
        <TextInput
          style={{...styles.input}}
          placeholder="Estado"
          value={criapc.estado}
          onChangeText={(value) => handleChange("estado", value)}
        />
        <Button title="Cadastrar" onPress={handleSubmit} color="rgb(4 155 92)" />
        <Button title="Voltar" onPress={() => router.push("/tabs/menu")} color="rgb(4 155 92)" />
      </View>
    </Layout>
  );
};



export default CadastropcScreen;