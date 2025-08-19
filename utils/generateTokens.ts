import jwt from "jsonwebtoken";

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

export function generateRefreshToken(data: any) {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY!, {
      expiresIn: "1m",
    });
    return token;
  } catch (e) {
    return "something went wrong while generating refresh token";
  }
}
