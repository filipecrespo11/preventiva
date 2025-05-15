import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { jwtDecode } from "jwt-decode";
import Layout from "./componente/layout"; 
import { TextInput, View, Button } from "react-native";
import styles from "./componente/layoutStyles";

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
    const [criamanu, setUser] = useState({
    id_computador: "",
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
  const router = useRouter();


  useEffect(() => {
    if (token) {
      const decoded: DecodedToken = jwtDecode(token); // Decodifica o token
      setUser((prev) => ({ ...prev, id_usuarios: decoded.id })); // Atualiza o estado com o ID do usuário
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
    setUser({ ...criamanu, [name]: value });
  };

  const handleSubmit = async () => {
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
      router.push("/tabs/menu"); // Redireciona para o menu após o cadastro
    } catch (error) {
      console.error("Erro ao criar manutenção:", error);
    }
  };

  return (
    <Layout>
    
    <View>   
    
      <p>Usuário logado: {nomeUsuario}

      </p>
      <View>
      {/* Picker para selecionar o computador */}
      <Picker
          selectedValue={criamanu.id_computador}
          onValueChange={(value) => handleChange("id_computador", value)} // Atualiza o id_computador com o _id selecionado
        >
          <Picker.Item label="Selecione um computador" value="" />
          {computadores.map((computador) => (
            <Picker.Item key={computador._id} label={computador.serviceTag} value={computador._id} />
          ))}
        </Picker> 
        <br/>
        <TextInput
          style={{...styles.input}}
          placeholder="Id do usuario"      
          value={criamanu.id_usuarios}
          onChangeText={(value) => handleChange("id_usuarios", value)}
       
        />
         <br/>
        <TextInput
           style={{...styles.input}}
          placeholder="Chamado"  
          value={criamanu.chamado}
          onChangeText={(value) => handleChange("chamado", value)}
        />
         <br/>
        <TextInput
          style={{...styles.input}}
          placeholder="Status da manutenção"      
          value={criamanu.status_manutencao}
          onChangeText={(value) => handleChange("status_manutencao", value)}
        />
         <br/>
        <TextInput
           style={{...styles.input}}
          placeholder="Data da manutenção anterior"  
          value={criamanu.data_manutencao_anterior}
          onChangeText={(value) => handleChange("data_manutencao_anterior", value)}
        />
         <br/>
        <TextInput
           style={{...styles.input}}
          placeholder="Data da manutenção"  
          value={criamanu.data_manutencao}
          onChangeText={(value) => handleChange("data_manutencao", value)}
        />
         <br/>
        <TextInput
           style={{...styles.input}}
          placeholder="Tipo de manutenção"  
          value={criamanu.tipo_manutencao}
          onChangeText={(value) => handleChange("tipo_manutencao", value)}
        />
         <br/>
        <TextInput
           style={{...styles.input}}
          placeholder="Descrição da manutenção"  
          value={criamanu.descricao_manutencao}
          onChangeText={(value) => handleChange("descricao_manutencao", value)}
        />
          <br/>
          </View> 
        <Button color="rgb(4 155 92)" title= "Cadastrar" />
        <Button color="rgb(4 155 92)" title="Voltar" onPress={() => router.push("/tabs/menu")} />
        
    </View>
    </Layout>
  );
}



  export default NManutencao;
