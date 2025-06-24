import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "../componente/layoutStyles";
import { useAuth } from "../../src/context/AuthContext";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Layout from "../componente/layout";

const urlink = process.env.EXPO_PUBLIC_URI_HOST;




const EditarManutencao = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [manutencao, setManutencao] = useState<any>(null);
    const [dateAnterior, setDateAnterior] = useState(new Date());
  const [showPickerAnterior, setShowPickerAnterior] = useState(false);
  const [dateManutencao, setDateManutencao] = useState(new Date());
  const [showPickerManutencao, setShowPickerManutencao] = useState(false);
const { token } = useAuth(); // Obtém o token do contexto
  useEffect(() => {
    const fetchManutencao = async () => {
      try {
        const response = await axios.get(`${urlink}/manurota/manut/${id}`, {
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
      await axios.put(`${urlink}/manurota/manut/${id}`, manutencao,  {
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


    const formatDate = (date: Date | undefined) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
  
    const onChangeDateAnterior = (event: DateTimePickerEvent, selectedDate?: Date) => {
      const currentDate = selectedDate || dateAnterior;
      setShowPickerAnterior(false);
      setDateAnterior(currentDate);
      if (selectedDate) {
        handleChange("data_manutencao_anterior", formatDate(currentDate));
      }
    };
  
    const onChangeDateManutencao = (event: DateTimePickerEvent, selectedDate?: Date) => {
      const currentDate = selectedDate || dateManutencao;
      setShowPickerManutencao(false);
      setDateManutencao(currentDate);
      if (selectedDate) {
        handleChange("data_manutencao", formatDate(currentDate));
      }
    };
  
    const toggleDatePickerAnterior = () => setShowPickerAnterior(!showPickerAnterior);
    const toggleDatePickerManutencao = () => setShowPickerManutencao(!showPickerManutencao);
  

  return (
    <Layout>   
    <View style={{ padding: 16 }}>
      
      <TextInput
        style={styles.input}
        placeholder="Service Tag"
        value={manutencao.serviceTag}
        onChangeText={(v) => handleChange("serviceTag", v)}
      />
      <TextInput
            style={{ ...styles.input }}
            placeholder="Número do Chamado"
            value={manutencao.chamado}
            onChangeText={(value) => handleChange("chamado", value)}
          />
      
      <TextInput
        style={styles.input}
        placeholder="Setor"
        value={manutencao.setor}
        onChangeText={(v) => handleChange("setor", v)}
      />

       {Platform.OS === "web" ? (
            <input
              type="date"
              value={manutencao.data_manutencao_anterior || ""}
              onChange={(e) => handleChange("data_manutencao_anterior", e.target.value)}
              style={styles.input as any}
            />
          ) : (
            <>
              <TouchableOpacity onPress={toggleDatePickerAnterior}>
                <TextInput
                  style={{ ...styles.input }}
                  placeholder="Selecione a Data da Manutenção Anterior"
                  value={manutencao.data_manutencao_anterior}
                  editable={false}
                />
              </TouchableOpacity>
              {showPickerAnterior && (
                <DateTimePicker
                  value={dateAnterior}
                  mode="date"
                  display="default"
                  onChange={onChangeDateAnterior}
                />
              )}
            </>
          )}

          {Platform.OS === "web" ? (
            <input
              type="date"
              value={manutencao.data_manutencao || ""}
              onChange={(e) => handleChange("data_manutencao", e.target.value)}
              style={styles.input as any}
            />
          ) : (
            <>
              <TouchableOpacity onPress={toggleDatePickerManutencao}>
                <TextInput
                  style={{ ...styles.input }}
                  placeholder="Selecione a Data da Manutenção"
                  value={manutencao.data_manutencao}
                  editable={false}
                />
              </TouchableOpacity>
              {showPickerManutencao && (
                <DateTimePicker
                  value={dateManutencao}
                  mode="date"
                  display="default"
                  onChange={onChangeDateManutencao}
                />
              )}
            </>
          )}
      
      <TextInput
        style={styles.input}
        placeholder="Descrição da Manutenção"
        value={manutencao.descricao_manutencao}
        onChangeText={(v) => handleChange("descricao_manutencao", v)}
      />
      {/* Adicione outros campos conforme necessário */}
      <Button title="Salvar" onPress={handleUpdate} />
      <Button title="Cancelar" onPress={() => router.back()} />
    </View>
    </Layout>
  );
};

export default EditarManutencao;