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
import axios from "axios";
import { getItem, KEY_ACCESS_TOKEN } from "@/utils/localStorageManager";

// Merge guest cart items into user cart on login
export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (_, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const guestCart = state.cartSlice.cart;

      // If guest cart is empty, do nothing
      if (!guestCart.length) return;

      // Prepare products to merge
      const productsToMerge = guestCart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      // Send merge request to backend
      await axios.post(
        "/api/cart/items",
        { products: productsToMerge },
        {
          headers: {
            Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
          },
        }
      );

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
      const response = await axios.post(
        "/api/cart",
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
          },
        }
      );
      // Return updated cart from backend
      return response.data.result;
    } catch {
      return [];
    }
  }
);

// Remove/decrement a product from the cart (backend)
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }: { productId: string }) => {
    try {
      const response = await axios.put(
        "/api/cart/items",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
          },
        }
      );

      // Return updated cart from backend
      return response.data.result;
    } catch {
      return [];
    }
  }
);

// Fetch the current cart from backend
export const getCart = createAsyncThunk("cart/getCart", async () => {
  try {
    const response = await axios.get("/api/cart", {
      headers: {
        Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
      },
    });
    // Return cart data
    return response.data.result;
  } catch {
    return [];
  }
});

// Delete a product from the cart (backend)
export const deleteFromCart = createAsyncThunk(
  "cart/deleteFromCart",
  async ({ productId }: { productId: string }, thunkAPI) => {
    try {
      // Send delete request to backend
      await axios.delete(`/api/cart/items?productId=${productId}`, {
        headers: {
          Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
        },
      });
      // Refresh cart after deletion
      thunkAPI.dispatch(getCart());
    } catch {
      return [];
    }
  }
);
