import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { db } from "../credenciales"; // Importar Firestore
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"; // Añadir updateDoc
import Icon from "react-native-vector-icons/MaterialIcons"; // Importar iconos

export default function EventListScreen({ navigation }) {
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

  // Función para eliminar evento
  const handleDeleteEvent = (eventId) => {
    Alert.alert(
      "Eliminar Evento",
      "¿Estás seguro de que deseas eliminar este evento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              // Eliminar el evento de Firestore
              const eventRef = doc(db, "events", eventId);
              await deleteDoc(eventRef);
              // Actualizar la lista de eventos
              setEvents(events.filter(event => event.id !== eventId));
              Alert.alert("Éxito", "El evento ha sido eliminado.");
            } catch (error) {
              console.error("Error al eliminar evento: ", error);
              Alert.alert("Error", "Hubo un error al eliminar el evento.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Función para confirmar asistencia
  const handleConfirmAttendance = async (eventId, userId) => {
    const event = events.find((event) => event.id === eventId);

    if (!event) {
      Alert.alert("Error", "Evento no encontrado.");
      return;
    }

    try {
      const updatedAttendees = event.attendees || [];
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        attendees: [...updatedAttendees, userId],
      });

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === eventId ? { ...ev, attendees: [...updatedAttendees, userId] } : ev
        )
      );

      Alert.alert("Confirmación", "Tu asistencia ha sido registrada.");
    } catch (error) {
      console.error("Error al confirmar asistencia: ", error);
      Alert.alert("Error", "Hubo un error al confirmar tu asistencia.");
    }
  };

  const handleShareEvent = (event) => {
    Alert.alert("Compartir Evento", `Compartiendo evento: ${event.eventName}`);
  };

  const renderEventItem = ({ item }) => {
    const userHasConfirmed = item.attendees && item.attendees.includes("userIdPlaceholder");

    return (
      <View style={styles.card}>
        {/* Contenedor de los botones de eliminar y compartir */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteEvent(item.id)}
          >
            <Icon name="delete" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => handleShareEvent(item)}
          >
            <Icon name="share" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>Fecha: {item.date}</Text>
        <Text style={styles.participants}>Participantes: {item.participants}</Text>

        <Text style={styles.attendeesTitle}>Asistentes:</Text>
        {item.attendees && item.attendees.length > 0 ? (
          <FlatList
            data={item.attendees}
            renderItem={({ item }) => <Text style={styles.attendee}>{item}</Text>}
            keyExtractor={(attendee) => attendee}
          />
        ) : (
          <Text>No hay asistentes todavía.</Text>
        )}

        <TouchableOpacity
          style={styles.attendanceButton}
          onPress={() => handleConfirmAttendance(item.id, "userIdPlaceholder")}
          disabled={userHasConfirmed}
        >
          <Text style={styles.attendanceButtonText}>
            {userHasConfirmed ? "Asistencia Confirmada" : "Confirmar Asistencia"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
        >
          <Text style={styles.commentButtonText}>Añadir Comentario y Valoración</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
    position: "relative",
  },
  iconsContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
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
  commentButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginTop: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  commentButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  attendanceButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginTop: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  attendanceButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
