import baseApi from "../../../../redux/api";
import {
  TOrderCreateRequest,
  TCreateOrderResponse,
  TOrderHistoryResponse,
  TProposedPricesResponse,
  TCancelCurrentOrderResponse,
  TCancelCurrentOrderRequest,
  TOrderProposedPricesStorageResponse,
  TAcceptOrderProposedPricesStorageRequest,
  TAcceptOrderProposedPricesStorageResponse,
  TOrderStorageHistoryResponse,
  TChangeOrderStatusRequest,
  TChangeOrderStatusResponse,
  TProposedPrice,
  TOrderHistory,
  TOrderStorageHistory,
  TOrderProposedPricesStorage,
} from "modules/order/types";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<TCreateOrderResponse, TOrderCreateRequest>({
      query: ({
        flower,
        color,
        flower_height,
        quantity,
        decoration,
        recipients_address,
        recipients_phone,
        flower_data,
      }) => ({
        url: "/client/order/",
        method: "POST",
        body: {
          flower,
          color,
          flower_height,
          quantity,
          decoration,
          recipients_address,
          recipients_phone,
          flower_data,
        },
      }),
      transformResponse: (response: TCreateOrderResponse) => response,
      extraOptions: { showErrors: false },
    }),
    cancelCurrentOrder: build.mutation<
      TCancelCurrentOrderResponse,
      TCancelCurrentOrderRequest
    >({
      query: ({ order_uuid, reason }) => ({
        url: `/client/${order_uuid}/cancel/`,
        method: "POST",
        body: {
          reason,
        },
      }),
      transformResponse: (response: TCancelCurrentOrderResponse) => response,
      extraOptions: { showErrors: false },
    }),
    acceptOrder: build.mutation<{ detail: string }, string>({
      query: (price_id) => ({
        url: `/client/prices/${price_id}/accept/`,
        method: "POST",
      }),
      transformResponse: (response: { detail: string }) => response,
      extraOptions: { showErrors: false },
    }),
    cancelOrder: build.mutation<{ detail: string }, string>({
      query: (price_id) => ({
        url: `/client/prices/${price_id}/cancel/`,
        method: "POST",
      }),
      transformResponse: (response: { detail: string }) => response,
      extraOptions: { showErrors: false },
    }),
    getProposedPrices: build.query<TProposedPrice[], void>({
      query: () => ({
        url: "/client/proposed-prices/",
        method: "GET",
      }),
      transformResponse: (response: TProposedPrice[]) => response,
    }),
    getOrderHistoryList: build.query<TOrderHistory[], void>({
      query: () => ({
        url: "/client/order-history/",
        method: "GET",
      }),
      transformResponse: (response: TOrderHistory[]) => response,
    }),
    getOrderStorageHistoryList: build.query<
      TOrderStorageHistory[],
      { page: number; isRelevant: boolean }
    >({
      query: ({ page, isRelevant }) => ({
        url: "/store/history/",
        method: "GET",
        params: {
          page,
          isRelevant,
        },
      }),
      transformResponse: (response: TOrderStorageHistory[]) => response,
    }),
    getOrderProposedPricesStorage: build.query<
      TOrderProposedPricesStorage[],
      void
    >({
      query: () => ({
        url: "/store/orders/",
        method: "GET",
      }),
      transformResponse: (response: TOrderProposedPricesStorage[]) => response,
    }),
    acceptOrderProposedPricesStorage: build.mutation<
      TAcceptOrderProposedPricesStorageResponse,
      TAcceptOrderProposedPricesStorageRequest
    >({
      query: ({ order_id, proposed_price, flower_img, comment }) => {
        const formData = new FormData();
        formData.append("proposed_price", proposed_price);
        formData.append("comment", comment);
        if (flower_img) {
          formData.append("flower_img", {
            uri: flower_img,
            type: "image/jpeg",
            name: "flower_image.jpg",
          } as any);
        }

        return {
          url: `/store/propose-price/${order_id}/`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (
        response: TAcceptOrderProposedPricesStorageResponse
      ) => response,
      extraOptions: { showErrors: false },
    }),
    changeOrderStatus: build.mutation<
      TChangeOrderStatusResponse,
      TChangeOrderStatusRequest
    >({
      query: ({ order_id, status }) => ({
        url: `/store/order-status/${order_id}/`,
        method: "PATCH",
        body: {
          status,
        },
      }),
      transformResponse: (response: TChangeOrderStatusResponse) => response,
      extraOptions: { showErrors: false },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useCancelCurrentOrderMutation,
  useGetOrderHistoryListQuery,
  useLazyGetProposedPricesQuery,
  useLazyGetOrderHistoryListQuery,
  useLazyGetOrderProposedPricesStorageQuery,
  useAcceptOrderProposedPricesStorageMutation,
  useGetOrderStorageHistoryListQuery,
  useLazyGetOrderStorageHistoryListQuery,
  useAcceptOrderMutation,
  useCancelOrderMutation,
  useChangeOrderStatusMutation,
} = orderApi;
