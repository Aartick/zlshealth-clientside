/**
 * Providers Component
 *
 * Handles authentication token management for the app.
 * Listens for NextAuth session changes and fetches a JWT access token from the backend when a user logs in via Google.
 * Stores the JWT token in localStorage for use in authenticated API requests.
 *
 * Props:
 * - None (used for global side effects, not UI).
 *
 * Usage:
 * - Place inside the app layout to ensure access token is set for authenticated users.
 */

"use client";

import { useAppDispatch } from "@/lib/hooks";
import { mergeGuestCart } from "@/lib/thunks/cartThunks";
import { mergeGuestWishlist } from "@/lib/thunks/wishlistThunks";
import { axiosClient } from "@/utils/axiosClient";
import {
  getItem,
  KEY_ACCESS_TOKEN,
  MERGE_DONE_KEY,
  setItem,
} from "@/utils/localStorageManager";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function Providers() {
  // Get session data and authentication status from NextAuth
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Function to fetch JWT token from backend when user is authenticated
    const getToken = async () => {
      try {
        // Only run when user is authenticated and session contains user info
        if (status === "authenticated" && session.user) {
          // Check if merge already happened
          const alreadyMerged = getItem(MERGE_DONE_KEY);
          if (alreadyMerged === "true") return;

          // Call backend API with Google user info to generate a JWT access token
          const res = await axiosClient.post("/api/auth/google", {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
          });

          // Save the received JWT access token into localStorage
          // (so it can be used automatically in axios requests)
          setItem(KEY_ACCESS_TOKEN, res.data.result.accessToken);

          dispatch(mergeGuestCart());
          dispatch(mergeGuestWishlist());

          localStorage.setItem(MERGE_DONE_KEY, "true");
        }
      } catch (e) {
        // Log error if token generation fails
        console.log("error generating token: ", e);
      }
    };
    // Call the function whenever authentication status or session changes
    getToken();
  }, [status, session]);

  // Doesn't render anything
  return null;
}

export default Providers;
