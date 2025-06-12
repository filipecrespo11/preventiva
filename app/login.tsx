import React from "react";
import { View, Text, TextInput, Button, Alert, Platform, Image } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";
import Layout from "./componente/layout";

const urlink = process.env.EXPO_PUBLIC_URI_HOST;

const LoginScreen = () => {
  const { setToken } = useAuth(); // Obtém o setToken do contexto
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();
 
  

  const handleChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${urlink}/auterota/login`, user);
      if (response.status === 200) {
        console.log("Login successful"), Alert.alert("Login bem-sucedido!");
      
          window.alert("Login bem-sucedido!");
        
        
                setToken(response.data.token); // Armazena o token no contexto
        router.push("/tabs/menu");
      } else {
        console.log("Login failed");
        
        window.alert("Login falhou.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      window.alert("Erro ao fazer login.");
    }
  };

  return (
<Layout>
    <View>
      <Stack.Screen options={{ title: "" ,headerTitle: () => (
                                  <Image
                                      source={require("../assets/images/logo.png")} // ajuste o caminho conforme necessário
                                      style={{ width: 120, height: 40, resizeMode: "contain" }}
                                  />
                              ),
                          }}
                      />


    <View>
    
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Login</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "100%",
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        placeholder="Username"
        value={user.username}
        onChangeText={(value) => handleChange("username", value)}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "100%",
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        placeholder="Password"
        secureTextEntry
        value={user.password}
        onChangeText={(value) => handleChange("password", value)}
      />
      <Button title="Login" onPress={handleSubmit} color="rgb(4 155 92)" />
    </View>
    </View>
    </Layout>

  );
};

export default LoginScreen;