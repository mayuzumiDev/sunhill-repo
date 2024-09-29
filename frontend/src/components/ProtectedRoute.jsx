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
    let timeoutId;

    const checkTokenValidity = async () => {
      console.log(
        "Checking token validity at:",
        new Date().toLocaleTimeString()
      );

      const isValid = isTokenValid();
      if (!isValid) {
        console.log("Token is not valid. Refreshing...");
        await refreshTokenIfNeeded();
      } else {
        // Refresh token 10 minute before expiration
        const refreshBeforeExpiration = 5 * 60; // 10 minute in seconds
        const currentTime = new Date().getTime() / 1000;
        const expirationTime = parseInt(tokenExpiration, 10);
        const timeToRefresh = expirationTime - refreshBeforeExpiration;

        if (currentTime >= timeToRefresh) {
          console.log("Token is about to expire. Refreshing...");
          await refreshTokenIfNeeded();
        } else {
          console.log("Token is still valid.");
        }
      }

      // Set authentication status based on token validity and user role
      setIsAuthenticated(isTokenValid() && userRole === "admin");
    };

    const handleUserActivity = () => {
      clearTimeout(timeoutId);
      checkTokenValidity();
      timeoutId = setTimeout(checkTokenValidity, 5 * 60 * 1000); // Check again after 5 minutes
    };

    // Call checkTokenValidity on component mount
    checkTokenValidity();

    // Attach event listeners to detect user activity
    const events = ["mousemove", "keydown", "scroll"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    // Cleanup on component unmount
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
      clearTimeout(timeoutId);
    };
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
