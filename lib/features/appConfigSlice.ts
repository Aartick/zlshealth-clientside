/**
 * appConfigSlice
 *
 * Redux slice for application configuration state.
 * Handles global toast notifications and other app-wide config.
 *
 * Usage:
 * - Dispatch showToast to trigger a toast notification in the app.
 */

import { createSlice } from "@reduxjs/toolkit";
import { getMyAddress, getMyInfo } from "../thunks/userThunks";
import { Address, initialDetails, UserDetails } from "@/interfaces/user";

// State interface for app config
interface AppState {
  myProfile: UserDetails;
  myAddress: Address[] | [];
}

// Initial state for app config
const initialState: AppState = {
  myProfile: initialDetails,
  myAddress: [],
};

// Create Redux slice for app config
const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState,
  reducers: {
    removeMyInfo: (state) => {
      (state.myProfile = initialDetails), (state.myAddress = []);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMyInfo.fulfilled, (state, action) => {
      state.myProfile = action.payload;
    });
    builder.addCase(getMyAddress.fulfilled, (state, action) => {
      const updatedAddress = Array.isArray(action.payload)
        ? action.payload
        : [];

      state.myAddress = updatedAddress;
    });
  },
});

// Export reducer for store
export default appConfigSlice.reducer;

// Export actions for dispatch
export const { removeMyInfo } = appConfigSlice.actions;
