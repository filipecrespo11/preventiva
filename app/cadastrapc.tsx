import { useState } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext"; // Importa o contexto de autenticação
import Layout from "./componente/layout";
import styles from "./componente/layoutStyles";
import { Button, TextInput, View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importa o componente Picker

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
    Hospital: ["TI", "Posto A", "Posto B"],
    Operadora: ["Administração", "Financeiro", "RH"],
  }); // Setores por unidade
  const [selectedUnidade, setSelectedUnidade] = useState<string>(""); // Unidade selecionada
  const [selectedSetor, setSelectedSetor] = useState<string>(""); // Setor selecionado



  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setUser({ ...criapc, [name]: value });
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("Token não encontrado. Certifique-se de que o usuário está autenticado.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/compurota/criacomputador",
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
      <View >
        <Stack.Screen options={{ title: "Cadastro de Máquina" }} />
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
              onValueChange={(value) => setSelectedSetor(value)}
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