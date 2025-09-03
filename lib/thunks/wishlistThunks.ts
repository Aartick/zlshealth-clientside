/**
 * wishlistThunks
 *
 * Contains Redux async thunks for wishlist operations, 
 * syncing wishlist state with backend for logged-in users.
 * Handles adding and removing products from the wishlist.
 *
 * Thunks:
 * - addToWishlist: Adds a product to the wishlist (backend).
 * - removeFromWishlist: Removes a product from the wishlist (backend).
 *
 * Usage:
 * - Dispatch these thunks for wishlist operations that require backend sync.
 */

import { getItem, KEY_ACCESS_TOKEN } from "@/utils/localStorageManager";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add a product to the wishlist (backend)
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId }: { productId: string }) => {
    try {
      // Send POST request to backend to add product to wishlist
      const response = await axios.post(
        "/api/wishlist",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
          },
        }
      );
      // Return updated wishlist from backend
      return response.data.result;
    } catch (e) {
      // On error, return empty array
      return [];
    }
  }
);

// Remove a product from the wishlist (backend)
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ productId }: { productId: string }) => {
    try {
      // Send PUT request to backend to remove product from wishlist
      const response = await axios.put(
        "/api/wishlist",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
          },
        }
      );
      // Return updated wishlist from backend
      return response.data.result;
    } catch (e) {
      // On error, return empty array
      return [];
    }
  }
);
