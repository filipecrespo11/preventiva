
import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const styles = {

    

    container: {
      flex: 1,
      flexDirection: "column" as const,
      minHeight: "90vh", // Garante que o layout ocupe toda a altura da janela
      backgroundColor: "#ffffff", // Cor de fundo clara
      overflow: "auto", // Permite rolagem vertical se necessário
    },
    
    header: {
      backgroundColor: "rgb(4 155 92)",
      color: "#ffffff",
      fontSize: "24px",
      padding: "10px",
      textAlign: "center" as const,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra leve para o cabeçalho
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,  
      elevation: 3,
    },
    body: {
      flex: 1,
      backgroundColor: "rgba(165, 56, 56, 0.74)", // Cor de fundo clara
      overflow: "auto",
      
      
    },
    main: {
      flex: "1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "50px , 50px , 50px , 50px",
      
     
      
      
    },
    content: {
     display: "inline-table",
      
      width: "90%",
      maxWidth: "800px", // Limita a largura máxima do conteúdo    
      padding: "20px",
      backgroundColor: "#ffffff", // Fundo branco para destacar o conteúdo
      borderRadius: "8px", // Bordas arredondadas
      boxShadow: "0 4px 6px rgb(4 155 92)", // Sombra leve


    },
  
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
     backgroundColor: '#fff', // Garante fundo branco para inputs
  },
    
    footer: {
      backgroundColor: "#343a40",
      color: "#ffffff",
      textAlign: "center" as const,
      padding: "10px",
      marginTop: "auto", // Garante que o rodapé fique na parte inferior
      
    },

//lista 

    label: {
        padding: 8,
        color: "#343a40",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: "#ffffff",
        marginBottom: 10,
       
      },

      item: {
        marginBottom: 10,
        padding: 15,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },

      list: {
        paddingBottom: 20,
    },
    title: {
         fontSize: 18, // Adicionado tamanho de fonte
    fontWeight: 'bold', // Títulos geralmente são em negrito
    marginBottom: 20,
    textAlign: 'center',

        
      
      },
      safeArealist: {
        flex: 1,
        backgroundColor: "#f8f9fa",
      },
      containerlist: {
    
        flex: 1,
        padding: 10,
      },

      //menu

      containermenu: {
        padding: 20,
      },

      button: {
        backgroundColor: "rgb(4 155 92)",
        padding: 15,
         borderRadius: 5, // Adicionado borderRadius
        marginBottom: 10,
        paddingVertical: 12, // Ajustado padding
    paddingHorizontal: 15,
      },
      buttonText: {
        color: "#fff",
        fontSize: 16, // Adicionado tamanho de fonte
    
      },

      //etiqueta
      etiquetas: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
      },

      info: {
        fontSize: 14,
        marginTop: 5,
            textAlign: 'center', // Centraliza texto da info
      },


  };

  
  
  export default styles;