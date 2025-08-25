// src/redux/wishlistSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define your product type
export interface ProductType {
  _id: string;
  name: string;
  img: string;
  price: number;
  discount: number;
}

interface WishlistState {
  products: ProductType[];
}

const initialState: WishlistState = {
  products: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<ProductType>) => {
        console.log(action.payload)
      const exists = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (!exists) {
        state.products.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetWishlist: (state) => {
      state.products = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, resetWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
