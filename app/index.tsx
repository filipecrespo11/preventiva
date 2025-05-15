import { Text, View, TouchableOpacity} from "react-native";
import { Link, Stack, useRouter  } from "expo-router";
import Layout from "./componente/layout";
import styles from "./componente/layoutStyles";

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
