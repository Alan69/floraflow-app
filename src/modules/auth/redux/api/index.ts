import { CityEnum, TUserData } from "modules/account/types";
import baseApi from "../../../../redux/api";

type TLogin = {
  email: string;
  password: string;
};

type TSignUp = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: CityEnum;
};

type TLoginResponse = {
  data: {
    access: string;
    refresh: string;
  };
};

type TSignUpResponse = {
  access: string;
  refresh: string;
  user: TUserData;
};

export type TTokenResponse = {
  access: string;
  refresh: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TLoginResponse, TLogin>({
      query: ({ email, password }) => ({
        url: "/login/",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
      transformResponse: (response: TLoginResponse) => response,
      extraOptions: { showErrors: false },
    }),
    signUp: build.mutation<TSignUpResponse, TSignUp>({
      query: ({ email, password, first_name, last_name, phone, city }) => ({
        url: "/register/",
        method: "POST",
        body: {
          email,
          password,
          first_name,
          last_name,
          phone,
          city,
        },
      }),
      transformResponse: (response: TSignUpResponse) => response,
    }),
    refreshToken: build.mutation<TTokenResponse, { refresh: string }>({
      query: ({ refresh }) => ({
        url: "/token/refresh/",
        method: "POST",
        body: { refresh },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: TTokenResponse) => response,
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useSignUpMutation, useRefreshTokenMutation } =
  authApi;
