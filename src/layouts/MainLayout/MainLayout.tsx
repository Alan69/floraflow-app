import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { NavigationMenu } from "./components/NavigationMenu/NavigationMenu";
import { Header } from "layouts/MainLayout/components/Header/Header";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.layout}>
      <Header />
      <View style={styles.body}>{children}</View>
      <NavigationMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  body: {
    flex: 1,
    padding: 20,
  },
});
