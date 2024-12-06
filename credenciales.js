import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVLcf7a6p9MrIpG08mvLUktVQ9BU9ZEB0",
  authDomain: "app-dps-27c35.firebaseapp.com",
  projectId: "app-dps-27c35",
  storageBucket: "app-dps-27c35.firebasestorage.app",
  messagingSenderId: "734968235611",
  appId: "1:734968235611:web:d509f9495383d36dcb217e",
};

// Inicializar Firebase
const appFirebase = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(appFirebase); // Firestore
export const auth = getAuth(appFirebase); // Auth
export default appFirebase;
