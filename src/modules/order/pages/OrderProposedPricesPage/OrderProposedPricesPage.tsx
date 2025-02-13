import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  useCancelCurrentOrderMutation,
  useAcceptOrderMutation,
  useCancelOrderMutation,
  useLazyGetProposedPricesQuery,
  useRateOrderMutation,
  useChangeOrderStatusMutation,
  useChangeOrderStatusClientMutation,
} from "modules/order/redux/api";
import {
  OrderStatusEnum,
  OrderStatusName,
  TCurrentOrderResponse,
  TProposedPrice,
} from "modules/order/types";
import { useLazyGetMeQuery } from "modules/account/redux/api";
import { Card, Divider, IconButton, Text } from "react-native-paper";

export const OrderProposedPricesPage = () => {
  const [orderData, setOrderData] = useState<TCurrentOrderResponse | null>(
    null
  );
  const [proposedPrices, setProposedPrices] = useState<TProposedPrice[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [rating, setRating] = useState(4);

  const [getMe, { isLoading: isCurrentOrderLoading }] = useLazyGetMeQuery();

  const [getProposedPrices, { isLoading: isProposedPricesLoading }] =
    useLazyGetProposedPricesQuery();
  const [cancelCurrentOrder, { isLoading: isCanceling }] =
    useCancelCurrentOrderMutation();
  const [acceptOrder] = useAcceptOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [rateOrder] = useRateOrderMutation();
  const [changeOrderStatusClient] = useChangeOrderStatusClientMutation();
  const fetchOrderData = async () => {
    try {
      const data = await getMe().unwrap();
      setOrderData(data.current_order);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось загрузить данные заказа.",
      });
    }
  };

  const fetchProposedPrices = async () => {
    try {
      const data = await getProposedPrices().unwrap();
      setProposedPrices(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось загрузить предложения.",
      });
    }
  };

  useEffect(() => {
    fetchOrderData();
    fetchProposedPrices();

    const interval = setInterval(() => {
      // fetchOrderData();
      fetchProposedPrices();
    }, 5000);

    return () => clearInterval(interval);
  }, [getMe, getProposedPrices]);

  const handleCancelOrder = async () => {
    if (!orderData?.uuid) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "UUID заказа отсутствует.",
      });
      return;
    }

    try {
      await cancelCurrentOrder({
        order_uuid: orderData.uuid,
        reason: cancelReason,
      })
        .unwrap()
        .then(() => {
          getMe()
            .unwrap()
            .then(() => {
              Toast.show({
                type: "success",
                text1: "Успех",
                text2: "Заказ успешно отменен.",
              });
              setOrderData(null);
              setIsModalVisible(false);
              setCancelReason("");
            });
        });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось отменить заказ.",
      });
    }
  };

  const handleAcceptProposal = async (uuid: string, store_name: string) => {
    try {
      await acceptOrder(uuid).unwrap();
      Toast.show({
        type: "success",
        text1: "Предложение принято",
        text2: `Вы выбрали предложение ${store_name}`,
      });
      const data = await getMe().unwrap();
      setOrderData(data.current_order);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось принять предложение",
      });
    }
  };

  const handleRejectProposal = async (uuid: string, store_name: string) => {
    try {
      await cancelOrder(uuid).unwrap();
      Toast.show({
        type: "info",
        text1: "Предложение отклонено",
        text2: `Вы отклонили предложение ${store_name}`,
      });
      getMe().unwrap();
      getProposedPrices();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось отклонить предложение",
      });
    }
  };

  const handleInstagramPress = (instagramLink?: string) => {
    if (instagramLink) {
      Linking.openURL(instagramLink);
    }
  };

  const handlePhonePress = (phone?: string) => {
    if (phone) {
      const formattedPhone = phone.startsWith("8")
        ? "+7" + phone.slice(1)
        : phone;
      Linking.openURL(`tel:${formattedPhone}`);
    }
  };

  const handleWhatsAppPress = (phone?: string) => {
    if (phone) {
      const formattedPhone = phone.startsWith("8")
        ? "+7" + phone.slice(1)
        : phone;
      Linking.openURL(`whatsapp://send?phone=${formattedPhone}`);
    }
  };

  const handle2GisPress = (twogisLink?: string) => {
    if (twogisLink) {
      Linking.openURL(twogisLink);
    }
  };

  console.log("orderData", orderData);

  const handleRateOrder = async () => {
    if (!orderData?.uuid) return;
    setIsRatingModalVisible(false);
    setIsConfirmationModalVisible(true);
  };

  const statusStyles = {
    pending: styles.statusPending,
    accepted: styles.statusAccepted,
    completed: styles.statusCompleted,
    in_transit: styles.statusCompleted,
    canceled: styles.statusCanceled,
  };

  if (isCurrentOrderLoading || isProposedPricesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (!orderData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Данные заказа отсутствуют</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {orderData?.status === OrderStatusEnum.pending ? (
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Заказ: город Астана</Text>
            <Text style={styles.text}>
              Цветы: {orderData?.flower?.text}, {orderData?.color?.text},{" "}
              {orderData?.flower_height}, {orderData?.quantity} шт
            </Text>
            <Text style={styles.text}>
              Оформление: {orderData?.decoration ? "Да" : "Нет"}
            </Text>
            <Text style={styles.text}>
              Адрес: {orderData?.recipients_address}
            </Text>
            <Text style={styles.text}>
              Телефон: {orderData?.recipients_phone}
            </Text>
            <Text style={styles.text}>
              Комментарий: {orderData?.flower_data}
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.cancelButtonText}>Отменить</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.header}>Предложения:</Text>

          {proposedPrices.length > 0 ? (
            proposedPrices.map((item) => (
              <View key={item.uuid} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.storeInfo}>
                    {item.logo && (
                      <Image
                        source={{ uri: item.logo }}
                        style={styles.storeLogo}
                      />
                    )}
                    <Text style={styles.storeName}>
                      Магазин: {item.store_name}
                    </Text>
                  </View>
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
                </View>
                <Text style={styles.price}>
                  Цена с доставкой: {item.proposed_price} тг
                </Text>
                <Text style={styles.comment}>
                  Комментарий: {item.comment || "Нет комментария"}
                </Text>
                {item.flower_img ? (
                  <Image
                    source={{ uri: item.flower_img }}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text>Нет изображения</Text>
                  </View>
                )}
                <View style={styles.iconsContainer}>
                  {item.instagram_link && (
                    <IconButton
                      icon="instagram"
                      size={36}
                      onPress={() =>
                        handleInstagramPress(item.instagram_link || "")
                      }
                    />
                  )}
                  {item.whatsapp_number && (
                    <IconButton
                      icon="phone"
                      size={36}
                      onPress={() =>
                        handlePhonePress(item.whatsapp_number || "")
                      }
                    />
                  )}
                  {item.whatsapp_number && (
                    <IconButton
                      icon="whatsapp"
                      size={36}
                      onPress={() =>
                        handleWhatsAppPress(item.whatsapp_number || "")
                      }
                    />
                  )}
                  {item.twogis && (
                    <IconButton
                      icon="map-marker"
                      size={36}
                      onPress={() => handle2GisPress(item.twogis || "")}
                    />
                  )}
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() =>
                      handleAcceptProposal(item.uuid, item.store_name)
                    }
                  >
                    <Text style={styles.buttonText}>Принять</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() =>
                      handleRejectProposal(item.uuid, item.store_name)
                    }
                  >
                    <Text style={styles.buttonText}>Отказать</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noProposalsText}>Нет предложений</Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled">
          <Card style={styles.cardСurrent}>
            <Card.Content>
              <View
                // @ts-ignore
                style={[styles.statusContainer, statusStyles[orderData.status]]}
              >
                <Text variant="titleMedium" style={styles.statusText}>
                  {/* @ts-ignore */}
                  Состояние:{" "}
                  {
                    OrderStatusName[
                      orderData.status as keyof typeof OrderStatusName
                    ]
                  }
                </Text>
              </View>
              <Text variant="titleSmall" style={styles.sectionHeader}>
                Заказ: Астана
              </Text>
              <Text variant="bodyMedium">Цветы: {orderData.flower?.text}</Text>
              <Text variant="bodyMedium">Цвет: {orderData.color?.text}</Text>
              <Text variant="bodyMedium">
                Высота: {orderData.flower_height}
              </Text>
              <Text variant="bodyMedium">Количество: {orderData.quantity}</Text>
              <Text variant="bodyMedium">
                Оформление: {orderData.decoration ? "Да" : "Нет"}
              </Text>
              <Text variant="bodyMedium">
                Адрес: {orderData.recipients_address}
              </Text>
              <Text variant="bodyMedium">
                Телефон: {orderData.recipients_phone}
              </Text>
              <Text variant="bodyMedium">
                Комментарий: {orderData.flower_data}
              </Text>

              <Divider style={styles.divider} />

              <>
                <View style={styles.cardHeader}>
                  <View style={styles.storeInfo}>
                    {orderData?.prices[0].logo && (
                      <Image
                        source={{ uri: orderData?.prices[0].logo }}
                        style={styles.storeLogo}
                      />
                    )}
                    <Text style={styles.storeName}>
                      Магазин: {orderData?.prices[0].store_name}
                    </Text>
                  </View>
                  <Text style={styles.rating}>
                    ⭐ {orderData?.prices[0].rating}
                  </Text>
                </View>
                <Text variant="bodyMedium">
                  Цена с доставкой:{" "}
                  <Text style={styles.priceText}>
                    {orderData?.prices[0].proposed_price} тг
                  </Text>
                </Text>
                <Text variant="bodyMedium">
                  Комментарий: {orderData?.prices[0].comment}
                </Text>

                <Divider style={styles.divider} />

                <View style={styles.iconsContainer}>
                  {orderData?.prices[0]?.instagram_link && (
                    <IconButton
                      icon="instagram"
                      size={36}
                      onPress={() =>
                        handleInstagramPress(
                          orderData?.prices[0]?.instagram_link || ""
                        )
                      }
                    />
                  )}
                  {orderData?.prices[0]?.whatsapp_number && (
                    <IconButton
                      icon="phone"
                      size={36}
                      onPress={() =>
                        handlePhonePress(
                          orderData?.prices[0]?.whatsapp_number || ""
                        )
                      }
                    />
                  )}
                  {orderData?.prices[0]?.whatsapp_number && (
                    <IconButton
                      icon="whatsapp"
                      size={36}
                      onPress={() =>
                        handleWhatsAppPress(
                          orderData?.prices[0]?.whatsapp_number || ""
                        )
                      }
                    />
                  )}
                  {orderData?.prices[0]?.twogis && (
                    <IconButton
                      icon="map-marker"
                      size={36}
                      onPress={() =>
                        handle2GisPress(orderData?.prices[0]?.twogis || "")
                      }
                    />
                  )}
                </View>
              </>

              {orderData.status === OrderStatusEnum.in_transit && (
                <TouchableOpacity
                  style={[styles.deliveredButton, { marginTop: 16 }]}
                  onPress={() => setIsRatingModalVisible(true)}
                >
                  <Text style={styles.buttonText}>Доставлен</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.cancelButtonText}>Отказаться</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </ScrollView>
      )}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalContainerRed}>
                  <Text style={styles.modalTitle}>Отказ</Text>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="Причина отказа"
                  placeholderTextColor="#A9A9A9"
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      { backgroundColor: "#0B9A39" },
                    ]}
                    onPress={handleCancelOrder}
                    disabled={isCanceling}
                  >
                    <Text style={styles.confirmButtonText}>
                      {isCanceling ? "Отмена..." : "Да"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      { backgroundColor: "#E9833A" },
                    ]}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.confirmButtonText}>Нет</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={isRatingModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsRatingModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setIsRatingModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalContainerGreen}>
                  <Text style={styles.modalTitle}>Заказ выполнен</Text>
                </View>
                <Text style={styles.modalSubtitle}>
                  Магазин: {orderData?.prices[0]?.store_name}
                </Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Text
                        style={[
                          styles.star,
                          star <= rating && styles.starSelected,
                        ]}
                      >
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      { backgroundColor: "#0B9A39" },
                    ]}
                    onPress={handleRateOrder}
                  >
                    <Text style={styles.confirmButtonText}>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={isConfirmationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsConfirmationModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setIsConfirmationModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Внимание</Text>
                <Text style={styles.modalText}>Вы уверены?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      { backgroundColor: "#0B9A39" },
                    ]}
                    onPress={async () => {
                      try {
                        await rateOrder({
                          uuid: orderData.uuid,
                          rating: rating,
                        }).unwrap();

                        await changeOrderStatusClient({
                          order_id: orderData.uuid,
                          status: OrderStatusEnum.completed,
                        }).unwrap();

                        setIsConfirmationModalVisible(false);
                        fetchOrderData();

                        Toast.show({
                          type: "success",
                          text1: "Успех",
                          text2: "Заказ успешно завершен",
                        });
                      } catch (error) {
                        Toast.show({
                          type: "error",
                          text1: "Ошибка",
                          text2: "Не удалось оценить заказ",
                        });
                      }
                    }}
                  >
                    <Text style={styles.confirmButtonText}>Да</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      { backgroundColor: "#E9833A" },
                    ]}
                    onPress={() => setIsConfirmationModalVisible(false)}
                  >
                    <Text style={styles.confirmButtonText}>Нет</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 0,
    borderWidth: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  statusContainer: {
    padding: 8,
    marginBottom: 8,
  },
  cardСurrent: {
    marginBottom: 16,
    borderRadius: 0,
    borderWidth: 1,
    padding: 0,
    backgroundColor: "#fff",
  },
  statusText: {
    fontWeight: "bold",
    color: "#000",
  },
  statusPending: {
    backgroundColor: "#e1e5ec",
    borderColor: "#e1e5ec",
  },
  statusAccepted: {
    backgroundColor: "#d1efeb",
    borderColor: "#0b9a39",
    borderWidth: 1,
  },
  statusCompleted: {
    backgroundColor: "#d1efeb",
    borderColor: "#0b9a39",
    borderWidth: 1,
  },
  statusCanceled: {
    backgroundColor: "#fbe5d8",
    borderColor: "#e9833a",
    borderWidth: 1,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  priceText: {
    color: "#333",
    fontWeight: "bold",
  },
  cancellationReason: {
    marginTop: 8,
    color: "#fbe5d8",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: "#FFA500",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  textArea: {
    width: "100%",
    height: 100,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    marginTop: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  noProposalsText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 14,
    color: "#FFA500",
  },
  price: {
    fontSize: 14,
    marginBottom: 4,
  },
  comment: {
    fontSize: 14,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#0B9A39",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    alignItems: "center",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#FFA500",
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  socialButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  deliveredButton: {
    backgroundColor: "#0B9A39",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 12,
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    fontSize: 40,
    color: "#D3D3D3",
    marginHorizontal: 5,
  },
  starSelected: {
    color: "#4169E1",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalContainerGreen: {
    width: "100%",
    backgroundColor: "#d1efeb",
    borderColor: "#0b9a39",
    borderWidth: 1,
  },
  modalContainerRed: {
    width: "100%",
    backgroundColor: "#fbe5d8",
    borderColor: "#e9833a",
    borderWidth: 1,
  },
});
