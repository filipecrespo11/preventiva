import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <h1>Manutenção Preventiva</h1>
      </header>

      {/* Conteúdo Principal */}
      <main style={styles.main}>
        <div style={styles.content}>{children}</div>
      </main>

      {/* Rodapé */}
      <footer style={styles.footer}>
        <p>© 2025 Manutenção Preventiva. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100vh", // Garante que o layout ocupe toda a altura da janela
    backgroundColor: "#f8f9fa", // Cor de fundo clara
  },
  header: {
    backgroundColor: "#343a40",
    color: "#ffffff",
    fontSize: "24px",
    padding: "10px",
    textAlign: "center" as const,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra leve para o cabeçalho
  },
  main: {
    flex: 1, // Faz o conteúdo principal ocupar o espaço restante
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  content: {
    width: "100%",
    maxWidth: "800px", // Limita a largura máxima do conteúdo
    padding: "20px",
    backgroundColor: "#ffffff", // Fundo branco para destacar o conteúdo
    borderRadius: "8px", // Bordas arredondadas
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra leve
  },
  footer: {
    backgroundColor: "#343a40",
    color: "#ffffff",
    textAlign: "center" as const,
    padding: "10px",
    marginTop: "auto", // Garante que o rodapé fique na parte inferior
  },
};

export default Layout;