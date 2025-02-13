import { TCurrentOrderResponse } from "modules/order/types";

export enum CityEnum {
  ASTANA = "Astana",
}

export enum UserTypeEnum {
  CLIENT = "client",
  STORE = "store",
}

export type TUserData = {
  current_order: TCurrentOrderResponse | null;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: UserTypeEnum;
  city: CityEnum;
  profile_picture?: File | string;
};

export type TStoreProfileData = {
  uuid: string;
  store_name: string;
  logo: string;
  address: string;
  instagram_link: string;
  twogis: string;
  whatsapp_number: string;
  average_rating: number;
};
