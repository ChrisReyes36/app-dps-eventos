import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../credenciales"; // Asegúrate de importar tu Firestore correctamente
import { getAuth, signOut } from "firebase/auth"; // Importa Firebase Auth

const auth = getAuth(); // Instancia de autenticación

export default function HomeScreen({ navigation }) {
  const [eventCount, setEventCount] = useState(0); // Estado para almacenar el conteo de eventos

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (querySnapshot) => {
      setEventCount(querySnapshot.size); // Obtén el número de documentos en tiempo real
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []); // Solo se ejecuta al montar el componente

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
        navigation.replace("Login"); // Redirige a la pantalla de inicio de sesión
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Hubo un problema al cerrar sesión.");
      });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      {/* Sección de estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="people-outline" size={36} color="#4CAF50" />
          <Text style={styles.statTitle}>Usuarios</Text>
          <Text style={styles.statValue}>1</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="cart-outline" size={36} color="#FF9800" />
          <Text style={styles.statTitle}>Eventos</Text>
          <Text style={styles.statValue}>{eventCount}</Text> {/* Muestra el conteo dinámico */}
        </View>
        <View style={styles.statBox}>
          <Ionicons name="trending-up-outline" size={36} color="#2196F3" />
          <Text style={styles.statTitle}>Crecimiento</Text>
          <Text style={styles.statValue}>12%</Text>
        </View>
      </View>

      {/* Botones de navegación */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("EventList")} // Redirige a la lista de eventos
        >
          <Ionicons name="list-outline" size={20} color="#fff" />
          <Text style={styles.navButtonText}>Ver Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text style={styles.navButtonText}>Configuración</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para crear eventos */}
      <View style={styles.createEventContainer}>
        <TouchableOpacity
          style={styles.createEventButton}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.createEventButtonText}>Crear Evento Comunitario</Text>
        </TouchableOpacity>
      </View>

      {/* Sección adicional */}
      <View style={styles.extraSection}>
        <Text style={styles.sectionTitle}>Últimas Actividades</Text>
        <Text style={styles.activityItem}>• Usuario agregó un evento.</Text>
        <Text style={styles.activityItem}>• Nueva actualización publicada.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#525fe1",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcon: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 8,
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    backgroundColor: "#6200ea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    width: "45%",
    elevation: 3,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
  },
  createEventContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  createEventButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 20,
    width: "80%",
    elevation: 3,
  },
  createEventButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  extraSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  activityItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
});
