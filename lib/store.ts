/**
 * Redux Store Configuration
 * 
 * Sets up the Redux store for the application using @reduxjs/toolkit.
 * Combines appConfig, cart, and wishlist slices as reducers.
 *
 * Usage:
 * - Provides a centralized state management for app config, cart, and wishlist.
 * - Exports store instance and types for RootState and AppDispatch.
 */

import { configureStore } from "@reduxjs/toolkit";
import appConfigSlice from "./features/appConfigSlice";
import cartSlice from "./features/cartSlice";
import wishlistSlice from "./features/wishlistSlice";

// Create Redux store with combined reducers
export const store = configureStore({
  reducer: {
    appConfig: appConfigSlice,   // App configuration state
    cartSlice,                   // Shopping cart state
    wishlistSlice,               // Wishlist state
  },
});

// Infer the type of makeStore
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
