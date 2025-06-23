import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, View, TouchableOpacity, useWindowDimensions, Image} from "react-native";
import { Stack, useRouter  } from "expo-router";
import Layout from "./componente/layout";
import styles from "./componente/layoutStyles";
import AgendaManutencao from "./tabs/calendario";

export default function Index() {


    const router = useRouter();
const { width } = useWindowDimensions();
  return (
    <Layout>
      <View>
        <Stack.Screen options={{ title: "",  headerTitle: () => (
                            <Image
                                source={require("../assets/images/logo.png")} // ajuste o caminho conforme necessário
                                style={{ width: 120, height: 40, resizeMode: "contain" }}
                            />
                        ),
                    }}
                />

   <AgendaManutencao />

        
      </View>

      

       </Layout>

  );
}
