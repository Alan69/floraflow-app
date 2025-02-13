import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./redux/store";
import AppRoutes from "routes";
import Toast from "react-native-toast-message";
import { View, ActivityIndicator } from "react-native";
import { authActions } from "modules/auth/redux/slices/auth.slice";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (token && refreshToken) {
          store.dispatch(
            authActions.setToken({
              token,
              refreshToken,
            })
          );
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0b9a39" />
      </View>
    );
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <AppRoutes />
          <Toast />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
