import { Text, View } from "react-native";
import { Link, Stack } from "expo-router";

export default function Index() {
  return (
    <View>
      <Stack.Screen options={{ title: "Manutenção Preventiva" }} />
  
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <Link href="/login">
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      </Link>
      <Link href="/cadastro">
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Cadastro de usuarios</Text>
      </Link>
      <Link href="/cadastrapc">
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Cadastro de Computador</Text>
      </Link>
        <Link href="/novamanutencao">
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Nova de Manutenção</Text>
      </Link>
      <Link href="/listapreventiva">
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Lista de Manutenção</Text>
      </Link>
      <Link href="/listcomp">
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Lista de Computadorers</Text>
      </Link>
      
      
    </View>
    
    </View>
    
  );
}