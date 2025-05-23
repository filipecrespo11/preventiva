import React from "react";
import styles from "./layoutStyles";


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



export default Layout;