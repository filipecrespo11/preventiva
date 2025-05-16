import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { jwtDecode } from "jwt-decode";
import Layout from "./componente/layout"; 
import { TextInput, View, Button, Text, Alert, ScrollView, TouchableOpacity, Platform } from "react-native";
import styles from "./componente/layoutStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";



interface DecodedToken {
    id: string; // Certifique-se de que o campo corresponde ao ID do usuário no token
    nome: string; // Nome do usuário
  }

  interface Computador {
    _id: string;
    serviceTag: string;
  }
 


const NManutencao = () => {
    const { token } = useAuth(); // Obtém o token do contexto
    const [criamanu, setCriamanu] = useState({
    id_computador: "",
    servicetag: "",
    id_usuarios: "",
    chamado: "",
    status_manutencao: "",
    data_manutencao_anterior: "",
    data_manutencao: "",
    tipo_manutencao: "",
    descricao_manutencao: "",
  });

  const [computadores, setComputadores] = useState<Computador[]>([]); // Estado para armazenar os computadores
  const [nomeUsuario, setNomeUsuario] = useState(""); // Estado para armazenar o nome do usuário
  
  // Estados para o DatePicker
  const [dateAnterior, setDateAnterior] = useState(new Date());
  const [showPickerAnterior, setShowPickerAnterior] = useState(false);
  const [dateManutencao, setDateManutencao] = useState(new Date());
  const [showPickerManutencao, setShowPickerManutencao] = useState(false);

  
  const router = useRouter();


  useEffect(() => {
    if (token) {
      const decoded: DecodedToken = jwtDecode(token); // Decodifica o token
      setCriamanu((prev) => ({ ...prev, id_usuarios: decoded.id })); // Atualiza o estado com o ID do usuário
      setNomeUsuario(decoded.nome); // Atualiza o estado com o nome do usuário 
         
    }
  }, [token]);


  useEffect(() => {
    const fetchComputadores = async () => {
      try {
        const response = await axios.get("http://localhost:3000/compurota/computadores", 
            {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
        setComputadores(response.data); // Define os computadores no estado
        
      } catch (error) {
        console.error("Erro ao buscar computadores:", error);
      }
    };

    if (token) {
      fetchComputadores();
    }
  }, [token]);

  const handleChange = (name: string, value: string) => {
     // Para o campo 'chamado', converter para número se possível, ou validar no backend
     if (name === "chamado") {
      const numValue = parseInt(value, 10);
      setCriamanu({ ...criamanu, [name]: isNaN(numValue) ? "" : numValue.toString() }); // Mantém como string no form, mas pode ser numérico
    } else {
      setCriamanu({ ...criamanu, [name]: value });
    }
  };


  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onChangeDateAnterior = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateAnterior;
    setShowPickerAnterior(Platform.OS === 'web'); // No iOS, o picker é um modal, então pode continuar visível
    setDateAnterior(currentDate);
    if (selectedDate) {
      handleChange("data_manutencao_anterior", formatDate(currentDate));
    }
  };

  const onChangeDateManutencao = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateManutencao;
    setShowPickerManutencao(Platform.OS === 'web');
    setDateManutencao(currentDate);
    if (selectedDate) {
      handleChange("data_manutencao", formatDate(currentDate));
    }
  };

  const toggleDatePickerAnterior = () => setShowPickerAnterior(!showPickerAnterior);
  const toggleDatePickerManutencao = () => setShowPickerManutencao(!showPickerManutencao);


  const handleSubmit = async () => {
    // Validação básica antes de enviar
    if (!criamanu.id_computador || !criamanu.servicetag || !criamanu.id_usuarios || !criamanu.chamado || !criamanu.data_manutencao || !criamanu.tipo_manutencao || !criamanu.descricao_manutencao) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
        try {
      await axios.post(
        "http://localhost:3000/manurota/criamanutencao",
        criamanu,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        }
      );
      Alert.alert("Sucesso", "Manutenção criada com sucesso!");
      router.push("/tabs/menu"); // Redireciona para o menu após o cadastro
    } catch (error) {
      console.error("Erro ao criar manutenção:", error);
      Alert.alert("Erro", "Não foi possível criar a manutenção. Tente novamente.");
    }
  };

  return (
    <Layout>
    
    <ScrollView>
        <View>
        
          <Picker

          selectedValue={criamanu.id_computador}
         
          onValueChange={(value) => {handleChange("id_computador", value); // Atualiza o id_computador com o _id selecionado
          const selectedComputer = computadores.find((computador) => computador._id === value); // Encontra o computador correspondente
          
          if (selectedComputer) {
            handleChange("servicetag", selectedComputer.serviceTag); // Atualiza a Service Tag automaticamente
          }
        }}
       
       >
          <Picker.Item label="Selecione um computador" value="" />
          {computadores.map((computador) => (
            <Picker.Item key={computador._id} label={computador.serviceTag} value={computador._id} />
          ))}
        </Picker> 
        <br/>
        <TextInput
          style={{...styles.input}}
          placeholder="Service Tag"    
         value={criamanu.servicetag}
         onChangeText={(value) => handleChange("servicetag", value)}
       
        />
         <br/>
        <Text >ID do Usuário (automático):</Text>
        <TextInput
          style={{...styles.input}}
          placeholder="Id do usuario"      
          value={criamanu.id_usuarios}
          onChangeText={(value) => handleChange("id_usuarios", value)}
       
        />
         <br/>
        <TextInput
           style={{...styles.input}}
          placeholder="Número do Chamado"  
          value={criamanu.chamado}
          onChangeText={(value) => handleChange("chamado", value)}
        />
         <br/>
        <TextInput
          style={{...styles.input}}
          placeholder="Status da Manutenção (Ex: Pendente, Em Andamento, Concluída)"      
          value={criamanu.status_manutencao}
          onChangeText={(value) => handleChange("status_manutencao", value)}
        />
         <br/>


        <TouchableOpacity onPress={toggleDatePickerAnterior}>
          <TextInput
            style={{...styles.input}}
            placeholder="Selecione a Data da Manutenção Anterior (YYYY-MM-DD)"
            value={criamanu.data_manutencao_anterior}
            editable={false} // Para não permitir edição direta
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
         <br/>

        <TouchableOpacity onPress={toggleDatePickerManutencao}>
          <TextInput
            style={{...styles.input}}
            placeholder="Selecione a Data da Manutenção (YYYY-MM-DD)"
            value={criamanu.data_manutencao}
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
         <br/>


        <TextInput
           style={{...styles.input}}
          placeholder="Tipo de Manutenção (Ex: Preventiva, Corretiva)"  
          value={criamanu.tipo_manutencao}
          onChangeText={(value) => handleChange("tipo_manutencao", value)}
        />
         <br/>
        <TextInput
           style={{...styles.input}}
          placeholder="Descrição Detalhada da Manutenção"  
          value={criamanu.descricao_manutencao}
          onChangeText={(value) => handleChange("descricao_manutencao", value)}
        />
          <br/>
      </View> 
        <Button color="rgb(4 155 92)" title= "Cadastrar" onPress={handleSubmit} />
        <Button color="rgb(4 155 92)" title="Voltar" onPress={() => router.push("/tabs/menu")} />
        
    </ScrollView>
    </Layout>
  );
}



  export default NManutencao;
