import { axiosInstance } from "./axiosInstance";
import { jwtDecode } from "jwt-decode";

export const tokenRefresh = async ({ refreshToken }) => {
  try {
    // Send a POST request to the API to refresh the access token
    const response = await axiosInstance.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    // Extract the new access token, refresh token, and token expiration from the response
    const newAccessToken = response.data.access;
    const decodedAccessToken = jwtDecode(newAccessToken);
    const accessTokenExpiration = decodedAccessToken.exp;

    const newRefreshToken = response.data.refresh;
    const decodedRefreshToken = jwtDecode(newRefreshToken);
    const refreshTokenExpiration = decodedRefreshToken.exp;

    // Return the new tokens and expiration time
    return {
      accessToken: newAccessToken,
      accessExpiration: accessTokenExpiration,
      refreshToken: newRefreshToken,
      refreshExpiration: refreshTokenExpiration,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
    } else {
      console.error("Error message:", error.message);
    }
    return { success: false, error: error.message || "Unknown error" };
  }
};
