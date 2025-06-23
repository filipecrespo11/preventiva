import React from "react";
import styles from "./layoutStyles";



interface LayoutProps2 {
  children?: React.ReactNode;
  

  
}



const Layout2: React.FC<LayoutProps2> = ({ children}) => {
  return (
    <div style={styles.container}>
  
     

      {/* Conteúdo Principal */}
      
      <main style={styles.main}>

        <div style={styles.content}>{children}</div>
       
        
        
        
        
      </main>
      

     
      
    </div>
  );
};

export default Layout2;