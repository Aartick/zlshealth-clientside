// src/redux/wishlistSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addToWishlist, removeFromWishlist } from "../thunks/wishlistThunks";

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
    addToWishlistGuest: (state, action: PayloadAction<ProductType>) => {
      const exists = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (!exists) {
        state.products.push(action.payload);
      }
    },
    removeFromWishlistGuest: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetWishlist: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export const { addToWishlistGuest, removeFromWishlistGuest, resetWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
