import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import store from "./redux/store";
import AppRoutes from "routes";
import Toast from "react-native-toast-message";

const App = () => (
  <ReduxProvider store={store}>
    <PaperProvider>
      <NavigationContainer>
        <AppRoutes />
        <Toast />
      </NavigationContainer>
    </PaperProvider>
  </ReduxProvider>
);

export default App;
