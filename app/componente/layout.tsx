import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <h1>Manutenção Preventiva</h1>
      </header>

      {/* Conteúdo da Página */}
      <main style={styles.main}>{children}</main>

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
    minHeight: "100vh", // Ajustado para ocupar a altura total da janela
  },
  header: {
    backgroundColor: "#343a40",
    color: "#ffffff",
    fontSize: "24px",
    padding: "20px", // Reduzido para um espaçamento mais adequado
    textAlign: "center" as const,
  },
  main: {
    flex: 1, // Faz o conteúdo ocupar o espaço restante
    padding: "150px", // Ajustado para um espaçamento mais adequado
    backgroundColor: "#f8f9fa",
    color: "#212529",
    fontSize: "18px",
  },

  globalDiv: {
    padding: "300px", // Padding aplicado a todos os <div> dentro do layout
  },


  footer: {
    backgroundColor: "#f8f9fa",
    color: "#6c757d",
    textAlign: "center" as const,
    padding: "10px", // Reduzido para evitar excesso de espaço
  },
};

export default Layout;