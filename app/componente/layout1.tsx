import React from "react";
import { View, Text, Platform, StyleSheet, useWindowDimensions } from "react-native";

interface LayoutProps1 {
  children?: React.ReactNode;
  children1?: React.ReactNode;
  showChildren1?: boolean;
}

const Layout1: React.FC<LayoutProps1> = ({ children, children1, showChildren1 }) => {
  const { height } = useWindowDimensions();
  // Altura mínima responsiva (exemplo: 90% da altura da tela)
  const minHeight = height * 0.9;

  return (
    <View style={[styles.container, { minHeight, backgroundColor: "#f7f7fa" }]}> 
      {/* Cabeçalho */}
      <View style={[styles.header, { marginBottom: 0 }]}> 
        <Text style={styles.headerText}>Manutenção Preventiva</Text>
      </View>
      {/* Conteúdo Principal */}
      <View style={styles.mainRow}>
        {/* Coluna do calendário */}
        <View style={[
          styles.calendarCol,
          Platform.OS === "web"
            ? { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }
            : { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
        ]}>
          {showChildren1 && children1}
        </View>
        {/* Coluna do conteúdo principal */}
        <View style={[
          styles.contentCol,
          Platform.OS === "web"
            ? { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }
            : { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
        ]}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#222C36",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    marginBottom: 0,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#fff",
    margin: 0,
    padding: 0,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: 400,
    padding: 0,
    margin: 0,
    width: "100%",
  },
  calendarCol: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    marginTop: 32,
    marginBottom: 32,
    minWidth: 340,
    maxWidth: 400,
    alignItems: "center",
    marginRight: 20,
  },
  contentCol: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    marginTop: 32,
    marginBottom: 32,
    minWidth: 400,
    maxWidth: 600,
  },
});

export default Layout1;