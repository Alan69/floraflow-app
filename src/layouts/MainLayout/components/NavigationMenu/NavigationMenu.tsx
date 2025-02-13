import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "types/RootStackParamList";
import { useTranslation } from "react-i18next";
import { useTypedSelector } from "hooks/useTypedSelector";
import { UserTypeEnum } from "modules/account/types";

export const NavigationMenu = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { user } = useTypedSelector((state) => state.auth);
  const { isUpdatingUserType } = useTypedSelector((state) => state.account);

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        style={[styles.menuItem, isUpdatingUserType && styles.disabled]}
        disabled={isUpdatingUserType}
        onPress={() =>
          navigation.navigate(
            user?.user_type === UserTypeEnum.CLIENT
              ? "OrderCreate"
              : "OrderProposedPricesStoragePage"
          )
        }
      >
        <Icon name="shopping-cart" size={24} color="#0b9a39" />
        <Text style={styles.menuText}>
          {t(
            user?.user_type === UserTypeEnum.CLIENT
              ? "navigationMenu.order"
              : "navigationMenu.orders"
          )}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, isUpdatingUserType && styles.disabled]}
        disabled={isUpdatingUserType}
        onPress={() =>
          navigation.navigate(
            user?.user_type === UserTypeEnum.CLIENT
              ? "OrderHistory"
              : "OrderStorageHistory"
          )
        }
      >
        <Icon name="history" size={24} color="#0b9a39" />
        <Text style={styles.menuText}>{t("navigationMenu.order_history")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, isUpdatingUserType && styles.disabled]}
        disabled={isUpdatingUserType}
        onPress={() => navigation.navigate("Account")}
      >
        <Icon name="person" size={24} color="#0b9a39" />
        <Text style={styles.menuText}>{t("navigationMenu.profile")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  disabled: {
    opacity: 0.5,
  },
});
