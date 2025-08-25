import { configureStore } from "@reduxjs/toolkit";
import appConfigSlice from "./features/appConfigSlice";
import cartSlice from "./features/cartSlice";
import wishlistSlice from "./features/wishlistSlice";

export const store = configureStore({
  reducer: {
    appConfig: appConfigSlice,
    cartSlice,
    wishlistSlice,
  },
});

// Infer the type of makeStore
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
