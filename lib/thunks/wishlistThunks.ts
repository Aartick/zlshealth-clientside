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

import { axiosClient } from "@/utils/axiosClient";
import { RootState } from "../store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { resetWishlist } from "../features/wishlistSlice";

// Merge guest wishlist items into user wishlist on login
export const mergeGuestWishlist = createAsyncThunk(
  "wishlist/mergeGuestWishlist",
  async (_, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const guestWishlist = state.wishlistSlice.products;

      // If guest wishlist is empty, do nothing
      if (!guestWishlist.length) return;

      // Prepare product to merge
      const productsToMerge = guestWishlist.map((item) => ({
        productId: item._id,
      }));

      await axiosClient.post("/api/wishlist/mergeGuestWishlist", {
        products: productsToMerge,
      });

      dispatch(resetWishlist());
    } catch (error) {
      console.log(error);
    }
  }
);

// Add a product to the wishlist (backend)
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId }: { productId: string }) => {
    try {
      // Send POST request to backend to add product to wishlist
      const response = await axiosClient.post("/api/wishlist", { productId });
      // Return updated wishlist from backend
      return response.data.result;
    } catch {
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
      const response = await axiosClient.put("/api/wishlist", { productId });
      // Return updated wishlist from backend
      return response.data.result;
    } catch {
      // On error, return empty array
      return [];
    }
  }
);

// Fetch the current wishlist from the backend
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async () => {
    try {
      const response = await axiosClient.get("/api/wishlist");
      // Return wishlist data
      return response.data.result;
    } catch {
      return [];
    }
  }
);
