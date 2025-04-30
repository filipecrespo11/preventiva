import {useState} from "react";
import axios from "axios";  
import {useNavigate} from "react-router-dom";

const cadastro = () => { 
  const [user, setUser] = useState({
    nome_usuario: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/usuarios", usuarios );
      navigate("/index");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          nome_usuario="nome_usuario"
          placeholder="Nome de usuário"
          value={user.nome_usuario}
          value={user.nome_usuario}
          onChange={handleChange}
        />
        <input
          type="username"
          name="username"
          placeholder="username"  
          value={user.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={user.password}
          onChange={handleChange}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
