import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import "react-native-gesture-handler";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import EventListScreen from "./screens/EventListScreen";
import EventDetailsScreen from "./screens/EventDetailsScreen";
export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "LOGIN",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#525fe1" },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "HOME",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#525fe1" },
          }}
        />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen} // Nueva pantalla
          options={{
            title: "Crear Evento",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#525fe1" },
          }}
        />
        <Stack.Screen
          name="EventList" // Registra la pantalla aquí
          component={EventListScreen}
          options={{
            title: "Lista de Eventos",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#525fe1" },
          }}
        />
        <Stack.Screen
          name="EventDetails"
          component={EventDetailsScreen}
          options={{
            title: "Detalles del Evento",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#525fe1" },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
