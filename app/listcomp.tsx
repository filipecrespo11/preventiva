import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";

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

  return (
    
    <View>
        <Stack.Screen options={{ title: "Nova Manutenção" }} />
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Lista de Computadores</Text>
      {computadores.map((computadores) => (
        <View key={computadores._id} style={{ marginBottom: 10 }}>
            <Text>ID {computadores._id}</Text>
          <Text>Nome: {computadores.nome_computador}</Text>
          <Text>Fabricante: {computadores.fabricante}</Text>
          <Text>Modelo: {computadores.modelo}</Text>
          <Text>Service Tag: {computadores.serviceTag}</Text>
          <Text>Patrimônio: {computadores.patrimonio}</Text>
          <Text>Unidade: {computadores.unidade}</Text>
          <Text>Setor: {computadores.setor}</Text>
          <Text>Estado: {computadores.estado}</Text>
        </View>
      ))}
    </View>
  );
};

export default ListComputadores;