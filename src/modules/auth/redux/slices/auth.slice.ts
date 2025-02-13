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
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setStoreProfile: (state, action) => {
      state.storeProfile = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.storeProfile = null;
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
