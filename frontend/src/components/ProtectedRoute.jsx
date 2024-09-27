import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  // Get user role and tokens from local storage
  const userRole = localStorage.getItem("user_role");
  const refreshToken = localStorage.getItem("refresh_token");
  let token = localStorage.getItem("access_token");
  let tokenExpiration = localStorage.getItem("token_expiration");

  // State variables to track token refreshing and authentication status
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Effect to check token validity and refresh token if needed
  useEffect(() => {
    const checkTokenValidity = async () => {
      // Check if token is valid, and refresh it if not
      const isValid = isTokenValid();
      if (!isValid) {
        await refreshTokenIfNeeded();
      }

      // Set authentication status based on token validity and user role
      setIsAuthenticated(isTokenValid() && userRole === "admin");
    };

    checkTokenValidity();
  }, [userRole, token, tokenExpiration]);

  // Function to check if token is valid
  const isTokenValid = () => {
    if (!token) return false;

    // Get current time and expiration time
    const currentTime = new Date().getTime() / 1000;
    const expirationTime = parseInt(tokenExpiration, 10);

    // Return true if token is not expired
    return currentTime <= expirationTime;
  };

  // Function to refresh token if needed
  const refreshTokenIfNeeded = async () => {
    if (isTokenRefreshing || !refreshToken) return;

    // Set token refreshing state to true
    setIsTokenRefreshing(true);

    try {
      // Make API call to refresh token
      const response = await axiosInstance.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      // Get new token and expiration time from response
      const newToken = response.data.access;
      const decodedToken = jwtDecode(newToken);
      const newExpirationTime = decodedToken.exp;

      // Update local storage with new token and expiration time
      localStorage.setItem("access_token", newToken);
      localStorage.setItem("token_expiration", newExpirationTime);

      // Update state variables with new token and expiration time
      token = newToken;
      tokenExpiration = newExpirationTime;

      console.log("Access token refreshed successfully");
      console.log(
        "New expiration:",
        new Date(newExpirationTime * 1000).toLocaleString()
      );
    } catch (error) {
      console.error("Error refreshing token:", error);
    } finally {
      setIsTokenRefreshing(false); // Set token refreshing state to false
    }
  };

  // If authentication status is still null, show loading message
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render admin protected route content
  return <Outlet />;
};

export default ProtectedRoute;
