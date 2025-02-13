import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { LoginForm } from "modules/auth/components/LoginForm/LoginForm";

export const LoginPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LoginForm />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
});
