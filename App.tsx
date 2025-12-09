import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider, useUser } from "./src/context/UserContext";
import HomeScreen from "./src/screens/Home";
import SplashScreen from "./src/screens/Splash";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import LogoutScreen from "./src/screens/LogoutScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ScheduleScreen from "./src/screens/Schedule";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import UserDetails from "./src/screens/UserDetails";
import PhysicalMeasurements from "./src/screens/PhysicalMeasurements";
import Anthropometrics from "./src/screens/Anthropometrics";
import FitnessForm from "./src/screens/FitnessForm";

const Stack = createNativeStackNavigator();

// Carregamento das fontes
const fetchFonts = () => {
  return Font.loadAsync({
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
  });
};

// Função principal App
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    fetchFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}

// Função para gerenciar as telas com base no token
const AppNavigator = () => {
  const { user } = useUser();

  return (
    <Stack.Navigator
      initialRouteName="SPLASH"
      screenOptions={{ headerShown: false }}
    >
      {user ? (
        <>
          <Stack.Screen name="HOME" component={HomeScreen} />
          <Stack.Screen name="SETTINGS" component={SettingsScreen} />
          <Stack.Screen name="PROFILE" component={UserProfileScreen} />
          <Stack.Screen name="LOGOUT" component={LogoutScreen} />
          <Stack.Screen name="SCHEDULE" component={ScheduleScreen} />
          <Stack.Screen name="USERDETAILS" component={UserDetails} />
          <Stack.Screen
            name="PHYSICALMEASUREMENTS"
            component={PhysicalMeasurements}
          />
          <Stack.Screen name="ANTHROPOMETRICS" component={Anthropometrics} />
          <Stack.Screen name="FITNESSFORM" component={FitnessForm} />
        </>
      ) : (
        <>
          <Stack.Screen name="SPLASH" component={SplashScreen} />
          <Stack.Screen name="LOGIN" component={LoginScreen} />
          <Stack.Screen name="SIGNUP" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
