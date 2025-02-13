import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Linking,
} from "react-native";
import {
  useLazyGetOrderStorageHistoryListQuery,
  useChangeOrderStatusMutation,
} from "modules/order/redux/api";
import {
  OrderStatusEnum,
  OrderStatusName,
  TOrderStorageHistory,
} from "modules/order/types";
import {
  Card,
  Text,
  ActivityIndicator,
  Button,
  SegmentedButtons,
  Portal,
  Modal,
  Checkbox,
  IconButton,
} from "react-native-paper";
import Toast from "react-native-toast-message";

export const OrderStorageHistoryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [trigger, { data, isLoading, isError }] =
    useLazyGetOrderStorageHistoryListQuery();
  const [selectedOrder, setSelectedOrder] =
    useState<TOrderStorageHistory | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusEnum>(
    OrderStatusEnum.pending
  );
  const [changeOrderStatus] = useChangeOrderStatusMutation();

  const fetchOrders = (tabIndex: number) => {
    trigger({
      page: 1,
      isRelevant: tabIndex === 0,
    });
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    const newTabIndex = parseInt(value);
    setActiveTab(newTabIndex);
  };

  const showModal = (order: TOrderStorageHistory) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async () => {
    if (!selectedOrder) return;

    try {
      await changeOrderStatus({
        order_id: selectedOrder.uuid,
        status: selectedStatus,
      }).unwrap();

      fetchOrders(activeTab);

      Toast.show({
        type: "success",
        text1: "Успешно",
        text2: "Статус заказа изменен",
      });

      hideModal();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось изменить статус заказа",
      });
      console.error("Failed to change order status:", error);
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

  const renderOrder = ({ item }: { item: TOrderStorageHistory }) => {
    const getStatusStyle = (status: OrderStatusEnum) => {
      switch (status) {
        case OrderStatusEnum.accepted:
          return styles.statusDelivered;
        case OrderStatusEnum.completed:
          return styles.statusDelivered;
        case OrderStatusEnum.in_transit:
          return styles.statusDelivered;
        case OrderStatusEnum.canceled:
          return styles.statusCanceled;
        default:
          return styles.statusPending;
      }
    };

    const getStatusText = (status: OrderStatusEnum) => {
      switch (status) {
        case OrderStatusEnum.accepted:
          return OrderStatusName.accepted;
        case OrderStatusEnum.completed:
          return OrderStatusName.completed;
        case OrderStatusEnum.in_transit:
          return OrderStatusName.in_transit;
        case OrderStatusEnum.canceled:
          return OrderStatusName.canceled;
        default:
          return OrderStatusName.pending;
      }
    };

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={[styles.statusContainer, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>
              Состояние: {getStatusText(item.status)}
            </Text>
          </View>

          <Text variant="titleSmall" style={styles.sectionHeader}>
            Заказ:
          </Text>
          <Text variant="titleSmall" style={styles.sectionHeader}>
            {item.first_name} - город {item.city}
          </Text>

          <Text variant="bodyMedium">Цветы: {item.flower?.text}</Text>
          <Text variant="bodyMedium">Цвет: {item.color?.text}</Text>
          <Text variant="bodyMedium">Высота: {item.flower_height}</Text>
          <Text variant="bodyMedium">Количество: {item.quantity}</Text>
          <Text variant="bodyMedium">
            Оформление: {item.decoration ? "Да" : "Нет"}
          </Text>
          <Text variant="bodyMedium">Адрес: {item.recipients_address}</Text>
          {item.status !== OrderStatusEnum.pending &&
            item.status !== OrderStatusEnum.canceled && (
              <Text variant="bodyMedium">
                Номер получателя: {item.recipients_phone}
              </Text>
            )}
          <Text variant="bodyMedium">Комментарий: {item.flower_data}</Text>

          <View style={styles.divider} />
          <Text variant="titleSmall" style={styles.sectionHeader}>
            Мое предложение:
          </Text>

          <Text style={styles.priceText}>
            Цена с доставкой: {item.proposed_price} тг
          </Text>
          <Text style={styles.proposalComment}>
            Комментарий: {item.comment}
          </Text>

          {item.status !== OrderStatusEnum.pending &&
            item.status !== OrderStatusEnum.canceled && (
              <>
                <View style={styles.divider} />
                <Text style={styles.recipientPhone}>
                  Номер заказчика: {item.customer_phone}
                </Text>
                <View style={styles.socialLinks}>
                  <IconButton
                    icon="phone"
                    size={36}
                    onPress={() =>
                      Linking.openURL(`tel:${item.customer_phone}`)
                    }
                  />
                  <IconButton
                    icon="whatsapp"
                    size={36}
                    onPress={() => handleWhatsAppPress(item.customer_phone)}
                  />
                </View>
              </>
            )}

          {activeTab === 0 && item.status !== OrderStatusEnum.pending && (
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => showModal(item)}
                style={styles.changeStatusButton}
              >
                Изменить состояние
              </Button>
            </View>
          )}
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

  if (!data?.length) {
    return (
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          value={activeTab.toString()}
          onValueChange={handleTabChange}
          buttons={[
            { value: "0", label: "Текущие" },
            { value: "1", label: "История" },
          ]}
          style={styles.tabs}
          theme={{
            colors: {
              secondaryContainer: "#0b9a39",
              onSecondaryContainer: "#ffffff",
            },
            roundness: 1,
          }}
          density="regular"
        />
        <View style={styles.emptyContainer}>
          <Text>Нет данных</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={activeTab.toString()}
        onValueChange={handleTabChange}
        buttons={[
          { value: "0", label: "Текущие" },
          { value: "1", label: "История" },
        ]}
        style={styles.tabs}
        theme={{
          colors: {
            secondaryContainer: "#0b9a39",
            onSecondaryContainer: "#ffffff",
          },
          roundness: 1,
        }}
        density="regular"
      />

      <FlatList
        data={data || []}
        renderItem={renderOrder}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContainer}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>
            Заказ - {selectedOrder?.first_name}
          </Text>

          <View style={styles.orderDetails}>
            <Text style={styles.orderText}>
              Цветы: {selectedOrder?.flower?.text}, {selectedOrder?.color?.text}
            </Text>
            <Text style={styles.orderText}>
              {selectedOrder?.flower_height} см, {selectedOrder?.quantity} шт
            </Text>
            <Text style={styles.orderText}>
              Адрес: {selectedOrder?.recipients_address}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.modalSubtitle}>Cостояние</Text>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
              <Checkbox
                status={
                  selectedStatus === OrderStatusEnum.accepted
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => setSelectedStatus(OrderStatusEnum.accepted)}
              />
              <Text style={styles.checkboxLabel}>Заказ принят</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Checkbox
                status={
                  selectedStatus === OrderStatusEnum.in_transit
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => setSelectedStatus(OrderStatusEnum.in_transit)}
              />
              <Text style={styles.checkboxLabel}>В пути</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Checkbox
                status={
                  selectedStatus === OrderStatusEnum.completed
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => setSelectedStatus(OrderStatusEnum.completed)}
              />
              <Text style={styles.checkboxLabel}>Доставлен</Text>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <Button
              mode="contained"
              onPress={handleStatusChange}
              style={styles.submitButton}
              buttonColor="#0b9a39"
            >
              Изменить
            </Button>
            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.cancelButton}
            >
              Отмена
            </Button>
          </View>
        </Modal>
      </Portal>
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
  statusDelivered: {
    backgroundColor: "#d1efeb",
    borderColor: "#0b9a39",
    borderWidth: 1,
  },
  statusCanceled: {
    backgroundColor: "#fbe5d8",
    borderColor: "#e9833a",
    borderWidth: 1,
  },
  statusPending: {
    backgroundColor: "#e1e5ec",
    borderColor: "#e1e5ec",
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    marginBottom: 8,
  },
  orderDetails: {
    marginBottom: 4,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  proposalComment: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  tabs: {
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    marginTop: 16,
  },
  changeStatusButton: {
    backgroundColor: "#0b9a39",
    borderRadius: 2,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#FFF9C4",
    padding: 16,
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE082",
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  checkboxContainer: {
    marginVertical: 8,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 0,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
  recipientPhone: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 8,
    color: "#333",
  },
});
