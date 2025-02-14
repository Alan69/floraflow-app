import React, { useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Linking,
  Image,
} from "react-native";
import { useLazyGetOrderHistoryListQuery } from "modules/order/redux/api";
import {
  OrderStatusEnum,
  OrderStatusName,
  TOrderHistory,
} from "modules/order/types";
import {
  Card,
  Text,
  ActivityIndicator,
  Button,
  IconButton,
  Divider,
} from "react-native-paper";

export const OrderHistoryPage = () => {
  const [trigger, { data, isLoading, isError }] =
    useLazyGetOrderHistoryListQuery();

  useEffect(() => {
    trigger();
  }, []);

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

  const renderOrder = ({ item }: { item: TOrderHistory }) => {
    const statusStyles = {
      pending: styles.statusPending,
      accepted: styles.statusAccepted,
      completed: styles.statusCompleted,
      in_transit: styles.statusCompleted,
      canceled: styles.statusCanceled,
    };

    return (
      <Card style={styles.card}>
        <Card.Content>
          {/* @ts-ignore */}
          <View style={[styles.statusContainer, statusStyles[item.status]]}>
            <Text variant="titleMedium" style={styles.statusText}>
              {/* @ts-ignore */}
              Состояние:{" "}
              {OrderStatusName[item.status as keyof typeof OrderStatusName]}
            </Text>
          </View>
          <Text variant="titleSmall" style={styles.sectionHeader}>
            Заказ: {item.city}
          </Text>
          <Text variant="bodyMedium">Цветы: {item.flower?.text}</Text>
          <Text variant="bodyMedium">Цвет: {item.color?.text}</Text>
          <Text variant="bodyMedium">Высота: {item.flower_height}</Text>
          <Text variant="bodyMedium">Количество: {item.quantity}</Text>
          <Text variant="bodyMedium">
            Оформление: {item.decoration ? "Да" : "Нет"}
          </Text>
          <Text variant="bodyMedium">
            Адрес: {item.recipients_address || "-"}
          </Text>
          <Text variant="bodyMedium">
            Телефон: {item.recipients_phone || "-"}
          </Text>
          <Text variant="bodyMedium">
            Комментарий: {item.flower_data || "-"}
          </Text>

          {item.status === OrderStatusEnum.canceled && (
            <Text variant="bodyMedium" style={styles.cancellationReason}>
              Причина отказа: {item.reason || "-"}
            </Text>
          )}

          <Divider style={styles.divider} />

          <>
            <View style={styles.cardHeader}>
              <View style={styles.storeInfo}>
                {item.store_logo && (
                  <Image
                    source={{ uri: item.store_logo }}
                    style={styles.storeLogo}
                  />
                )}
                <Text style={styles.storeName}>Магазин: {item.store_name}</Text>
              </View>
              <Text style={styles.rating}>⭐ {item.store_average_rating}</Text>
            </View>
            <Text variant="bodyMedium">
              Цена с доставкой:{" "}
              <Text style={styles.priceText}>{item.price} тг</Text>
            </Text>
            <Text variant="bodyMedium">Комментарий: {item.store_comment}</Text>

            <Divider style={styles.divider} />

            <View style={styles.iconsContainer}>
              {item.store_instagram_link && (
                <IconButton
                  icon="instagram"
                  size={36}
                  onPress={() =>
                    handleInstagramPress(item.store_instagram_link || "")
                  }
                />
              )}
              {item.store_whatsapp_number && (
                <IconButton
                  icon="phone"
                  size={36}
                  onPress={() =>
                    handlePhonePress(item.store_whatsapp_number || "")
                  }
                />
              )}
              {item.store_whatsapp_number && (
                <IconButton
                  icon="whatsapp"
                  size={36}
                  onPress={() =>
                    handleWhatsAppPress(item.store_whatsapp_number || "")
                  }
                />
              )}
              {item.store_twogis && (
                <IconButton
                  icon="map-marker"
                  size={36}
                  onPress={() => handle2GisPress(item.store_twogis || "")}
                />
              )}
            </View>
          </>
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} size="large" />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text variant="bodyLarge">Ошибка при загрузке данных</Text>
      </SafeAreaView>
    );
  }

  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge">У вас пока нет заказов</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderOrder}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
  },
  listContainer: {
    padding: 0,
  },
  card: {
    marginBottom: 16,
    borderRadius: 0,
    borderWidth: 1,
    padding: 0,
    backgroundColor: "#fff",
  },
  statusContainer: {
    padding: 8,
    marginBottom: 8,
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
    marginBottom: 4,
    fontWeight: "bold",
  },
  priceText: {
    color: "#0b9a39",
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  cancellationReason: {
    marginTop: 8,
    color: "#e9833a",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  paginationButton: {
    marginHorizontal: 8,
  },
  pageNumber: {
    alignSelf: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 14,
    color: "#FFA500",
  },
});
