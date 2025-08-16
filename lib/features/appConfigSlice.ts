import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  toastData: Record<string, any>;
}

interface ToastPayload {
  message: string;
  type: string;
}

const initialState: AppState = {
    toastData: {}
}

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastPayload>) => {
        state.toastData = action.payload;
    }
  }
});

export default appConfigSlice.reducer;

export const {showToast} = appConfigSlice.actions
