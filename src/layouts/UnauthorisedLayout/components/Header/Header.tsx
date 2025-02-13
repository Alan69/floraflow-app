import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";

import { LanguageSelector } from "components/LanguageSelector/LanguageSelector";
import logo from "assets/images/logo.png";

export const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <LanguageSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: Platform.OS === "ios" ? 4 : 20,
    paddingHorizontal: Platform.OS === "ios" ? 8 : 20,
    paddingBottom: Platform.OS === "ios" ? 4 : 0,
    backgroundColor: "#0b9a39",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 96,
    height: 64,
    resizeMode: "cover",
  },
});
