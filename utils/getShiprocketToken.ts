import axios from "axios";

let shiprocketToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * @function getShiprocketToken
 * @description Fetches and caches Shiprocket API authentication token.
 *              - If a valid token exists in memory, it reuses it.
 *              - Otherwise, fetches a new token via API.
 * @returns - Shiprocket API token
 */
export async function getShiprocketToken() {
  // Check if we already have a valid token in memory
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  // Request new token from Shiprocket API
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  // Save token and set expiry (10 days)
  shiprocketToken = response.data.token;
  tokenExpiry = Date.now() + 10 * 24 * 60 * 60 * 1000;

  // Return fresh token
  return shiprocketToken;
}
