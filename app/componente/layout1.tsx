import React from "react";
import styles from "./layoutStyles";

interface LayoutProps1 {
  children?: React.ReactNode;
  children1?: React.ReactNode;
 showChildren1?: boolean;
}


const Layout1: React.FC<LayoutProps1> = ({ children, children1, showChildren1}) => {
  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <h1>Manutenção Preventiva</h1>
      </header>

      {/* Conteúdo Principal */}
      
      <main style={styles.main}>

        <div style={styles.content}>{children}</div>
         {showChildren1 && children1 && (
          <div style={styles.content}>{children1}</div>
        )}
        
        
        
        
      </main>
      

      {/* Rodapé */}
      <footer style={styles.footer}>
        <p>© 2025 Manutenção Preventiva. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};


export default Layout1;