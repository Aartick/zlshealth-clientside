import { axiosClient } from "@/utils/axiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllFilters = createAsyncThunk(
  "filters/getAll",
  async () => {
    const res = await axiosClient.get("/api/filters");
    return res.data.result;
  }
);

