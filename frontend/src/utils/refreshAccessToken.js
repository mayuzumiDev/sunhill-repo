import { axiosInstance } from "./axiosInstance";
import { jwtDecode } from "jwt-decode";

export const refreshAccessToken = async ({ refreshToken }) => {
  try {
    console.log("Refresh token: ", refreshToken);
    console.log("Request payload: ", { refresh: refreshToken });

    // Send a POST request to the API to refresh the access token
    const response = await axiosInstance.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    // Extract the new access token, refresh token, and token expiration from the response
    const newAccessToken = response.data.access;
    const newRefreshToken = response.data.refresh;
    const decodedToken = jwtDecode(newAccessToken);
    const tokenExpiration = decodedToken.exp;

    console.log("New access token: ", newAccessToken);
    console.log("New refresh token: ", newRefreshToken);
    console.log("New expiration time: ", tokenExpiration);

    // Return the new tokens and expiration time
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenExpiration: tokenExpiration,
    };
  } catch (error) {
    console.error("Error refreshing  token:", error);
    return { success: false, error: error.message };
  }
};
