import React, { createContext, useState, useContext } from "react";

// Define o tipo do contexto
interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  checklist_hardware?: string;
  checklist_software?: string;
  checklist_perifericos?: string;
}

// Crie o contexto com um valor inicial vazio (forçando o tipo)
export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  checklist_hardware: undefined,
  checklist_software: undefined,
  checklist_perifericos: undefined,
});

// Inicializa o contexto com o tipo correto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [checklist_hardware, setChecklistHardware] = useState<string | undefined>(undefined);
  const [checklist_software, setChecklistSoftware] = useState<string | undefined>(undefined);
  const [checklist_perifericos, setChecklistPerifericos] = useState<string | undefined>(undefined);

  return (
    <AuthContext.Provider value={{
      token,
      setToken,
      checklist_hardware,
      checklist_software,
      checklist_perifericos,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};