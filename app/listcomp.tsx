import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";
import Layout from "./componente/layout";
interface Computador {
  
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



const ListComputadores: React.FC = () => {
  const [computadores, setComputadores] = useState<Computador[]>([]); // Lista de computadores
  const { token } = useAuth(); // Obtém o token do contexto
  const router = useRouter();

  useEffect(() => {
    // Função para buscar a lista de computadores
    const fetchComputadores = async () => {
      try {
        const response = await axios.get("http://localhost:3000/compurota/computadores", {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
        setComputadores(response.data); // Supondo que o backend retorne uma lista de computadores
      } catch (error) {
        console.error("Erro ao buscar computadores:", error);
      }
    };

    if (token) {
      fetchComputadores();
    }
  }, [token]);

  const renderItem = ({ item }: { item: Computador }) => (
    <View style={styles.item}>
      <Text>ID: {item._id}</Text>
      <Text>Nome: {item.nome_computador}</Text>
      <Text>Fabricante: {item.fabricante}</Text>
      <Text>Modelo: {item.modelo}</Text>
      <Text>Service Tag: {item.serviceTag}</Text>
      <Text>Patrimônio: {item.patrimonio}</Text>
      <Text>Unidade: {item.unidade}</Text>
      <Text>Setor: {item.setor}</Text>
      <Text>Estado: {item.estado}</Text>
    </View>
  );

  return (
    <Layout>
      <View style={styles.container1}>
        <Stack.Screen options={{ title: "Lista de Computadores" }} />
        <Text style={styles.title}>Lista de Computadores</Text>
        <FlatList
          data={computadores}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});


export default ListComputadores;