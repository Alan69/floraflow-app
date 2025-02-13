import { LanguageSelector } from "components/LanguageSelector/LanguageSelector";
import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Header } from "./components/Header/Header";

export const UnauthorisedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SafeAreaView style={styles.layout}>
      <Header />
      {children}
      <View style={styles.footer}>
        <Text>Flora flow</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  footer: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
});
