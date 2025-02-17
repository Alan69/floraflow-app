import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Modal,
  Portal,
  TextInput,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import {
  useLazyGetOrderProposedPricesStorageQuery,
  useAcceptOrderProposedPricesStorageMutation,
} from "../../redux/api";
import { TOrderProposedPricesStorage } from "modules/order/types";
import Toast from "react-native-toast-message";

type FormData = {
  price: string;
  comment: string;
};

export const OrderProposedPricesStoragePage = () => {
  const [fetchOrders, { data: orders }] =
    useLazyGetOrderProposedPricesStorageQuery();
  const [selectedOrder, setSelectedOrder] =
    useState<TOrderProposedPricesStorage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      price: "",
      comment: "",
    },
  });

  const [acceptOrderProposedPricesStorage] =
    useAcceptOrderProposedPricesStorageMutation();

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleOrderSelect = (order: TOrderProposedPricesStorage) => {
    setSelectedOrder(order);
    setModalVisible(true);
    reset();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedOrder) return;

    try {
      await acceptOrderProposedPricesStorage({
        order_id: selectedOrder.uuid,
        proposed_price: data.price,
        flower_img: selectedImage,
        comment: data.comment,
      })
        .unwrap()
        .then(() => {
          fetchOrders();
          Toast.show({
            type: "success",
            text1: "Успешно",
            text2: "Предложение отправлено",
          });
        });

      setModalVisible(false);
      setSelectedImage("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось отправить предложение",
      });
      console.error("Failed to submit order:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Заказы:</Title>
      </View>
      {orders?.map((order, index) => (
        <Card key={order.uuid || index} style={styles.orderCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Заказ:</Title>
            <View style={styles.cardRow}>
              <Title style={styles.customerName}>{order.first_name}</Title>
              <Text style={styles.cityText}>- город Астана</Text>
            </View>
            <Paragraph style={styles.orderDetails}>
              Цветы: {order?.flower?.text}, {order?.color?.text},{" "}
              {order?.flower_height}, {order?.quantity} шт
            </Paragraph>
            <Paragraph style={styles.orderDetails}>
              Оформление: {order.decoration ? "Да" : "Нет"}
            </Paragraph>
            <Paragraph style={styles.orderDetails}>
              Адрес: {order.recipients_address}
            </Paragraph>
            {order.flower_data && (
              <Paragraph style={styles.orderDetails}>
                Комментарий: {order.flower_data}
              </Paragraph>
            )}
            <Button
              mode="contained"
              onPress={() => handleOrderSelect(order)}
              buttonColor="#0b9a39"
              style={styles.acceptButton}
              labelStyle={styles.buttonLabel}
            >
              Предложить цену
            </Button>
          </Card.Content>
        </Card>
      ))}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Title style={styles.modalTitle}>
              Заказ - {selectedOrder?.first_name}
            </Title>
          </View>

          <ScrollView style={styles.modalBody}>
            <Paragraph>
              Цветы: {selectedOrder?.flower.text}, {selectedOrder?.color.text},
              {selectedOrder?.flower_height} см, {selectedOrder?.quantity} шт
            </Paragraph>
            <Paragraph>Адрес: {selectedOrder?.recipients_address}</Paragraph>

            <Button
              mode="contained"
              onPress={pickImage}
              style={styles.imageButton}
              buttonColor="#0b9a39"
            >
              {selectedImage ? "Изменить фото" : "Добавить фото"}
            </Button>

            {selectedImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.image} />
                <Button
                  mode="contained"
                  onPress={() => setSelectedImage("")}
                  style={styles.removeImageButton}
                >
                  ✕
                </Button>
              </View>
            )}

            <Controller
              control={control}
              name="price"
              rules={{ required: "Обязательное поле" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Цена с доставкой"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    error={!!error}
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name="comment"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  mode="outlined"
                  label="Комментарий"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={6}
                  style={styles.commentInput}
                  textAlignVertical="top"
                />
              )}
            />

            <View style={styles.modalButtons}>
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
                buttonColor="#0b9a39"
              >
                Предложить
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  reset();
                  setModalVisible(false);
                }}
                style={styles.cancelButton}
              >
                Отмена
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  orderCard: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    elevation: 0,
    backgroundColor: "#fff",
    borderRadius: 0,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  customerName: {
    fontSize: 20,
    fontWeight: "500",
  },
  cityText: {
    fontSize: 18,
    marginLeft: 8,
  },
  orderDetails: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  acceptButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
  },
  modalHeader: {
    backgroundColor: "#FFF9C4",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE082",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    padding: 16,
  },
  modalBody: {
    padding: 16,
  },
  imageContainer: {
    position: "relative",
    marginVertical: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#D32F2F",
    borderRadius: 8,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
  },
  imageButton: {
    marginVertical: 8,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  commentInput: {
    minHeight: 120,
    marginVertical: 12,
  },
});
