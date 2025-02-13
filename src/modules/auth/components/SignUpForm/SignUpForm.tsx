import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { authActions } from "modules/auth/redux/slices/auth.slice";
import { useSignUpMutation } from "modules/auth/redux/api";
import { Controller, useForm } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "types/RootStackParamList";
import { CityEnum } from "modules/account/types";
import Toast from "react-native-toast-message";

export const SignUpForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [signUp, { isLoading }] = useSignUpMutation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      first_name: "",
      last_name: "",
      city: CityEnum.ASTANA,
    },
  });

  const passwordValidator = (value: string) => {
    if (!value) return t("signUpForm.password_required");
    if (value.length < 8) return t("signUpForm.password_invalid");
    if (!/\d.*\d/.test(value)) return t("signUpForm.password_invalid");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      return t("signUpForm.password_invalid");
    return "";
  };

  const onSubmit = async (data: {
    email: string;
    phone: string;
    password: string;
    first_name: string;
    last_name: string;
    city: CityEnum;
  }) => {
    const errorMessage = passwordValidator(data.password);
    if (errorMessage) {
      Toast.show({
        type: "error",
        text1: t("signUpForm.password_invalid_title"),
        text2: errorMessage,
      });
      return;
    }

    const dataToSend = {
      email: data.email.toLowerCase(),
      password: data.password,
      phone: data.phone,
      first_name: data.first_name,
      last_name: data.last_name,
      city: CityEnum.ASTANA,
    };

    try {
      const response = await signUp(dataToSend).unwrap();
      const { access: token, refresh: refreshToken } = response;
      dispatch(authActions.setToken({ token, refreshToken }));
      Toast.show({
        type: "success",
        text1: t("signUpForm.success_message"),
      });
      navigation.navigate("Login");
    } catch (error) {
      const errorMsg =
        // @ts-ignore
        error?.data?.error || t("signUpForm.error_message");
      Toast.show({
        type: "error",
        text1: t("signUpForm.error_title"),
        text2: errorMsg,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.formWrapper, { flex: 1 }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Text style={styles.headerText}>{t("signUpForm.title")}</Text>

        <Controller
          name="email"
          control={control}
          rules={{ required: t("signUpForm.email_required") }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("signUpForm.email_placeholder")}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              keyboardType="email-address"
              style={styles.input}
              error={!!errors.email}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Controller
          name="phone"
          control={control}
          rules={{ required: t("signUpForm.phone_required") }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("signUpForm.phone_placeholder")}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              error={!!errors.phone}
            />
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        <Controller
          name="first_name"
          control={control}
          rules={{ required: t("signUpForm.first_name_required") }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("signUpForm.first_name_label")}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              error={!!errors.first_name}
            />
          )}
        />
        {errors.first_name && (
          <Text style={styles.errorText}>{errors.first_name.message}</Text>
        )}

        <Controller
          name="last_name"
          control={control}
          rules={{ required: t("signUpForm.last_name_required") }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("signUpForm.last_name_label")}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              error={!!errors.last_name}
            />
          )}
        />
        {errors.last_name && (
          <Text style={styles.errorText}>{errors.last_name.message}</Text>
        )}

        <Controller
          name="password"
          control={control}
          rules={{ required: t("signUpForm.password_required") }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("signUpForm.password_placeholder")}
              value={value}
              onChangeText={onChange}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              error={!!errors.password}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <Controller
          name="city"
          control={control}
          rules={{ required: t("signUpForm.city_required") }}
          disabled
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("signUpForm.city_label")}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              error={!!errors.city}
              disabled
            />
          )}
        />
        {errors.city && (
          <Text style={styles.errorText}>{errors.city.message}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? "Loading..." : t("signUpForm.submit_button")}
        </Button>

        <View style={styles.linksBlock}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.linkText}>{t("signUpForm.login_link")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0b9a39",
  },
  linkText: {
    color: "#0b9a39",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  linksBlock: {
    marginTop: 20,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
