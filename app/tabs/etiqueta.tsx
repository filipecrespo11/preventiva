import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, FlatList, TextInput, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import * as Print from "expo-print";

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
  ultima_preventiva: string;
}

const EtiquetaScreen: React.FC = () => {
    const { token } = useAuth(); // Obtém o token do contexto de autenticação
  const [computadores, setComputadores] = useState<Computador[]>([]);
  const [manutencoes, setManutencoes] = useState<any[]>([]);
  const [dadosCombinados, setDadosCombinados] = useState<Computador[]>([]);
  const [serviceTag, setServiceTag] = useState<string>(""); // Campo para buscar pela Service Tag
  const [itemSelecionado, setItemSelecionado] = useState<Computador | null>(null); // Item selecionado
  const etiquetaRef = useRef<View>(null);

  useEffect(() => {
    const fetchComputadores = async () => {
      try {
        const response = await axios.get("http://localhost:3000/compurota/computadores", {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
        setComputadores(response.data);
      } catch (error) {
        console.error("Erro ao buscar computadores:", error);
        window.alert("Erro Não foi possível carregar a lista de computadores.");
      }
    };

    const fetchManutencoes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/manurota/manutencoes");
        setManutencoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar manutenções:", error);
      }
    };

    if (token) {
        fetchComputadores();
      }
      fetchManutencoes(); // Sempre busca manutenções, pois não precisa de token
    }, [token]);

  useEffect(() => {
    const combinados = computadores.map((computador) => {
      const manutencoesDoComputador = manutencoes.filter(
        (manutencao) =>
          manutencao.serviceTag === computador.serviceTag &&
          manutencao.tipo_manutencao === "Preventiva"
      );

      const ultimaPreventiva = manutencoesDoComputador.length
        ? manutencoesDoComputador.reduce((maisRecente, atual) =>
            new Date(maisRecente.data_manutencao) > new Date(atual.data_manutencao)
              ? maisRecente
              : atual
          ).data_manutencao
        : null;

      return {
        ...computador,
        data_manutencao_anterior: ultimaPreventiva,
        ultima_preventiva: manutencoesDoComputador.length
          ? manutencoesDoComputador[0].data_manutencao
          : null,
      };
    });

    setDadosCombinados(combinados);
  }, [computadores, manutencoes]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSearch = () => {
    const encontrado = dadosCombinados.find((item) => item.serviceTag === serviceTag);
    if (encontrado) {
      setItemSelecionado(encontrado);
    } else {
      window.alert( "Nenhum item encontrado com essa Service Tag.");
      setItemSelecionado(null);
    }
  };

  const handlePrint = async () => {
    if (!itemSelecionado) {
      window.alert("Erro Nenhum item selecionado para impressão.");
      return;
    }
  
    if (!etiquetaRef.current) {
      console.error("etiquetaRef está vazio ou não atribuído.");
      window.alert("Erro Não foi possível capturar a etiqueta.");
      return;
    }
  
    try {
      console.log("Capturando a etiqueta...");
      const uri = await captureRef(etiquetaRef.current, {
        format: "png",
        quality: 1,
      });
  
      console.log("Etiqueta capturada com sucesso:", uri);
      window.alert("Etiqueta capturada com sucesso.");
  
      console.log("Compartilhando a etiqueta...");
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        console.log("Compartilhamento não disponível.");
        window.alert("Compartilhamento não disponível no dispositivo.");
      }
    } catch (error) {
      console.error("Erro ao capturar a etiqueta:", error);
      window.alert("Erro Ocorreu um erro ao capturar a etiqueta.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo de Busca */}
      <TextInput
        style={styles.input}
        placeholder="Digite a Service Tag"
        value={serviceTag}
        onChangeText={setServiceTag}
      />
      <Button title="Buscar" onPress={handleSearch} color="rgb(4 155 92)" />

      {/* Exibir Etiqueta do Item Selecionado */}
      {itemSelecionado && (
        <View ref={etiquetaRef} style={styles.etiquetas}>
          <Text style={styles.title}>Etiqueta do Computador</Text>
          <QRCode value={itemSelecionado.serviceTag} size={90} />
          <Text style={styles.info}>Nome: {itemSelecionado.nome_computador}</Text>
          <Text style={styles.info}>Fabricante: {itemSelecionado.fabricante}</Text>
          <Text style={styles.info}>Modelo: {itemSelecionado.modelo}</Text>
          <Text style={styles.info}>Service Tag: {itemSelecionado.serviceTag}</Text>
          <Text style={styles.info}>Patrimônio: {itemSelecionado.patrimonio}</Text>
          <Text style={styles.info}>
            Última Preventiva: {formatDate(itemSelecionado.ultima_preventiva)}
          </Text>
          <Button title="Imprimir Etiqueta" onPress={handlePrint} color="rgb(4 155 92)" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  etiquetas: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default EtiquetaScreen;