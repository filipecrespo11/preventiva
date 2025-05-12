import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";


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
      const response = await axios.post("http://localhost:3000/auterota/login", user);
      if (response.status === 200) {
        console.log("Login successful");
        setToken(response.data.token); // Armazena o token no contexto
        router.push("/menu");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (

    
    <View
    
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
    <Stack.Screen options={{ title: "Login" }} />
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Login</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "80%",
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
          width: "80%",
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        placeholder="Password"
        secureTextEntry
        value={user.password}
        onChangeText={(value) => handleChange("password", value)}
      />
      <Button title="Login" onPress={handleSubmit} />
    </View>
  );
};

export default LoginScreen;