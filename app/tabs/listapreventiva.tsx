import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import axios from "axios";
import { Stack } from "expo-router";
import styles from "../componente/layoutStyles";


interface Manutencao {
    
    id_computador: string;
    serviceTag: string;
    id_usuarios: string;
    chamado: string;
    status_manutencao: string;
    data_manutencao_anterior: string;
    data_manutencao: string;
    tipo_manutencao: string;
    descricao_manutencao: string;   

}

const ListMautencao: React.FC = () => {
  const [Manutencao, setManutencao] = useState<Manutencao[]>([]); // Lista de computadores
 
  

  useEffect(() => {
    // Função para buscar a lista de computadores
    const fetchManutecao = async () => {
      try {
        const response = await axios.get("http://localhost:3000/manurota/manutencoes");
        setManutencao(response.data); // Supondo que o backend retorne uma lista de computadores
      } catch (error) {
        console.error("Erro ao buscar Manuteções:", error);
      };
    };

 
      fetchManutecao();
    
  }, []);

 
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };


  

  const renderItem = ({ item }: { item: Manutencao }) => (
    <View style={{...styles.containerlist}}>
      <Text style={{...styles.label}}>ID: do computador: {item.id_computador}</Text>
      <Text style={{...styles.label}}>Service Tag: {item.serviceTag}</Text>
      <Text style={{...styles.label}}>ID do Usuário: {item.id_usuarios}</Text>
      <Text style={{...styles.label}}>Chamado: {item.chamado}</Text>
      <Text style={{...styles.label}}>Status da Manutenção: {item.status_manutencao}</Text>
      <Text style={{...styles.label}}>Data da Manutenção Anterior: {formatDate(item.data_manutencao_anterior)}</Text>
      <Text style={{...styles.label}}>Data da Manutenção: {formatDate(item.data_manutencao)}</Text>
      <Text style={{...styles.label}}>Tipo de Manutenção: {item.tipo_manutencao}</Text>
      <Text style={{...styles.label}}>Descrição Detalhada da Manutenção: {item.descricao_manutencao}</Text>
     
      
      
      
    </View>
  );

  return (
    <SafeAreaView style={{...styles.containerlist}}>
      <Stack.Screen options={{ title: "Lista de Manutenções" }} />
      <FlatList
        data={Manutencao} // The array of items to render
        renderItem={renderItem} // The function to render each item
        keyExtractor={(item) => item.chamado} // Unique key for each item
      />
    </SafeAreaView>
  );
};


export default ListMautencao;