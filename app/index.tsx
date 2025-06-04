import { Text, View, TouchableOpacity, useWindowDimensions, Image} from "react-native";
import { Stack, useRouter  } from "expo-router";
import Layout1 from "./componente/layout1";
import styles from "./componente/layoutStyles";
import AgendaManutencao from "./tabs/calendario";

export default function Index() {


    const router = useRouter();
const { width } = useWindowDimensions();
  return (
    <Layout1 showChildren1={width > 600} children1={<AgendaManutencao />}>
      <View>
        <Stack.Screen options={{ title: "",  headerTitle: () => (
                            <Image
                                source={require("../assets/images/logo.png")} // ajuste o caminho conforme necessário
                                style={{ width: 120, height: 40, resizeMode: "contain" }}
                            />
                        ),
                    }}
                />

        <View style={{...styles.containermenu}}>
          <TouchableOpacity style={{...styles.button}} onPress={() => router.push("/login")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.button}} onPress={() => router.push("/tabs/listapreventiva")}>
            <Text style={styles.buttonText}>Lista de Manutenção</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.button}}  onPress={() => router.push("/tabs/calendario")}>
            <Text style={styles.buttonText}>Calendario</Text>
          </TouchableOpacity>

        </View>
        
      </View>

      

       </Layout1>

  );
}
