import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { resetCart } from "../features/cartSlice";
import axios from "axios";
import { getItem, KEY_ACCESS_TOKEN } from "@/utils/localStorageManager";

export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (_, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const guestCart = state.cartSlice.cart;

      if (!guestCart.length) return;

      const productsToMerge = guestCart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      await axios.post(
        "/api/cart/items",
        { products: productsToMerge },
        {
          headers: {
            Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
          },
        }
      );

      dispatch(resetCart());
    } catch (e) {}
  }
);

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
      return response.data.result;
    } catch (e) {
      return [];
    }
  }
);

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

      return response.data.result;
    } catch (e) {
      return [];
    }
  }
);

export const getCart = createAsyncThunk("cart/removeFromCart", async () => {
  try {
    const response = await axios.get("/api/cart", {
      headers: {
        Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
      },
    });
    return response.data.result;
  } catch (e) {
    return [];
  }
});

export const deleteFromCart = createAsyncThunk(
  "cart/deleteFromCart",
  async ({ productId }: { productId: string }, thunkAPI) => {
    try {
      await axios.delete(`/api/cart/items?productId=${productId}`, {
        headers: {
          Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
        },
      });
      thunkAPI.dispatch(getCart());
    } catch (e) {
      return [];
    }
  }
);
