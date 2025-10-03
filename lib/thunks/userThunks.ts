import { getItem, KEY_ACCESS_TOKEN } from "@/utils/localStorageManager";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch and return user information
export const getMyInfo = createAsyncThunk("/api/users", async () => {
  try {
    const response = await axios.get("/api/users", {
      headers: {
        Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
      },
    });
    return response.data.result;
  } catch {
    return null;
  }
});

// Fetch and return user addresses
export const getMyAddress = createAsyncThunk(
  "/api/users/addresses",
  async () => {
    try {
      const response = await axios.get("/api/users/addresses", {
        headers: {
          Authorization: `Bearer ${getItem(KEY_ACCESS_TOKEN)}`,
        },
      });
      return response.data.result;
    } catch {
      return null;
    }
  }
);
