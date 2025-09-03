/**
 * StoreProvider Component
 * 
 * Wraps the app with Redux Provider to supply the Redux store context.
 * Ensures all child components have access to the Redux store for state management.
 *
 * Props:
 * - children {React.ReactNode}: The components to render inside the provider.
 *
 * Usage:
 * - Use this component at the root of your app to enable Redux state management.
 */

'use client'
import { store } from '@/lib/store'
import { Provider } from 'react-redux'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  // Wrap children with Redux Provider to pass down the store
  return <Provider store={store}>{children}</Provider>
}