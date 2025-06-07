import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "../componente/layoutStyles";
import { useAuth } from "../context/AuthContext";


const EditarManutencao = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [manutencao, setManutencao] = useState<any>(null);
const { token } = useAuth(); // Obtém o token do contexto
  useEffect(() => {
    const fetchManutencao = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/manurota/manut/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
        setManutencao(response.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar a manutenção.");
      } finally {
        setLoading(false);
      }
    };
    fetchManutencao();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setManutencao((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/manurota/manut/${id}`, manutencao,  {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
      Alert.alert("Sucesso", "Manutenção atualizada!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a manutenção.");
    }
  };

  if (loading || !manutencao) return <ActivityIndicator size="large" />;

  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.label}>Service Tag:</Text>
      <TextInput
        style={styles.input}
        value={manutencao.serviceTag}
        onChangeText={(v) => handleChange("serviceTag", v)}
      />
      <Text style={styles.label}>Setor:</Text>
      <TextInput
        style={styles.input}
        value={manutencao.setor}
        onChangeText={(v) => handleChange("setor", v)}
      />
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={manutencao.descricao_manutencao}
        onChangeText={(v) => handleChange("descricao_manutencao", v)}
      />
      {/* Adicione outros campos conforme necessário */}
      <Button title="Salvar" onPress={handleUpdate} />
      <Button title="Cancelar" onPress={() => router.back()} />
    </View>
  );
};

export default EditarManutencao;