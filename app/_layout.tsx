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
                
       
</Stack>
      
    </AuthProvider>
  );
}
