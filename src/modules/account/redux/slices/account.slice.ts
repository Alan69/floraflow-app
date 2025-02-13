import { createSlice } from "@reduxjs/toolkit";
import { accountApi } from "../api";

interface AccountState {
  isUpdatingUserType: boolean;
}

const initialState: AccountState = {
  isUpdatingUserType: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(accountApi.endpoints.updateUserType.matchPending, (state) => {
        state.isUpdatingUserType = true;
      })
      .addMatcher(
        accountApi.endpoints.updateUserType.matchFulfilled,
        (state) => {
          state.isUpdatingUserType = false;
        }
      )
      .addMatcher(
        accountApi.endpoints.updateUserType.matchRejected,
        (state) => {
          state.isUpdatingUserType = false;
        }
      );
  },
});

export const accountReducer = accountSlice.reducer;
export const accountActions = accountSlice.actions;
export type { AccountState };
