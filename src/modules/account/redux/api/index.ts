import baseApi from "../../../../redux/api";
import { CityEnum, TStoreProfileData, TUserData } from "modules/account/types";
import { UserTypeEnum } from "../../types/index";
import { authActions } from "modules/auth/redux/slices/auth.slice";

export type TUpdateMeRequest = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  // user_type: UserTypeEnum;
  city: CityEnum;
  profile_picture?: File | string;
};

export type TUpdateMeResponse = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: UserTypeEnum;
  city: CityEnum;
  profile_picture?: File | string;
};

export type TUpdateUserTypeRequest = {
  phone: string;
  user_type: UserTypeEnum;
};

export type TUpdateStoreProfileRequest = {
  store_name: string;
  logo: string;
  address: string;
  instagram_link: string;
  twogis: string;
  whatsapp_number: string;
};

export type TUpdateStoreProfileResponse = {
  uuid: string;
  store_name: string;
  logo: string;
  address: string;
  instagram_link: string;
  twogis: string;
  whatsapp_number: string;
  average_rating: number;
};

export const accountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<TUserData, void>({
      query: () => ({
        url: "/me/",
        method: "GET",
      }),
      transformResponse: (response: TUserData) => response,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setUser(data));
        } catch (err) {
          console.error("Failed to fetch user data", err);
        }
      },
    }),
    updateMe: build.mutation<TUpdateMeResponse, TUpdateMeRequest>({
      query: ({
        email,
        first_name,
        last_name,
        phone,
        // user_type,
        city,
        profile_picture,
      }) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("phone", phone);
        // formData.append("user_type", user_type);
        formData.append("city", city);

        if (profile_picture && typeof profile_picture !== "string") {
          formData.append("profile_picture", profile_picture);
        }

        return {
          url: "/me/",
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: (response: TUpdateMeResponse) => response,
      extraOptions: { showErrors: false },
    }),
    updateUserType: build.mutation<TUpdateMeResponse, TUpdateUserTypeRequest>({
      query: ({ phone, user_type }) => {
        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("user_type", user_type);

        return {
          url: "/me/",
          method: "PATCH",
          body: formData,
        };
      },
      transformResponse: (response: TUpdateMeResponse) => response,
      extraOptions: { showErrors: false },
    }),
    getStoreProfile: build.query<TStoreProfileData, void>({
      query: () => ({
        url: "/store/profile/",
        method: "GET",
      }),
      transformResponse: (response: TStoreProfileData) => response,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setStoreProfile(data));
        } catch (err) {
          console.error("Failed to fetch user data", err);
        }
      },
    }),
    updateStoreProfile: build.mutation<
      TUpdateStoreProfileResponse,
      TUpdateStoreProfileRequest
    >({
      query: ({
        store_name,
        logo,
        address,
        instagram_link,
        twogis,
        whatsapp_number,
      }) => {
        const formData = new FormData();
        formData.append("store_name", store_name);
        formData.append("address", address);
        formData.append("instagram_link", instagram_link);
        formData.append("twogis", twogis);
        formData.append("whatsapp_number", whatsapp_number);

        if (logo && typeof logo !== "string") {
          formData.append("logo", logo);
        }

        return {
          url: "/store/profile/",
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: (response: TUpdateStoreProfileResponse) => response,
      extraOptions: { showErrors: false },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetMeQuery,
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateUserTypeMutation,
  useLazyGetStoreProfileQuery,
  useGetStoreProfileQuery,
  useUpdateStoreProfileMutation,
} = accountApi;
