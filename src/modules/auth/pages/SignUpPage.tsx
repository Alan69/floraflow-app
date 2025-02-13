import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { SignUpForm } from "modules/auth/components/SignUpForm/SignUpForm";

export const SignUpPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SignUpForm />
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
