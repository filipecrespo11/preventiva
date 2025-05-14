import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { jwtDecode } from "jwt-decode";
import Layout from "./componente/layout"; 

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    
    <div>   
    
      <p>Usuário logado: {nomeUsuario}

      </p>
      <form onSubmit={handleSubmit}>
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
        <input
          type="text"
          name="id_usuario"
          placeholder="Id do usuario"      
          value={criamanu.id_usuarios}
          onChange={(e) => handleChange("id_usuario", e.target.value)}
       
        />
        <input
          type="text"
          name="chamado"
          placeholder="Chamado"  
          value={criamanu.chamado}
          onChange={(e) => handleChange("chamado", e.target.value)}
        />
        <input
          type="text"
          name="status_manutencao"
          placeholder="Status da manutenção"      
          value={criamanu.status_manutencao}
          onChange={(e) => handleChange("status_manutencao", e.target.value)}
        />
        <input
          type="text"
          name="data_manutencao_anterior"
          placeholder="Data da manutenção anterior"  
          value={criamanu.data_manutencao_anterior}
          onChange={(e) => handleChange("data_manutencao_anterior", e.target.value)}
        />
        <input
          type="text"
          name="data_manutencao"
          placeholder="Data da manutenção"  
          value={criamanu.data_manutencao}
          onChange={(e) => handleChange("data_manutencao", e.target.value)}
        />
        <input
          type="text"
          name="tipo_manutencao"
          placeholder="Tipo de manutenção"  
          value={criamanu.tipo_manutencao}
          onChange={(e) => handleChange("tipo_manutencao", e.target.value)}
        />
        <input
          type="text"
          name="descricao_manutencao"
          placeholder="Descrição da manutenção"  
          value={criamanu.descricao_manutencao}
          onChange={(e) => handleChange("descricao_manutencao", e.target.value)}
        />
        <button type="submit">Cadastrar</button>
        </form> 
        <button onClick={() => router.push("/tabs/menu")}>Voltar</button>
    </div>
    </Layout>
  );
}



  export default NManutencao;
