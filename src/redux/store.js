import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./invoiceDataSlice";

export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
  },
});
