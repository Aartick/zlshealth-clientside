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

import { axiosClient } from "@/utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "@/utils/localStorageManager";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function Providers() {
  // Get session data and authentication status from NextAuth
  const { data: session, status } = useSession();

  useEffect(() => {
    // Function to fetch JWT token from backend when user is authenticated
    const getToken = async () => {
      try {
        // Only run when user is authenticated and session contains user info
        if (status === "authenticated" && session.user) {
          // Call backend API with Google user info to generate a JWT access token
          const res = await axiosClient.post("/api/auth/google", {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
          });

          // Save the received JWT access token into localStorage
          // (so it can be used automatically in axios requests)
          setItem(KEY_ACCESS_TOKEN, res.data.result.accessToken);
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
