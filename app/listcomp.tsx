import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, TextInput, Image } from "react-native";
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

  const [searchTerm, setSearchTerm] = useState<string>(""); // Novo estado para pesquisa

  const TableHeader = () => (
  <View style={{ flexDirection: "row", backgroundColor: "#e0e0e0", padding: 8 }}>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Nome</Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Fabricante</Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Modelo</Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Service Tag</Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Patrimônio</Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Unidade</Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Setor</Text>
    <Text style={[styles.label, { flex: 1, fontWeight: "bold" }]}>Estado</Text>
  </View>
);

  const renderItem = ({ item }: { item: Computador }) => (
  <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#e0e0e0", padding: 8 }}>
    <Text style={[styles.label, { flex: 1 }]}>{item.nome_computador}</Text>
    <Text style={[styles.label, { flex: 1 }]}>{item.fabricante}</Text>
    <Text style={[styles.label, { flex: 1 }]}>{item.modelo}</Text>
    <Text style={[styles.label, { flex: 1 }]}>{item.serviceTag}</Text>
    <Text style={[styles.label, { flex: 1 }]}>{item.patrimonio}</Text>
    <Text style={[styles.label, { flex: 1 }]}>{item.unidade}</Text>
    <Text style={[styles.label, { flex: 1 }]}>{item.setor}</Text>
    <Text style={[styles.label, { flex: 1 }]}>{item.estado}</Text>
    
  </View>
);

  return (
    <SafeAreaView style={{...styles.containerlist}}>
      <Layout>
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
        placeholder="Pesquisar por nome ou Service Tag"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TableHeader />
        <FlatList
        data={computadores.filter(
          (comp) =>
            (!selectedUnidade || comp.unidade === selectedUnidade) &&
            (!selectedSetor || comp.setor === selectedSetor) &&
            (
              comp.nome_computador.toLowerCase().includes(searchTerm.toLowerCase()) ||
              comp.serviceTag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )} // Filtra por unidade, setor, nome ou service tag
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />

</Layout>
    </SafeAreaView>
  );
};


export default ListComputadores;