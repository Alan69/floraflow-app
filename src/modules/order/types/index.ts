export enum OrderStatusEnum {
  pending = "pending",
  accepted = "accepted",
  completed = "completed",
  canceled = "canceled",
  in_transit = "in_transit",
}

export enum OrderStatusName {
  pending = "Ждем ответа",
  accepted = "Заказ принят",
  completed = "Завершён",
  canceled = "Отменён",
  in_transit = "В пути",
}

export enum FlowerHeightEnum {
  FiftyCm = "50cm",
  SixtyCm = "60cm",
  SeventyCm = "70cm",
  EightyCm = "80cm",
  NinetyCm = "90cm",
  OneHundredCm = "100cm",
  OneHundredTenCm = "110cm",
  OneHundredTwentyCm = "120cm",
  OneHundredThirtyCm = "130cm",
  OneHundredFortyCm = "140cm",
  OneHundredFiftyCm = "150cm",
}

export type TFlowerData = {
  text: string;
};

export type TFlowerColorData = {
  text: string;
};

export type TOrderHistory = {
  uuid: string;
  flower: TFlowerData;
  color: TFlowerColorData;
  flower_height: string;
  quantity: number;
  decoration: boolean;
  city: string;
  recipients_address: string;
  recipients_phone: string;
  flower_data: string;
  price: string;
  status: OrderStatusEnum;
  reason: string;
  created_at: string;
  updated_at: string;
  rating: number;
  instagram_link: string | null;
  whatsapp_number: string | null;
  twogis: string | null;
};

export type TOrderProposedPricesStorage = {
  uuid: string;
  first_name: string;
  flower: TFlowerData;
  color: TFlowerColorData;
  flower_height: FlowerHeightEnum;
  quantity: number;
  decoration: boolean;
  recipients_address: string;
  flower_data: string;
};

export type TOrderHistoryResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TOrderHistory[];
};

export type TOrderStorageHistoryResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TOrderStorageHistory[];
};

export type TOrderStorageHistory = {
  uuid: string;
  flower: TFlowerData;
  color: TFlowerColorData;
  flower_height: string;
  quantity: number;
  decoration: boolean;
  city: string;
  recipients_address: string;
  recipients_phone: string;
  customer_phone: string;
  flower_data: string;
  status: OrderStatusEnum;
  reason: string;
  created_at: string;
  updated_at: string;
  rating: number;
  proposed_price: string;
  comment: string;
  first_name: string;
};

export type TOrderProposedPricesStorageResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TOrderProposedPricesStorage[];
};

export type TOrderCreateRequest = {
  flower: string;
  color: TFlowerColorData;
  flower_height: FlowerHeightEnum;
  quantity: number;
  decoration: boolean;
  recipients_address: string;
  recipients_phone: string;
  flower_data: string;
};

export type TAcceptOrderProposedPricesStorageRequest = {
  order_id: string;
  proposed_price: string;
  flower_img: string;
  comment: string;
};

export type TChangeOrderStatusRequest = {
  order_id: string;
  status: OrderStatusEnum;
};

export type TChangeOrderStatusResponse = {
  uuid: string;
  status: OrderStatusEnum;
};

export type TAcceptOrderProposedPricesStorageResponse = {
  uuid: string;
  proposed_price: string;
  flower_img: string;
  comment: string;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string;
  store_name: string;
  logo: string;
  instagram_link: string;
  whatsapp_number: string;
};

export type TCreateOrderResponse = {
  uuid: string;
  flower: TFlowerData;
  color: TFlowerColorData;
  flower_height: string;
  quantity: number;
  decoration: boolean;
  recipients_address: string;
  recipients_phone: string;
  flower_data: string;
  price: string;
  status: OrderStatusEnum;
  reason: string;
  created_at: string;
  updated_at: string;
};

export type TCancelCurrentOrderRequest = {
  order_uuid: string;
  reason: string;
};

export type TCancelCurrentOrderResponse = {
  detail: string;
  order: any;
};

export type TLinks = {
  next: number | null;
  previous: number | null;
};

export type TProposedPrice = {
  uuid: string;
  proposed_price: string;
  flower_img: string | null;
  comment: string | null;
  is_accepted: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  store_name: string;
  logo: string | null;
  instagram_link: string | null;
  whatsapp_number: string | null;
  rating: number;
  twogis: string | null;
};

export type TProposedPricesResponse = {
  links: TLinks;
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: TProposedPrice[];
};

export type TCurrentOrderStore = {
  address: string | null;
  instagram_link: string | null;
  logo: string | null;
  store_name: string | null;
  twogis: string | null;
  uuid: string | null;
  whatsapp_number: string | null;
  proposed_price: string | null;
  comment: string | null;
};

export type TCurrentOrderResponse = {
  uuid: string;
  flower: TFlowerData;
  color: TFlowerColorData;
  flower_height: string;
  quantity: number;
  decoration: boolean;
  recipients_address: string;
  recipients_phone: string;
  flower_data: string;
  price: any;
  status: OrderStatusEnum;
  reason: any;
  created_at: string;
  updated_at: string;
  prices: TCurrentOrderStore[];
};
