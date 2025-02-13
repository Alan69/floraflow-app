import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import resources from "./resources";

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const getLanguage = async () => {
  const storedLang = await AsyncStorage.getItem("language");
  return storedLang || "ru";
};

getLanguage().then((language) => {
  i18n.changeLanguage(language);
});

export default i18n;
