import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";


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
        <Stack.Screen name="index" options={{ title: "Pagina Inicial" }} />
        <Stack.Screen name="novamanutencao" options={{ title: "Nova Manutenção" }} />
        <Stack.Screen name="manutencao" options={{ title: "Manutenção" }} />
        <Stack.Screen name="manutencaopendente" options={{ title: "Manutenção Pendente" }} />
       
</Stack>
      
    </AuthProvider>
  );
}
