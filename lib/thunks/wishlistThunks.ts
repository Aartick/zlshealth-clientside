import { getItem, KEY_ACCESS_TOKEN } from "@/utils/localStorageManager";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId }: { productId: string }) => {
    try {
      const response = await axios.post(
        "/api/wishlist",
        { productId },
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

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ productId }: { productId: string }) => {
    try {
      const response = await axios.put(
        "/api/wishlist",
        { productId },
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
