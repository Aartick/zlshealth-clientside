/**
 * Redux Typed Hooks
 * 
 * Provides typed versions of useDispatch, useSelector, and useStore for use with the app's Redux store.
 * Ensures type safety and autocompletion when accessing Redux state and dispatch.
 *
 * Usage:
 * - Use useAppDispatch instead of plain useDispatch for dispatching actions.
 * - Use useAppSelector instead of plain useSelector for selecting state.
 * - Use useAppStore for accessing the Redux store instance.
 */

import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// Typed dispatch hook for Redux actions
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// Typed selector hook for accessing Redux state
export const useAppSelector = useSelector.withTypes<RootState>()
// Typed store hook for accessing the Redux store instance
export const useAppStore = useStore.withTypes<AppStore>()