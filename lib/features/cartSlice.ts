/**
 * cartSlice
 *
 * Redux slice for managing the shopping cart state.
 * Handles cart actions for both guests (local state) and logged-in users (backend sync via thunks).
 *
 * State:
 * - cart: Array of CartItemType representing products in the cart.
 *
 * Actions:
 * - addToCartGuest: Adds a product to the cart for guest users.
 * - removeFromCartGuest: Removes or decrements a product from the cart for guest users.
 * - resetCart: Clears the cart.
 *
 * Extra Reducers:
 * - addToCart.fulfilled: Updates cart state after backend add-to-cart.
 * - removeFromCart.fulfilled: Updates cart state after backend remove-from-cart.
 *
 * Usage:
 * - Use actions for guest cart management.
 * - Thunks handle backend sync for logged-in users.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addToCart, getCart, removeFromCart } from "../thunks/cartThunks";
import { productType } from "@/interfaces/cartWish";

// Cart item type definition


// Cart state definition
interface GroceryCartState {
  cart: productType[];
}

// Initial cart state
const initialState: GroceryCartState = {
  cart: [],
};

// Create Redux slice for cart
const groceryCartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    // Add product to cart for guest users
    addToCartGuest: (state, action: PayloadAction<productType>) => {
      const curProduct = action.payload;
      const index = state.cart.findIndex((item) => item._id === curProduct._id);

      if (index === -1) {
        // If product not in cart, add it
        state.cart.push({ ...curProduct });
      } else {
        // If already in cart, increment quantity
        state.cart[index].quantity += 1;
      }
    },
    // Remove or decrement product from cart for guest users
    removeFromCartGuest: (state, action: PayloadAction<string>) => {
      const index = state.cart.findIndex((item) => item._id === action.payload);

      if (index === -1) return;

      if (state.cart[index].quantity === 1) {
        // If quantity is 1, remove product from cart
        state.cart = state.cart.filter((item) => item._id !== action.payload);
      } else {
        // Otherwise, decrement quantity
        state.cart[index].quantity -= 1;
      }
    },
    // Reset/clear the cart
    resetCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    // Update cart state after backend add-to-cart
    builder.addCase(addToCart.fulfilled, (state, action) => {
      // Make sure action.payload always be an array
      const updatedCart = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.cart = updatedCart;
    });
    // Update cart state after backend remove-from-cart
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      // Make sure action.payload always be an array
      const updatedCart = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.cart = updatedCart;
    });
    // Update cart state from backend (returns all the items)
    builder.addCase(getCart.fulfilled, (state, action) => {
      // Make sure action.payload always be an array
      const updatedCart = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.cart = updatedCart;
    });
  },
});

// Export reducer for store
export default groceryCartSlice.reducer;

// Export actions for dispatch
export const { addToCartGuest, removeFromCartGuest, resetCart } =
  groceryCartSlice.actions;
