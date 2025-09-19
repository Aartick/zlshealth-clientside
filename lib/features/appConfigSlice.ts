/**
 * appConfigSlice
 *
 * Redux slice for application configuration state.
 * Handles global toast notifications and other app-wide config.
 *
 * State:
 * - toastData: Stores toast message and type for notifications.
 *
 * Actions:
 * - showToast: Sets the toastData with a message and type.
 *
 * Usage:
 * - Dispatch showToast to trigger a toast notification in the app.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Payload interface for toast notifications
interface ToastPayload {
  message: string;
  type: string;
}

// State interface for app config
interface AppState {
  toastData: ToastPayload | null;
}

// Initial state for app config
const initialState: AppState = {
  toastData: null,
};

// Create Redux slice for app config
const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState,
  reducers: {
    // Action to show a toast notification
    showToast: (state, action: PayloadAction<ToastPayload>) => {
      state.toastData = action.payload;
    },
  },
});

// Export reducer for store
export default appConfigSlice.reducer;

// Export actions for dispatch
export const { showToast } = appConfigSlice.actions;
