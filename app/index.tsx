import { Text, View } from "react-native";
import { Link, Stack } from "expo-router";
import Layout from "./componente/layout";

export default function Index() {
  return (
    <Layout>
    <View>
      <Stack.Screen options={{ title: "N" }} />

    <View
      >   
      <Link href="/login">
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      </Link>
      <Link href="/tabs/cadastro">
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Cadastro de usuarios</Text>
      </Link>
      <Link href="/tabs/listapreventiva">
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Lista de Manutenção</Text>
      </Link>
      
    </View>
    </View> 
    </Layout>
    
  );
}
