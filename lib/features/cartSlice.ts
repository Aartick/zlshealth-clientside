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
import { addToCart, getCart, removeFromCart, updateQuantity } from "../thunks/cartThunks";
import { productType } from "@/interfaces/cartWish";

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
    deleteFromCartGuest: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },
    // Update quantity for guest users
    updateQuantityGuest: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const product = state.cart.find((item) => item._id === productId);
      if (product) {
        product.quantity = quantity;
      }
    },
    // Reset/clear the cart
    resetCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    // ====== ADD TO CART ======
    builder
      .addCase(addToCart.pending, (state, action) => {
        const { productId } = action.meta.arg;

        const product = state.cart.find((item) => item._id === productId);
        if (product) {
          // Prevent race condition: only set loading if not already loading
          if (!product.loading) {
            product.loading = true;
          }
        } else {
          // Only add placeholder if product doesn't exist and isn't already being added
          const isAlreadyPending = state.cart.some(
            (item) => item._id === productId && item.loading
          );
          if (!isAlreadyPending) {
            state.cart.push({
              _id: productId,
              category: "",
              productTypes: [""],
              benefits: [""],
              name: "",
              img: "",
              price: 0,
              quantity: 0,
              about: "",
              discount: 0,
              loading: true,
            });
          }
        }
      })
      // Update cart state after backend add-to-cart
      .addCase(addToCart.fulfilled, (state, action) => {
        // Make sure action.payload always be an array
        const updatedCart = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.cart = updatedCart.map((p) => ({
          ...p,
          loading: false,
        }));
      })
      .addCase(addToCart.rejected, (state, action) => {
        const { productId } = action.meta.arg;

        const product = state.cart.find((item) => item._id === productId);
        if (product) product.loading = false;
      });

    // ====== REMOVE FROM CART ======
    builder
      .addCase(removeFromCart.pending, (state, action) => {
        const { productId } = action.meta.arg;
        const product = state.cart.find((item) => item._id === productId);
        // Prevent race condition: only set loading if not already loading
        if (product && !product.loading) {
          product.loading = true;
        }
      })
      // Update cart state after backend remove-from-cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        // Make sure action.payload always be an array
        const updatedCart = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.cart = updatedCart.map((p) => ({
          ...p,
          loading: false,
        }));
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        const product = state.cart.find((item) => item._id === productId);
        if (product) product.loading = false;
      });

    // ====== UPDATE QUANTITY ======
    builder
      .addCase(updateQuantity.pending, (state, action) => {
        const { productId } = action.meta.arg;
        const product = state.cart.find((item) => item._id === productId);
        if (product && !product.loading) {
          product.loading = true;
        }
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        // Make sure action.payload always be an array
        const updatedCart = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.cart = updatedCart.map((p) => ({
          ...p,
          loading: false,
        }));
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        const product = state.cart.find((item) => item._id === productId);
        if (product) product.loading = false;
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
export const {
  addToCartGuest,
  removeFromCartGuest,
  deleteFromCartGuest,
  updateQuantityGuest,
  resetCart,
} = groceryCartSlice.actions;
