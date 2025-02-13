import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);

  const languages = [
    { label: t("common.languageSelector.languages.en"), value: "en" },
    { label: t("common.languageSelector.languages.ru"), value: "ru" },
  ];

  const changeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    setModalVisible(false);
  };

  return (
    <View>
      {Platform.OS === "ios" ? (
        <>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.languageButton}
          >
            <Text style={styles.languageButtonText}>
              {languages.find((lang) => lang.value === selectedLanguage)
                ?.label || t("common.languageSelector.selectLanguage")}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={languages}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => changeLanguage(item.value)}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          item.value === selectedLanguage &&
                            styles.selectedLanguageText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>
                    {t("common.languageSelector.close")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Picker
          selectedValue={selectedLanguage}
          style={styles.languageSelector}
          onValueChange={(itemValue) => changeLanguage(itemValue)}
        >
          {languages.map((lang) => (
            <Picker.Item
              key={lang.value}
              label={lang.label}
              value={lang.value}
            />
          ))}
        </Picker>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#0b9a39",
    borderRadius: 8,
  },
  languageButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalItemText: {
    fontSize: 18,
    color: "#333",
  },
  selectedLanguageText: {
    fontWeight: "bold",
    color: "#0b9a39",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0b9a39",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  languageSelector: {
    fontSize: 14,
    color: "#FFFFFF",
    width: 150,
    height: 60,
  },
});
