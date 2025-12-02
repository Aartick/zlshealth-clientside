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

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appConfigSlice from "./features/appConfigSlice";
import filtersSlice from "./features/filtersSlice";
import cartSlice from "./features/cartSlice";
import wishlistSlice from "./features/wishlistSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  appConfig: appConfigSlice, // App configuration state
  filtersSlice,
  cartSlice, // Shopping cart state
  wishlistSlice, // Wishlist state
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cartSlice", "wishlistSlice"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store with combined reducers
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
