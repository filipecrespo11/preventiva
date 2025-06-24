import { AuthProvider } from "../src/context/AuthContext";
import { useAuth } from "../src/context/AuthContext";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { token } = useAuth();
  const activeRoute = props.state.routeNames[props.state.index];
  return (
    <View style={{ flex: 1, paddingTop: 40, backgroundColor: "#f7f7fa" }}>
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 120, height: 40, resizeMode: "contain" }}
        />
      </View>
      <TouchableOpacity
        style={{ padding: 16, borderRadius: 8, marginBottom: 8, backgroundColor: activeRoute === "index" ? "#1976d2" : "transparent" }}
        onPress={() => router.push("/")}
      >
        <Text style={{ color: activeRoute === "index" ? "#fff" : "#222C36", fontSize: 18, fontWeight: "600" }}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 16, borderRadius: 8, marginBottom: 8, backgroundColor: activeRoute === "login" ? "#1976d2" : "transparent" }}
        onPress={() => router.push("/login")}
      >
        <Text style={{ color: activeRoute === "login" ? "#fff" : "#222C36", fontSize: 18, fontWeight: "600" }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 16, borderRadius: 8, marginBottom: 8, backgroundColor: activeRoute === "listapreventiva" ? "#1976d2" : "transparent" }}
        onPress={() => router.push("/tabs/listapreventiva")}
      >
        <Text style={{ color: activeRoute === "listapreventiva" ? "#fff" : "#222C36", fontSize: 18, fontWeight: "600" }}>Lista Preventiva</Text>
      </TouchableOpacity>
      {token && (
        <TouchableOpacity
          style={{ padding: 16, borderRadius: 8, marginBottom: 8, backgroundColor: activeRoute === "menu" ? "#1976d2" : "transparent" }}
          onPress={() => router.push("/tabs/menu")}
        >
          <Text style={{ color: activeRoute === "menu" ? "#fff" : "#222C36", fontSize: 18, fontWeight: "600" }}>Menu</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Drawer
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#222C36",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 6,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 22,
            letterSpacing: 1,
          },
          headerTitle: () => (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Image
                source={require("../assets/images/logo.png")}
                style={{ width: 140, height: 48, resizeMode: "contain", marginVertical: 6 }}
              />
            </View>
          ),
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="login" options={{ title: "Login" }} />
        <Drawer.Screen name="listapreventiva" options={{ title: "Lista Preventiva" }} />
        <Drawer.Screen name="menu" options={{ title: "Menu" }} />
      </Drawer>
    </AuthProvider>
  );
}
