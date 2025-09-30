/**
 * wishlistSlice
 *
 * Redux slice for managing the wishlist state.
 * Handles wishlist actions for both guests (local state) and logged-in users (backend sync via thunks).
 *
 * State:
 * - products: Array of ProductType representing products in the wishlist.
 *
 * Actions:
 * - addToWishlistGuest: Adds a product to the wishlist for guest users.
 * - removeFromWishlistGuest: Removes a product from the wishlist for guest users.
 * - resetWishlist: Clears the wishlist.
 *
 * Extra Reducers:
 * - addToWishlist.fulfilled: Updates wishlist state after backend add-to-wishlist.
 * - removeFromWishlist.fulfilled: Updates wishlist state after backend remove-from-wishlist.
 *
 * Usage:
 * - Use actions for guest wishlist management.
 * - Thunks handle backend sync for logged-in users.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../thunks/wishlistThunks";
import { productType } from "@/interfaces/cartWish";

// Wishlist state definition
interface WishlistState {
  products:productType[];
}

// Initial wishlist state
const initialState: WishlistState = {
  products: [],
};

// Create Redux slice for wishlist
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Add product to wishlist for guest users
    addToWishlistGuest: (state, action: PayloadAction<productType>) => {
      const exists = state.products.find(
        (item) => item._id === action.payload._id
      );
      // Only add if not already in wishlist
      if (!exists) {
        state.products.push(action.payload);
      }
    },
    // Remove product from wishlist for guest users
    removeFromWishlistGuest: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    // Reset/clear the wishlist
    resetWishlist: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    // Update wishlist state after backend add-to-wishlist
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      // Make sure action.payload always be an array
      const updatedWishlist = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.products = updatedWishlist;
    });
    // Update wishlist state after backend remove-from-wishlist
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      // Make sure action.payload always be an array
      const updatedWishlist = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.products = updatedWishlist;
    });
    // Update wishlist state from backend
    builder.addCase(getWishlist.fulfilled, (state, action) => {
      // Make sure action.payload always be an array
      const updatedWishlist = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.products = updatedWishlist;
    });
  },
});

// Export actions for dispatch
export const { addToWishlistGuest, removeFromWishlistGuest, resetWishlist } =
  wishlistSlice.actions;

// Export reducer for store
export default wishlistSlice.reducer;
