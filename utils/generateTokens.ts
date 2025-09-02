import jwt from "jsonwebtoken";

/**
 * @function generateAccessToken
 * @description Generates a JWT access token with a 1-day expiry.
 * @param {any} data - Payload to be signed inside the token (e.g., user ID).
 * @returns {string} - JWT access token or error message if generation fails.
 */
export function generateAccessToken(data: any) {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
      expiresIn: "1d",
    });
    return token;
  } catch (e) {
    return "Something went wrong while generating access token.";
  }
}

/**
 * @function generateRefreshToken
 * @description Generates a JWT refresh token with a 7-day expiry.
 * @param {any} data - Payload to be signed inside the token (e.g., user ID).
 * @returns {string} - JWT refresh token or error message if generation fails.
 */
export function generateRefreshToken(data: any) {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY!, {
      expiresIn: "7d",
    });
    return token;
  } catch (e) {
    return "something went wrong while generating refresh token";
  }
}
