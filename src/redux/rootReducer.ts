import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "./api";
import { authReducer } from "modules/auth/redux/slices/auth.slice";
import { accountReducer } from "modules/account/redux/slices/account.slice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  account: accountReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
