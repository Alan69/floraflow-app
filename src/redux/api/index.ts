import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TTokenResponse } from "modules/auth/redux/api";
import { authActions } from "modules/auth/redux/slices/auth.slice";
import { RootState } from "redux/rootReducer";
import { baseURL } from "types/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    clearStore: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        try {
          await AsyncStorage.clear();
          return {
            data: { success: true },
          };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: "Failed to clear storage",
            },
          };
        }
      },
    }),
  }),
  // @ts-ignore
  async baseQuery(args, api, extraOptions) {
    let result = await fetchBaseQuery({
      baseUrl: baseURL,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    })(args, api, extraOptions);

    if (
      result.error &&
      (result.error.status === 401 || result.error.status === 403)
    ) {
      const refreshToken = (api.getState() as RootState).auth.refreshToken;

      if (refreshToken) {
        try {
          const refreshResult = await fetchBaseQuery({
            baseUrl: baseURL,
          })(
            {
              url: "/token/refresh/",
              method: "POST",
              body: { refresh: refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const newTokens = refreshResult.data as TTokenResponse;

            api.dispatch(
              authActions.setToken({
                token: newTokens.access,
                refreshToken: newTokens.refresh,
              })
            );

            result = await fetchBaseQuery({
              baseUrl: baseURL,
              prepareHeaders: (headers) => {
                headers.set("Authorization", `Bearer ${newTokens.access}`);
                return headers;
              },
            })(args, api, extraOptions);
          } else {
            api.dispatch(authActions.logout());
          }
        } catch (error) {
          api.dispatch(authActions.logout());
        }
      } else {
        api.dispatch(authActions.logout());
      }
    }

    return result;
  },
});

export const { useClearStoreMutation } = baseApi;

export default baseApi;
