import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, TextInput } from "react-native";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";
import styles from "./componente/layoutStyles";
import { Picker } from "@react-native-picker/picker";
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
  const [unidades, setUnidades] = useState<string[]>(["Hospital","Operadora"]); // Lista de unidades  
  const [setores, setSetores] = useState<{[key: string]: string[]}>({
    Hospital: ["TI", "Enfermagem", "Manutenção"],
    Operadora: ["TI", "Enfermagem", "Manutenção"],
  }); // Lista de setores
  const [selectedUnidade, setSelectedUnidade] = useState<string>(""); // Unidade selecionada
  const [selectedSetor, setSelectedSetor] = useState<string>(""); // Setor selecionado 
  const [serviceTag, setServiceTag] = useState<string>(""); // Campo para buscar pela Service Tag
  const [dadosCombinados, setDadosCombinados] = useState<Computador[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<Computador | null>(null); // Item selecionado 
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

  const handleSearch = () => {
    const encontrado = dadosCombinados.find((item) => item.serviceTag === serviceTag);
    if (encontrado) {
      setItemSelecionado(encontrado);
    } else {
      window.alert( "Nenhum item encontrado com essa Service Tag.");
      setItemSelecionado(null);
    }
  };

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
      <Layout>
      
            
      <Picker
        selectedValue={selectedUnidade}
        onValueChange={(value) => {
          setSelectedUnidade(value);
          setSelectedSetor(""); // Reseta o setor ao mudar a unidade
        }}
        
      >
        <Picker.Item label="Selecione a Unidade" value="" />
        {unidades.map((unidade) => (
          <Picker.Item key={unidade} label={unidade} value={unidade} />
        ))}
      </Picker>

      {selectedUnidade && (
        <>
          <Text style={styles.title}>Selecione o Setor</Text>
          <Picker
            selectedValue={selectedSetor}
            onValueChange={(value) => setSelectedSetor(value)}
           
          >
            <Picker.Item label="Selecione o Setor" value="" />
            {setores[selectedUnidade]?.map((setor) => (
              <Picker.Item key={setor} label={setor} value={setor} />
            ))}
          </Picker>
        </>
      )}

<FlatList
        data={computadores.filter(
          (comp) =>
            (!selectedUnidade || comp.unidade === selectedUnidade) &&
            (!selectedSetor || comp.setor === selectedSetor)
        )} // Filtra os computadores pela unidade e setor selecionados
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />

</Layout>
    </SafeAreaView>
  );
};


export default ListComputadores;