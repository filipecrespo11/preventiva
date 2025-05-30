import React from "react";
import styles from "./layoutStyles";



interface LayoutProps2 {
  children?: React.ReactNode;
  children1?: React.ReactNode;

  
}



const Layout2: React.FC<LayoutProps2> = ({ children, children1}) => {
  return (
    <div style={styles.container}>
  
     

      {/* Conteúdo Principal */}
      
      <main style={styles.main}>

        <div style={styles.content}>{children}</div>
        <div style={styles.content}>{children1}</div>
        
        
        
        
      </main>
      

     
      
    </div>
  );
};

export default Layout2;