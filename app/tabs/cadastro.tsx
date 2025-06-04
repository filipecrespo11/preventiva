import { useState } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import Layout from "../componente/layout";
import styles from "../componente/layoutStyles";
import { Button, TextInput, View, Image } from "react-native";
const CadastroScreen = () => {
  const [user, setUser] = useState({
    nome_usuario: "",
    username: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (name: string, value: string) => {
  
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
   
    try {
      await axios.post("http://localhost:3000/auterota/criausuarios", user);
      router.push("/login"); // Redirect to login page after successful registration

    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Layout>
    <View>
      
      <Stack.Screen options={{ title: "" ,headerTitle: () => (
                                        <Image
                                            source={require("../../assets/images/logo.png")} // ajuste o caminho conforme necessário
                                            style={{ width: 120, height: 40, resizeMode: "contain" }}
                                        />
                                    ),
                                }}
                            />
      
      <View >
        <TextInput
          style={{...styles.input}}
          placeholder="Nome Completo"
          value={user.nome_usuario}
          onChangeText={(value)=> handleChange("nome_usuario", value)}
        />
         <br/>
        <TextInput
          style={{...styles.input}}
          placeholder="Username"
          value={user.username}
          onChangeText={(value)=> handleChange("username", value)}
        />
         <br/>
        <TextInput
          style={{...styles.input}}
          placeholder="Senha"
          secureTextEntry
          value={user.password}
         
          onChangeText={(value)=> handleChange("password", value)}
        />
         <br/>
        <Button title="Cadastrar" onPress={handleSubmit} color="rgb(4 155 92)" />
        
      </View>
    </View>
    </Layout>
  );
};

export default CadastroScreen;