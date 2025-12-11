/**
 * cartThunks
 *
 * Contains Redux async thunks for cart operations, syncing cart state with backend for logged-in users.
 * Handles merging guest cart, adding/removing items, fetching cart, and deleting items.
 *
 * Thunks:
 * - mergeGuestCart: Merges guest cart items into user cart on login.
 * - addToCart: Adds a product to the cart (backend).
 * - removeFromCart: Removes/decrements a product from the cart (backend).
 * - getCart: Fetches the current cart from backend.
 * - deleteFromCart: Deletes a product from the cart (backend).
 *
 * Usage:
 * - Dispatch these thunks for cart operations that require backend sync.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { resetCart } from "../features/cartSlice";
import { axiosClient } from "@/utils/axiosClient";

// Merge guest cart items into user cart on login
export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (_, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const guestCart = state.cartSlice?.cart;

      // If guest cart is empty, do nothing
      if (!guestCart.length) return;

      // Prepare products to merge
      const productsToMerge = guestCart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      // Send merge request to backend
      await axiosClient.post("/api/cart/items", { products: productsToMerge });

      // Reset guest cart after merging
      dispatch(resetCart());
    } catch {}
  }
);

// Add a product to the cart (backend)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    try {
      const response = await axiosClient.post("/api/cart", {
        productId,
        quantity,
      });
      // Return updated cart from backend
      return response.data.result;
    } catch {
      return [];
    }
  },
  {
    // Prevent race condition: skip if same product is already being added
    condition: ({ productId }, { getState }) => {
      const state = getState() as RootState;
      const product = state.cartSlice?.cart.find((item) => item._id === productId);
      // Only proceed if product is not already loading
      return !product?.loading;
    },
  }
);

// Remove/decrement a product from the cart (backend)
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }: { productId: string }) => {
    try {
      const response = await axiosClient.put("/api/cart/items", {
        productId,
      });

      // Return updated cart from backend
      return response.data.result;
    } catch {
      return [];
    }
  },
  {
    // Prevent race condition: skip if same product is already being removed
    condition: ({ productId }, { getState }) => {
      const state = getState() as RootState;
      const product = state.cartSlice?.cart.find((item) => item._id === productId);
      // Only proceed if product is not already loading
      return !product?.loading;
    },
  }
);

// Fetch the current cart from backend
export const getCart = createAsyncThunk("cart/getCart", async () => {
  try {
    const response = await axiosClient.get("/api/cart");
    // Return cart data
    return response.data.result;
  } catch {
    return [];
  }
});

// Update quantity of a product in the cart (backend)
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }: { productId: string; quantity: number }, thunkAPI) => {
    try {
      const response = await axiosClient.patch("/api/cart/items", {
        productId,
        quantity,
      });
      // Return updated cart from backend
      return response.data.result;
    } catch {
      // If update fails, refresh cart to get current state
      thunkAPI.dispatch(getCart());
      return [];
    }
  }
);

// Delete a product from the cart (backend)
export const deleteFromCart = createAsyncThunk(
  "cart/deleteFromCart",
  async ({ productId }: { productId: string }, thunkAPI) => {
    try {
      // Send delete request to backend
      await axiosClient.delete(`/api/cart/items?productId=${productId}`);
      // Refresh cart after deletion
      thunkAPI.dispatch(getCart());
    } catch {
      return [];
    }
  }
);

// Delete cart entirely (backend)
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (_, thunkAPI) => {
    try {
      await axiosClient.delete("/api/cart");
      thunkAPI.dispatch(getCart());
    } catch {
      return [];
    }
  }
);
