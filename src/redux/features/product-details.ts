import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product | null;
};

const initialState: InitialState = {
  value: null,
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (state, action: PayloadAction<Product>) => {
      state.value = action.payload;
    },
    clearProductDetails: (state) => {
      state.value = null;
    },
  },
});

export const { updateproductDetails, clearProductDetails } =
  productDetails.actions;
export default productDetails.reducer;
