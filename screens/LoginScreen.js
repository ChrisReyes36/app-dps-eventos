import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import appFirebase from "../credenciales";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(appFirebase);

export default function LoginScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Iniciando sesión", "Accediendo...");
      props.navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Correo o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/profile.jpg")}
        style={styles.profile}
      />
      <Text style={styles.title}>Bienvenido de nuevo</Text>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#525fe1" />
          <TextInput
            placeholder="Correo"
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#525fe1" />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={iniciarSesion}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
    padding: 20,
  },
  profile: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#525fe1",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaeaea",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#525fe1",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
