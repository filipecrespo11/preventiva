import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, TextInput, useWindowDimensions } from "react-native";
import axios from "axios";
import { Stack } from "expo-router";
import styles from "../componente/layoutStyles";
import Layout1 from "../componente/layout1";
import AgendaManutencao from "./calendario";


interface Manutencao {
    
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

 const [searchTerm, setSearchTerm] = useState<string>(""); // Novo estado para pesquisa

  const TableHeader = () => (
  <View style={{ flexDirection: "row", backgroundColor: "#e0e0e0", padding: 8 }}>
    
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Service Tag: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Setor: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>ID do Usuário: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Chamado: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Status da Manutenção: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Data da Manutenção Anterior: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Data da Manutenção: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Descrição Detalhada da Manutenção: </Text>
  
  </View>
);


  

  const renderItem = ({ item }: { item: Manutencao }) => (
    <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#e0e0e0", padding: 8 }}>
     
      <Text style={[styles.label, { flex: 1 }]}>{item.serviceTag}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.setor}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.id_usuarios}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.chamado}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.status_manutencao}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{formatDate(item.data_manutencao_anterior)}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{formatDate(item.data_manutencao)}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.tipo_manutencao}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.descricao_manutencao}</Text>
           
    </View>
  );
const { width } = useWindowDimensions();
  return (
    
    <SafeAreaView style={{...styles.containerlist}}>
      
     <Layout1 showChildren1={width > 600} children1={<AgendaManutencao />}>

        <TextInput
        style={{...styles.input}}
        placeholder="Pesquisar por nome ou Service Tag"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TableHeader />
      <FlatList 
     
        data={Manutencao} // The array of items to render
        renderItem={renderItem} // The function to render each item
        keyExtractor={(item) => item.chamado} // Unique key for each item
      />
      </Layout1>
    </SafeAreaView>
  );
};


export default ListMautencao;