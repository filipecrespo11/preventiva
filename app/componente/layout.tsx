import React from "react";
import styles from "./layoutStyles";

interface LayoutProps {
  children?: React.ReactNode;
 

  
}


const Layout: React.FC<LayoutProps> = ({ children}) => {
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
       <footer style={{
        ...styles.footer,
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: 100,
      }}>
        <p>© 2025 Unimed Campos, Manutenção Preventiva. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};


export default Layout;