import { axiosClient } from "@/utils/axiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch and return user information
export const getMyInfo = createAsyncThunk("/api/users", async () => {
  try {
    const response = await axiosClient.get("/api/users");
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
      const response = await axiosClient.get("/api/users/addresses");
      console.log(response.data.result, "address thunk");
      return response.data.result;
    } catch {
      return null;
    }
  }
);
