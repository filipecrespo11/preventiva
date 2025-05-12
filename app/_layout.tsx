import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <AuthProvider>
      <Stack  
        screenOptions={{
                  }}/>
      {children}
    </AuthProvider>
  );
}
