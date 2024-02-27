import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoiceList: [],
};

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    addInvoiceData: (state, action) => {
      state.invoiceList?.push(action.payload);
    },
    deleteInvoiceData: (state, action) => {
      return {
        ...state,
        invoiceList: state.invoiceList.filter(
          (invoice) => invoice.id !== action.payload.invoiceId
        ),
      };
    },
    updateInvoiceData: (state, action) => {
      const invoiceList = state.invoiceList || [];
      const dataIndex = invoiceList.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (dataIndex !== -1) {
        const updatedInvoiceList = [...invoiceList];
        updatedInvoiceList[dataIndex] = action.payload.updatedInvoiceData;

        return {
          ...state,
          invoiceList: updatedInvoiceList,
        };
      }
      return state;
    },
  },
});

export const { addInvoiceData, deleteInvoiceData, updateInvoiceData } =
  invoiceSlice.actions;

export const selectInvoiceDataList = (state) => state.invoice.invoiceList;

export default invoiceSlice.reducer;
