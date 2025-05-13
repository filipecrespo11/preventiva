import { useState } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";

const CadastroScreen = () => {
  const [user, setUser] = useState({
    nome_usuario: "",
    username: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/auterota/criausuarios", user);
      router.push("/login"); // Redirect to login page after successful registration

    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      
      <Stack.Screen options={{ title: "Cadastro" }} />
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome_usuario"
          placeholder="Nome de usuário"
          value={user.nome_usuario}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
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
};

export default CadastroScreen;