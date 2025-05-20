import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";
import Layout from "./componente/layout";
import styles from "./componente/layoutStyles";
import { StackRouter } from "@react-navigation/native";

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
    <View style={{...styles.containerlist}}>
      <Text style={{...styles.label}}>ID: {item._id}</Text>     
      <Text style={{...styles.label}}>Nome: {item.nome_computador}</Text>      
      <Text style={{...styles.label}}>Fabricante: {item.fabricante}</Text>
      <Text style={{...styles.label}}>Modelo: {item.modelo}</Text>
      <Text style={{...styles.label}}>Service Tag: {item.serviceTag}</Text>
      <Text style={{...styles.label}}>Patrimônio: {item.patrimonio}</Text>
      <Text style={{...styles.label}}>Unidade: {item.unidade}</Text>
      <Text style={{...styles.label}}>Setor: {item.setor}</Text>
      <Text style={{...styles.label}}>Estado: {item.estado}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{...styles.containerlist}}>
      <Stack.Screen options={{ title: "Lista de computadores" }} />
      <FlatList
        data={computadores} // The array of items to render
        renderItem={renderItem} // The function to render each item
        keyExtractor={(item) => item._id} // Unique key for each item
      />
    </SafeAreaView>
  );
};


export default ListComputadores;