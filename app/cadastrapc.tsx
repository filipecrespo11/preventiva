import { useState } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext"; // Importa o contexto de autenticação
import Layout from "./componente/layout";
import styles from "./componente/layoutStyles";
import { Button, TextInput, View, Text, StyleSheet, Image } from "react-native";
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
    Hospital: ["TI", "Posto A", "Posto B", "imagem", "Farmácia"], // Setores por unidade
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