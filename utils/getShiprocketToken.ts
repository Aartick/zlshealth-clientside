import axios from "axios";

let shiprocketToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getShiprocketToken() {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  shiprocketToken = response.data.token;
  tokenExpiry = Date.now() + 10 * 24 * 60 * 60 * 1000;

  return shiprocketToken;
}
