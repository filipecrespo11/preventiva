import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./componente/layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <AuthProvider>
      <Stack  
        screenOptions={{
                  }}/>
  <Layout>{children}</Layout>; 
    </AuthProvider>
  );
}
