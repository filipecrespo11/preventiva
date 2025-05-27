import React from "react";
import styles from "./layoutStyles";

interface LayoutProps {
  children?: React.ReactNode;
  children1?: React.ReactNode;
  
}

const Layout: React.FC<LayoutProps> = ({ children, children1}) => {
  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <h1>Manutenção Preventiva</h1>
      </header>

      {/* Conteúdo Principal */}
      
      <main style={styles.main}>

        <div style={styles.content}>{children}</div>
        <div style={styles.content}>{children1}</div>
        
        
        
        
      </main>
      

      {/* Rodapé */}
      <footer style={styles.footer}>
        <p>© 2025 Manutenção Preventiva. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};



export default Layout;