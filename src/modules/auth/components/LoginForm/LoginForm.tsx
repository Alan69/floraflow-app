import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { authActions } from "modules/auth/redux/slices/auth.slice";
import { useLoginMutation } from "modules/auth/redux/api";
import { Button, TextInput, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "types/RootStackParamList";
import { Controller, useForm } from "react-hook-form";
import { useLazyGetMeQuery } from "modules/account/redux/api";
import Toast from "react-native-toast-message";

export const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [login, { isLoading }] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onFinish = async (data: { email: string; password: string }) => {
    const dataToSend = {
      email: data.email.toLowerCase(),
      password: data.password,
    };

    try {
      const response = await login(dataToSend);
      // @ts-ignore
      const { access: token, refresh: refreshToken } = response.data;
      dispatch(authActions.setToken({ token, refreshToken }));

      await getMe().unwrap();

      Toast.show({
        type: "success",
        text1: t("loginForm.login_success"),
      });

      navigation.navigate("Account");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("loginForm.login_error"),
        // @ts-ignore
        text2: error?.data?.message || t("loginForm.generic_error"),
      });
    }
  };

  return (
    <View style={styles.formWrapper}>
      <Text style={styles.headerText}>{t("loginForm.title")}</Text>

      <Controller
        name="email"
        control={control}
        rules={{
          required: t("loginForm.email_required"),
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: t("loginForm.email_invalid"),
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label={t("loginForm.email_placeholder")}
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
        name="password"
        control={control}
        rules={{
          required: t("loginForm.password_required"),
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label={t("loginForm.password_placeholder")}
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

      <Button
        mode="contained"
        onPress={handleSubmit(onFinish)}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        {isLoading ? "Loading..." : t("loginForm.submit_button")}
      </Button>

      <View style={styles.linksBlock}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.linkText}>
            {t("loginForm.registration_link")}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate("Recovery");
          }}
        >
          <Text style={styles.linkText}>
            {t("loginForm.forgot_password_link")}
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 40,
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
    marginTop: 15,
    backgroundColor: "#0b9a39",
  },
  linksBlock: {
    marginTop: 20,
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  linkText: {
    color: "#0b9a39",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
