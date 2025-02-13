import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Button,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { useGetFlowersListQuery } from "redux/api/flowers/flowersApi";
import { useGetColorsListQuery } from "redux/api/colors/colorsApi";
import { useCreateOrderMutation } from "modules/order/redux/api";
import DropDownPicker from "react-native-dropdown-picker";
import { useLazyGetMeQuery } from "modules/account/redux/api";
import Toast from "react-native-toast-message";

export const OrderCreatePage = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flower: "",
      color: "",
      flower_height: "",
      quantity: 1,
      decoration: false,
      recipients_address: "",
      recipients_phone: "",
      comments: "",
    },
  });

  const { data: flowerData, isLoading: isFlowersLoading } =
    useGetFlowersListQuery({});
  const { data: colorData, isLoading: isColorsLoading } = useGetColorsListQuery(
    {}
  );
  const [createOrder, { isLoading: isOrderCreating }] =
    useCreateOrderMutation();
  const [getMe] = useLazyGetMeQuery();

  const [flowerDropdownOpen, setFlowerDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [heightDropdownOpen, setHeightDropdownOpen] = useState(false);

  const scrollViewRef = useRef(null);

  const onSubmit = async (formData: any) => {
    try {
      await createOrder({
        ...formData,
        flower_height: `${formData.flower_height}cm`,
        flower_data: formData.comments,
      })
        .unwrap()
        .then(() => {
          getMe();
          Toast.show({
            type: "success",
            text1: "Заказ успешно создан!",
          });
        });
      reset();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ошибка при создании заказа",
        // @ts-ignore
        text2: error?.data?.message || "Попробуйте снова",
      });
    }
  };

  if (isFlowersLoading || isColorsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
          nestedScrollEnabled={true}
          onContentSizeChange={() => {
            // @ts-ignore
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          <Text style={styles.title}>Заказ: город Астана</Text>

          <View style={[styles.dropdownWrapper, { zIndex: 3000 }]}>
            <Controller
              name="flower"
              control={control}
              rules={{ required: "Цветок обязателен" }}
              render={({ field: { value } }) => (
                // @ts-ignore
                <DropDownPicker
                  open={flowerDropdownOpen}
                  value={value}
                  items={
                    flowerData?.map((flower) => ({
                      label: flower.text,
                      value: flower.uuid,
                    })) || []
                  }
                  setOpen={setFlowerDropdownOpen}
                  // @ts-ignore
                  onSelectItem={(item) => setValue("flower", item.value)}
                  placeholder="Выберите цветок"
                  listMode="MODAL"
                  modalProps={{
                    animationType: "slide",
                  }}
                  modalTitle="Выберите из списка"
                  listParentContainerStyle={{
                    backgroundColor: "#fff",
                  }}
                  listParentLabelStyle={{
                    fontWeight: "400",
                  }}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              )}
            />
          </View>

          <View style={[styles.dropdownWrapper, { zIndex: 2000 }]}>
            <Controller
              name="color"
              control={control}
              rules={{ required: "Цвет обязателен" }}
              render={({ field: { value } }) => (
                // @ts-ignore
                <DropDownPicker
                  open={colorDropdownOpen}
                  value={value}
                  items={
                    colorData?.map((color) => ({
                      label: color.text,
                      value: color.uuid,
                    })) || []
                  }
                  setOpen={setColorDropdownOpen}
                  // @ts-ignore
                  onSelectItem={(item) => setValue("color", item.value)}
                  placeholder="Выберите цвет"
                  listMode="MODAL"
                  modalProps={{
                    animationType: "slide",
                  }}
                  modalTitle="Выберите из списка"
                  listParentContainerStyle={{
                    backgroundColor: "#fff",
                  }}
                  listParentLabelStyle={{
                    fontWeight: "400",
                  }}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              )}
            />
          </View>

          <View style={[styles.dropdownWrapper, { zIndex: 1000 }]}>
            <Controller
              name="flower_height"
              control={control}
              rules={{ required: "Высота обязательна" }}
              render={({ field: { value } }) => (
                // @ts-ignore
                <DropDownPicker
                  open={heightDropdownOpen}
                  value={value}
                  items={["50", "60", "70", "80", "90", "100"].map(
                    (height) => ({
                      label: `${height} см`,
                      value: height,
                    })
                  )}
                  setOpen={setHeightDropdownOpen}
                  // @ts-ignore
                  onSelectItem={(item) => setValue("flower_height", item.value)}
                  placeholder="Выберите высоту"
                  listMode="MODAL"
                  modalProps={{
                    animationType: "slide",
                  }}
                  modalTitle="Выберите из списка"
                  listParentContainerStyle={{
                    backgroundColor: "#fff",
                  }}
                  listParentLabelStyle={{
                    fontWeight: "400",
                  }}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              )}
            />
          </View>

          <Controller
            name="quantity"
            control={control}
            rules={{
              required: "Количество обязательно",
              validate: (value) =>
                value > 0 || "Количество должно быть больше 0",
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  label="Количество (шт)"
                  value={String(value)}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(Number(text))}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.quantity}
                />
                {errors.quantity && (
                  <Text style={styles.errorText}>
                    {errors.quantity.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            name="decoration"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchContainer}>
                <Text>С оформлением</Text>
                <Switch value={value} onValueChange={onChange} />
              </View>
            )}
          />

          <Controller
            name="recipients_address"
            control={control}
            rules={{ required: "Адрес обязателен при оформлении" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Адрес доставки"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                style={styles.input}
              />
            )}
          />

          <Controller
            name="recipients_phone"
            control={control}
            rules={{ required: "Телефон обязателен при оформлении" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Телефон получателя"
                value={value}
                keyboardType="phone-pad"
                onChangeText={onChange}
                mode="outlined"
                style={styles.input}
              />
            )}
          />

          <Controller
            name="comments"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Комментарий"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
              />
            )}
          />

          <Text style={styles.note}>
            *Напишите описание оформления, если выбрано.
          </Text>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isOrderCreating}
            disabled={isOrderCreating}
            style={styles.submitButton}
          >
            Заказать
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  dropdownWrapper: {
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
  },
  dropdownContainer: {
    backgroundColor: "#F5F5F5",
    maxHeight: 300,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  note: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#0b9a39",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
