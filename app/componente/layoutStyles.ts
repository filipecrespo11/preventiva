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
    body: {
      backgroundColor: "rgba(165, 56, 56, 0.74)", // Cor de fundo clara
      display: "flex",
      
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
  
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
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
        
        color: "#343a40",
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
        marginBottom: 20,
        
      
      },
      safeArealist: {
        flex: 1,
        backgroundColor: "#f8f9fa",
      },
      containerlist: {
        flex: 1,
        padding: 20,
      },

  };

  
  
  export default styles;