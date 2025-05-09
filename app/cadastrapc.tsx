import { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

const CadastropcScreen = () => {
  const [criapc, setUser] = useState({
    nome_computador: "",
    fabricante: "",
    modelo: "",
    serviceTag: "",
    patrimonio: "",
    unidade: "",
    setor: "",
    estado: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...criapc, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/compurota/criacomputador", criapc);
      router.push("/menu"); // Redirect to login page after successful registration

    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <h1>Cadastro de Maquina</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome_computador"
          placeholder="Nome do computador"
          value={criapc.nome_computador}
          onChange={handleChange}
        />
        <input
          type="text"
          name="fabricante"
          placeholder="Fabricante"      
          value={criapc.fabricante}
          onChange={handleChange}   
        />
        <input
          type="text"
          name="modelo"
          placeholder="Modelo"  
          value={criapc.modelo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="serviceTag"
          placeholder="Service Tag"  
          value={criapc.serviceTag}
          onChange={handleChange}
        />
        <input
          type="number"
          name="patrimonio"
          placeholder="Patrimonio"  
          value={criapc.patrimonio}
          onChange={handleChange}
        />
        <input
          type="text"
          name="unidade"
          placeholder="Unidade"  
          value={criapc.unidade}
          onChange={handleChange}
        />
        <input
          type="text"
          name="setor"
          placeholder="Setor"  
          value={criapc.setor}
          onChange={handleChange}   
        />
        <input
          type="text"
          name="estado"
          placeholder="Estado"  
          value={criapc.estado}
          onChange={handleChange}
          />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
  };
  
  export default CadastropcScreen;