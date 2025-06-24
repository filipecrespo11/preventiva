import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, TextInput, useWindowDimensions, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import styles from "../componente/layoutStyles";
import Layout from "../componente/layout";

const urlink = process.env.EXPO_PUBLIC_URI_HOST;

interface Manutencao {
    _id: string; // ID do documento
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
  const [searchTerm, setSearchTerm] = useState<string>(""); // Novo estado para pesquisa
const router = useRouter();
  

  useEffect(() => {
    // Função para buscar a lista de computadores
    const fetchManutecao = async () => {
      try {
        const response = await axios.get(`${urlink}/manurota/manutencoes`);
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

    const filteredManutencao = Manutencao.filter(
      (item) =>
        item.serviceTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.setor?.toLowerCase().includes(searchTerm.toLowerCase())
    );


  const TableHeader = () => (
    
  <View style={{  flexDirection: "row", borderColor: "#e0e0e0", padding: 8  }}>
   
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Service Tag: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Setor: </Text>
   
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Chamado: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Status da Manutenção: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Data da Manutenção Anterior: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Data da Manutenção: </Text>
     <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Tipo de Manutenção: </Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Descrição Detalhada da Manutenção: </Text>
  <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>edit: </Text>
  </View>
);


  

  const renderItem = ({ item }: { item: Manutencao }) => (
    <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#e0e0e0", padding: 8 }}>
    
      <Text style={[styles.label, { flex: 1 }]}>{item.serviceTag}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.setor}</Text>
      
      <Text style={[styles.label, { flex: 1 }]}>{item.chamado}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.status_manutencao}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{formatDate(item.data_manutencao_anterior)}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{formatDate(item.data_manutencao)}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.tipo_manutencao}</Text>
      <Text style={[styles.label, { flex: 1 }]}>{item.descricao_manutencao}</Text>
           
         
      <TouchableOpacity
  onPress={() => router.push(`/tabs/editarManutencao?id=${item._id}`)}
  style={{ backgroundColor: "#1976d2", padding: 6, borderRadius: 4, marginLeft: 4 }}
>
  <Text style={{ color: "#fff" }}>Editar</Text>
</TouchableOpacity>



   
    </View>

   
    
  );


const { width } = useWindowDimensions();
  return (
    
    <SafeAreaView style={{...styles.containerlist, flex: 1}}>
      
     <Layout>
      <Stack.Screen options={{ title: "Lista Preventiva", headerTitle: () => (
  <Image
    source={require("../../assets/images/logo.png")}
    style={{ width: 120, height: 40 }}
    resizeMode="contain"
  />
),
}} />

        <TextInput
        style={{...styles.input}}
        placeholder="Pesquisar por nome ou Service Tag"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TableHeader />
      <FlatList 
        data={filteredManutencao} // The array of items to render
        renderItem={renderItem} // The function to render each item
        keyExtractor={(item) => item._id} // Unique key for each item, assuming _id is unique
        contentContainerStyle={{ paddingBottom: 120 }} // espaço extra para o rodapé
      />
      
      </Layout>
    </SafeAreaView>
  );
};


export default ListMautencao;