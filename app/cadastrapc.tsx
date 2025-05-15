import { useState } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext"; // Importa o contexto de autenticação
import Layout from "./componente/layout";
import styles from "./componente/layoutStyles";
import { Button, TextInput, View, Text, StyleSheet } from "react-native";

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
        <TextInput
          style={{...styles.input}}
          placeholder="Unidade"
          value={criapc.unidade}
          onChangeText={(value) => handleChange("unidade", value)}
        />
        <TextInput
          style={{...styles.input}}
          placeholder="Setor"
          value={criapc.setor}
          onChangeText={(value) => handleChange("setor", value)}
        />
        <TextInput
          style={{...styles.input}}
          placeholder="Estado"
          value={criapc.estado}
          onChangeText={(value) => handleChange("estado", value)}
        />
        <Button title="Cadastrar" onPress={handleSubmit} />
        <Button title="Voltar" onPress={() => router.push("/tabs/menu")} />
      </View>
    </Layout>
  );
};



export default CadastropcScreen;