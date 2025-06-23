import React from "react";
import styles from "./layoutStyles";

interface LayoutProps1 {
  children?: React.ReactNode;
  children1?: React.ReactNode;
 showChildren1?: boolean;
}


const Layout1: React.FC<LayoutProps1> = ({ children, children1, showChildren1}) => {
  return (
    <div style={{ ...styles.container, minHeight: "100vh", background: "#f7f7fa" }}>
      {/* Cabeçalho */}
      <header style={{ ...styles.header, marginBottom: 0 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: 1, color: "#fff", margin: 0, padding: 24 }}>Manutenção Preventiva</h1>
      </header>

      {/* Conteúdo Principal */}
      <main style={{
        ...styles.main,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "70vh",
        gap: 40,
        padding: 0,
        margin: 0,
      }}>
        {/* Coluna do calendário */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          padding: 32,
          marginTop: 32,
          marginBottom: 32,
          minWidth: 340,
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* O calendário será renderizado aqui via children1 */}
          {showChildren1 && children1}
        </div>
        {/* Coluna do conteúdo principal */}
        <div style={{
          ...styles.content,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          padding: 32,
          marginTop: 32,
          marginBottom: 32,
          minWidth: 400,
          maxWidth: 600,
        }}>
          {children}
        </div>
      </main>
      {/* Rodapé */}
      <footer style={{
        ...styles.footer,
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: 100,
        background: "#222C36",
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
        padding: "10px 0",
      }}>
        <p style={{ margin: 0 }}>© 2025 Unimed Campos, Manutenção Preventiva. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};


export default Layout1;