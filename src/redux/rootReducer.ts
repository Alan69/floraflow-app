import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "./api";
import { authReducer } from "modules/auth/redux/slices/auth.slice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
