import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Importar DateTimePicker
import { db } from "../credenciales";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateEventScreen({ navigation }) {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date()); // Almacena la fecha seleccionada como un objeto Date
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para controlar la visibilidad del DateTimePicker

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Ocultar el DatePicker después de seleccionar
    if (selectedDate) {
      setDate(selectedDate); // Actualizar la fecha seleccionada
    }
  };

  const handleSubmit = async () => {
    if (!eventName || !description || !date || !participants) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(participants)) {
      Alert.alert("Error", "El número de participantes debe ser un valor numérico.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "events"), {
        eventName,
        description,
        date: date.toISOString().split("T")[0], // Convertir fecha a formato "YYYY-MM-DD"
        participants: parseInt(participants, 10),
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      Alert.alert("Éxito", "El evento se registró correctamente.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error al guardar el evento: ", error);
      setLoading(false);
      Alert.alert("Error", "No se pudo registrar el evento. Inténtalo nuevamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Evento</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del evento"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)} // Mostrar el DatePicker al presionar
      >
        <Text style={{ color: "#000" }}>
          {date ? date.toISOString().split("T")[0] : "Seleccionar fecha"} {/* Mostrar fecha seleccionada */}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Número de participantes"
        value={participants}
        onChangeText={setParticipants}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registrando..." : "Registrar Evento"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
