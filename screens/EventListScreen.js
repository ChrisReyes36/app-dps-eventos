import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { db } from "../credenciales"; // Importar Firestore
import { collection, getDocs } from "firebase/firestore";

export default function EventListScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener eventos desde Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventList);
      } catch (error) {
        console.error("Error al cargar eventos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Renderizar cada tarjeta de evento
  const renderEventItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>Fecha: {item.date}</Text>
      <Text style={styles.participants}>
        Participantes: {item.participants}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Eventos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : events.length > 0 ? (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noEvents}>No hay eventos disponibles.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  participants: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginTop: 4,
  },
  noEvents: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 32,
  },
});
