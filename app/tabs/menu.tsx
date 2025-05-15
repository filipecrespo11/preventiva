import { Text, View, Button, TouchableOpacity } from "react-native";
import { Link, Stack, useRouter} from "expo-router";
import Layout from "../componente/layout";
import styles from "../componente/layoutStyles";

export default function Index() {
  
  const router = useRouter();
  
  
  return (
    <Layout>
      <View>
        <Stack.Screen options={{ title: "Manutenção Preventiva" }} />

        <View style={{...styles.containermenu}}>
          <TouchableOpacity style={{...styles.button}} onPress={() => router.push("/login")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.button}} onPress={() => router.push("/tabs/cadastro")}>
            <Text style={styles.buttonText}>Cadastro de Usuários</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.button}} onPress={() => router.push("/cadastrapc")}>
            <Text style={styles.buttonText}>Cadastro de Computador</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.button}} onPress={() => router.push("/novamanutencao")}>
            <Text style={styles.buttonText}>Nova Manutenção</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.button}} onPress={() => router.push("/tabs/listapreventiva")}>
            <Text style={styles.buttonText}>Lista de Manutenção</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.button}} onPress={() => router.push("/listcomp")}>
            <Text style={styles.buttonText}>Lista de Computadores</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}