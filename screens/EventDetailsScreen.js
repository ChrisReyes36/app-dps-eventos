import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { db } from "../credenciales";
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

export default function EventDetailsScreen({ route, navigation }) {
  const { eventId } = route.params; // Obtener el ID del evento
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const [event, setEvent] = useState(null); // Para almacenar los detalles del evento
  const [loading, setLoading] = useState(true);

  // Obtener detalles del evento y comentarios
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnapshot = await getDoc(eventRef);
        if (eventSnapshot.exists()) {
          setEvent(eventSnapshot.data());
        }
      } catch (error) {
        console.error("Error al cargar los detalles del evento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Función para añadir un comentario
  const handleAddComment = async () => {
    if (comment.trim() === "") return;

    try {
      const eventRef = doc(db, "events", eventId);
      const newComment = {
        userId: "1",
        comment: comment,
        rating: rating,
      };

      await updateDoc(eventRef, {
        comments: arrayUnion(newComment),
      });

      // Limpiar formulario y navegar de vuelta
      setComment("");
      setRating(1);
      navigation.goBack();
    } catch (error) {
      console.error("Error al añadir el comentario:", error);
    }
  };

  // Calcular el promedio de valoraciones
  const calculateAverageRating = (comments) => {
    if (!comments || comments.length === 0) return 0;
    const total = comments.reduce((acc, comment) => acc + comment.rating, 0);
    return (total / comments.length).toFixed(1); // Promedio con 1 decimal
  };

  // Renderizar cada comentario
  const renderCommentItem = ({ item }) => (
    <View style={styles.commentCard}>
      <Text style={styles.commentUser}>Usuario: {item.userId}</Text>
      <Text style={styles.commentText}>Comentario: {item.comment}</Text>
      <Text style={styles.commentRating}>Valoración: {item.rating} ★</Text>
    </View>
  );

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Evento</Text>
      <Text style={styles.eventName}>{event?.eventName}</Text>
      <Text style={styles.eventDescription}>{event?.description}</Text>
      <Text style={styles.eventDate}>Fecha: {event?.date}</Text>

      {/* Mostrar promedio de valoraciones */}
      <Text style={styles.averageRating}>
        Promedio de valoraciones: {calculateAverageRating(event?.comments)} ★
      </Text>

      {/* Sección para agregar un comentario */}
      <TextInput
        style={styles.input}
        placeholder="Escribe tu comentario..."
        value={comment}
        onChangeText={setComment}
      />
      <Text>Calificación:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={rating >= star ? styles.filledStar : styles.emptyStar}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
        <Text style={styles.submitText}>Enviar Comentario</Text>
      </TouchableOpacity>

      {/* Mostrar comentarios */}
      <Text style={styles.commentsTitle}>Comentarios</Text>
      <FlatList
        data={event?.comments || []}
        renderItem={renderCommentItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4CAF50",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filledStar: {
    color: "gold",
    fontSize: 24,
  },
  emptyStar: {
    color: "gray",
    fontSize: 24,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  commentCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  commentRating: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 4,
  },
});
