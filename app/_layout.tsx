import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { Image } from "react-native";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <AuthProvider>
   
              <Stack  
        screenOptions={{
              headerStyle: {
            backgroundColor: "#343a40",
            
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}>
        <Stack.Screen name="index" options={{ title: "", headerTitle: () => (
                                    <Image
                                        source={require("../assets/images/logo.png")} // ajuste o caminho conforme necessário
                                        style={{ width: 120, height: 40, resizeMode: "contain" }}
                                    />
                                ),
                            }}
                        />
                
       
</Stack>
      
    </AuthProvider>
  );
}
