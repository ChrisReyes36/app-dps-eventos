import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDVLcf7a6p9MrIpG08mvLUktVQ9BU9ZEB0",
  authDomain: "app-dps-27c35.firebaseapp.com",
  projectId: "app-dps-27c35",
  storageBucket: "app-dps-27c35.firebasestorage.app",
  messagingSenderId: "734968235611",
  appId: "1:734968235611:web:d509f9495383d36dcb217e",
};

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
