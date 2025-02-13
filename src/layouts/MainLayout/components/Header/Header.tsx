import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { authActions } from "modules/auth/redux/slices/auth.slice";
import { LanguageSelector } from "components/LanguageSelector/LanguageSelector";
import Toast from "react-native-toast-message";
import logo from "assets/images/logo.png";

export const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(authActions.logout());
    Toast.show({
      type: "success",
      text1: t("headerMain.logoutSuccess"),
    });
  };

  return (
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <TouchableOpacity onPress={logOut} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>{t("headerMain.logout")}</Text>
      </TouchableOpacity>
      {/* <LanguageSelector /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: Platform.OS === "ios" ? 4 : 20,
    paddingHorizontal: Platform.OS === "ios" ? 8 : 20,
    paddingBottom: Platform.OS === "ios" ? 4 : 0,
    backgroundColor: "#0b9a39",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#0b9a39",
    fontWeight: "600",
  },
  logo: {
    width: 96,
    height: 64,
    resizeMode: "cover",
  },
});
