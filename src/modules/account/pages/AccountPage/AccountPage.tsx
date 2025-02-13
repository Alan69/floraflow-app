import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTypedSelector } from "hooks/useTypedSelector";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Button,
  Switch,
  Avatar,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import {
  useLazyGetMeQuery,
  useLazyGetStoreProfileQuery,
  useUpdateMeMutation,
  useUpdateStoreProfileMutation,
  useUpdateUserTypeMutation,
} from "modules/account/redux/api";
import avatar from "assets/images/avatar.png";
import { CityEnum, UserTypeEnum } from "modules/account/types";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

export const AccountPage = () => {
  const { t } = useTranslation();
  const { user, storeProfile } = useTypedSelector((state) => state.auth);
  const [getMe, { isLoading: isAccountLoading }] = useLazyGetMeQuery();
  const [getStoreProfile] = useLazyGetStoreProfileQuery();
  const [updateMe, { isLoading: isUpdatingMe }] = useUpdateMeMutation();
  const [updateUserType] = useUpdateUserTypeMutation();

  const [updateStoreProfile, { isLoading: isUpdatingStore }] =
    useUpdateStoreProfileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      phone: user?.phone || "",
      city: user?.city || "",
      profilePicture: user?.profile_picture || "",
      userType: user?.user_type === UserTypeEnum.STORE,
      storeName: storeProfile?.store_name || "",
      storeLogo: storeProfile?.logo || "",
      storeAddress: storeProfile?.address || "",
      storeInstagram: storeProfile?.instagram_link || "",
      storeTwogis: storeProfile?.twogis || "",
      storeWhatsApp: storeProfile?.whatsapp_number || "",
    },
  });

  const userType = watch("userType");

  const [selectedImage, setSelectedImage] = useState<FormData | null>(null);
  const [selectedStoreLogo, setSelectedStoreLogo] = useState<FormData | null>(
    null
  );

  const handleSubmitForm = async (data: any) => {
    try {
      const updatePromises = [];

      updatePromises.push(
        updateMe({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          city: CityEnum.ASTANA,
          profile_picture: selectedImage
            ? selectedImage.get("profile_picture")
            : data.profilePicture,
        }).unwrap()
      );

      if (data.userType && user?.user_type === UserTypeEnum.STORE) {
        updatePromises.push(
          updateStoreProfile({
            store_name: data.storeName,
            logo: selectedStoreLogo
              ? selectedStoreLogo.get("logo")
              : data.storeLogo,
            address: data.storeAddress,
            instagram_link: data.storeInstagram,
            twogis: data.storeTwogis,
            whatsapp_number: data.storeWhatsApp,
          }).unwrap()
        );
      }

      await Promise.all(updatePromises);

      setSelectedImage(null);
      setSelectedStoreLogo(null);

      await getMe().unwrap();
      if (data.userType) {
        await getStoreProfile().unwrap();
      }

      Toast.show({
        type: "success",
        text1: t("accountPage.messages.profile_updated"),
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("accountPage.messages.profile_update_failed"),
      });
      console.error("Error updating profile:", error);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: t("accountPage.messages.permission_denied"),
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const formData = new FormData();
        formData.append("profile_picture", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);

        setSelectedImage(formData);
        setValue("profilePicture", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: t("accountPage.messages.picture_pick_failed"),
      });
    }
  };

  const handleStoreLogoPick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: t("accountPage.messages.permission_denied"),
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const formData = new FormData();
        formData.append("logo", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "store-logo.jpg",
        } as any);

        setSelectedStoreLogo(formData);
        setValue("storeLogo", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking store logo:", error);
      Toast.show({
        type: "error",
        text1: t("accountPage.messages.picture_pick_failed"),
      });
    }
  };

  const updateStoreFormFields = (storeData: any) => {
    setValue("storeName", storeData.store_name || "");
    setValue("storeLogo", storeData.logo || "");
    setValue("storeAddress", storeData.address || "");
    setValue("storeInstagram", storeData.instagram_link || "");
    setValue("storeTwogis", storeData.twogis || "");
    setValue("storeWhatsApp", storeData.whatsapp_number || "");
  };

  const handleUserTypeChange = async (
    newValue: boolean,
    onChange: (value: boolean) => void
  ) => {
    try {
      onChange(newValue);

      if (newValue && user?.user_type !== UserTypeEnum.STORE) {
        await updateUserType({
          phone: user?.phone || "",
          user_type: UserTypeEnum.STORE,
        }).unwrap();

        await getMe().unwrap();
        const storeProfileResult = await getStoreProfile().unwrap();
        if (storeProfileResult) {
          updateStoreFormFields(storeProfileResult);
        }
      } else if (!newValue && user?.user_type === UserTypeEnum.STORE) {
        await updateUserType({
          phone: user?.phone || "",
          user_type: UserTypeEnum.CLIENT,
        }).unwrap();
        await getMe();
      }

      Toast.show({
        type: "success",
        text1: t("accountPage.messages.user_type_updated"),
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("accountPage.messages.user_type_update_failed"),
      });
      console.error("Error updating user type:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      getMe();
    }
  }, []);

  useEffect(() => {
    if (user?.user_type === UserTypeEnum.STORE && !storeProfile) {
      getStoreProfile();
    }
  }, [user?.user_type]);

  useEffect(() => {
    if (storeProfile) {
      updateStoreFormFields(storeProfile);
    }
  }, [storeProfile, setValue]);

  if (isAccountLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#0b9a39" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 160 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>
            {t("accountPage.support")}:{"\n"}+7-705-828-84-37
          </Text>
        </View>

        <Text style={styles.title}>{t("accountPage.profile")}</Text>

        <View style={styles.profilePictureContainer}>
          <Avatar.Image
            size={100}
            source={
              user?.profile_picture ? { uri: user.profile_picture } : avatar
            }
          />
          <Button
            mode="outlined"
            onPress={handleImagePick}
            style={styles.button}
            textColor="#fff"
          >
            {t("accountPage.form.change_picture")}
          </Button>
        </View>

        <Controller
          name="firstName"
          control={control}
          rules={{ required: t("accountPage.form.first_name_required") }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("accountPage.form.first_name_label")}
              value={value}
              onChangeText={onChange}
              style={styles.input}
              error={!!errors.firstName}
              mode="outlined"
            />
          )}
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName.message}</Text>
        )}

        <Controller
          name="lastName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("accountPage.form.last_name_label")}
              value={value}
              onChangeText={onChange}
              style={styles.input}
              error={!!errors.lastName}
              mode="outlined"
            />
          )}
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName.message}</Text>
        )}

        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("accountPage.form.phone_number_label")}
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
              style={styles.input}
              error={!!errors.phone}
              mode="outlined"
            />
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        <Controller
          name="city"
          control={control}
          disabled
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("accountPage.form.city_label")}
              value={value}
              onChangeText={onChange}
              style={styles.input}
              error={!!errors.city}
              mode="outlined"
              disabled
            />
          )}
        />
        {errors.city && (
          <Text style={styles.errorText}>{errors.city.message}</Text>
        )}

        <Divider style={styles.divider} />

        <View style={styles.switchContainer}>
          <Text>{t("accountPage.form.store_mode_label")}</Text>
          <Controller
            name="userType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  handleUserTypeChange(newValue, onChange)
                }
              />
            )}
          />
        </View>

        {userType && storeProfile && (
          <>
            <Text style={styles.sectionTitle}>
              {t("accountPage.storeProfile")}
            </Text>
            <View style={styles.storeProfileContainer}>
              <Controller
                name="storeLogo"
                control={control}
                render={({ field: { value } }) => (
                  <View style={styles.storeLogoContainer}>
                    <Avatar.Image
                      size={80}
                      source={value ? { uri: value } : avatar}
                      style={styles.storeLogo}
                    />
                    <Button
                      mode="outlined"
                      onPress={handleStoreLogoPick}
                      style={styles.button}
                      textColor="#fff"
                    >
                      {t("accountPage.form.change_store_logo")}
                    </Button>
                  </View>
                )}
              />

              <Controller
                name="storeName"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label={t("accountPage.form.store_name_label")}
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    mode="outlined"
                  />
                )}
              />

              <Controller
                name="storeAddress"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label={t("accountPage.form.store_address_label")}
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    mode="outlined"
                  />
                )}
              />

              <Controller
                name="storeWhatsApp"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label={t("accountPage.form.store_whatsapp_label")}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    style={styles.input}
                    mode="outlined"
                  />
                )}
              />

              <Controller
                name="storeInstagram"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label={t("accountPage.form.store_instagram_label")}
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    mode="outlined"
                  />
                )}
              />

              <Controller
                name="storeTwogis"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label={t("accountPage.form.store_twogis_label")}
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    mode="outlined"
                  />
                )}
              />

              <View style={styles.ratingContainer}>
                <Text style={styles.ratingTitle}>
                  {t("accountPage.form.average_rating_label")}
                </Text>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.star,
                        i < Math.round(storeProfile.average_rating)
                          ? styles.starActive
                          : styles.starInactive,
                      ]}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(handleSubmitForm)}
          style={styles.button}
          loading={isUpdatingMe || isUpdatingStore}
          disabled={isUpdatingMe || isUpdatingStore}
        >
          {t("accountPage.buttons.save")}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  profilePictureContainer: {
    color: "#fff",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#0b9a39",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  divider: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  storeProfileContainer: {
    // alignItems: "center",
    // marginBottom: 20,
  },
  storeLogo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  star: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  starActive: {
    color: "#FFD700",
  },
  starInactive: {
    color: "#CCC",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  supportContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0b9a39",
  },
  supportText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    lineHeight: 20,
  },
  storeLogoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});
