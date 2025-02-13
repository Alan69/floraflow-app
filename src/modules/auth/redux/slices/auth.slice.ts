import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TStoreProfileData, TUserData } from "modules/account/types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: TUserData | null;
  storeProfile: TStoreProfileData | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  storeProfile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      {
        payload: { refreshToken, token },
      }: PayloadAction<{ token: string | null; refreshToken: string | null }>
    ) => {
      state.token = token;
      state.refreshToken = refreshToken;

      if (token) {
        AsyncStorage.setItem("token", token);
      }
      if (refreshToken) {
        AsyncStorage.setItem("refreshToken", refreshToken);
      }
    },
    setUser: (state, { payload }: PayloadAction<TUserData | null>) => {
      state.user = payload;
    },
    setStoreProfile: (
      state,
      { payload }: PayloadAction<TStoreProfileData | null>
    ) => {
      state.storeProfile = payload;
    },
    logOut: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;

      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("refreshToken");
    },
  },
});

export const loadStoredData = async () => {
  const token = await AsyncStorage.getItem("token");
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  return {
    token,
    refreshToken,
  };
};

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export type { AuthState };
