/**
 * Actions Index
 * 
 * Contains server actions for authentication.
 * Handles Google login using NextAuth's signIn method.
 *
 * Functions:
 * - googleLogIn: Initiates Google login and redirects to home page.
 *
 * Usage:
 * - Call googleLogIn with "google" to start Google OAuth flow.
 */

'use server'

import { signIn } from "@/app/auth";

// Initiates Google login and redirects to home page
export async function googleLogIn(action: string) {
  // Call NextAuth signIn with provider and redirect option
  await signIn(action, { redirectTo: "/" });
}
