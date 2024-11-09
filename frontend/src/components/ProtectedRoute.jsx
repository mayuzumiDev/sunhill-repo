import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SecureLS from "secure-ls";
import ValidateToken from "../utils/validateUserCredentials";
import { tokenRefresh } from "../utils/tokenRefresh";
import LoadingSpinner from "./LoadingSpinner";
import { ENCRYPTION_KEY } from "../constants";

// This component protects routes that require user authentication
const ProtectedRoute = ({ children, userRole }) => {
  const navigate = useNavigate();
  const secureStorage = new SecureLS({
    encodingType: "aes",
    encryptionSecret: ENCRYPTION_KEY,
  });

  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Check authentication status when the component mounts
  useEffect(() => {
    const checkAuthentication = async () => {
      const currentUserRole = secureStorage.get("user_role");
      const accessToken = secureStorage.get("access_token");
      const refreshToken = secureStorage.get("refresh_token");
      const accessTokenExpiration = secureStorage.get("accessToken_expiration");
      const refreshTokenExpiration = secureStorage.get(
        "refreshToken_expiration"
      );

      // If authentication data exists
      if (
        currentUserRole &&
        accessToken &&
        refreshToken &&
        accessTokenExpiration &&
        refreshTokenExpiration
      ) {
        const isValid = await ValidateToken({
          accessToken,
          accessTokenExpiration,
          refreshToken,
          refreshTokenExpiration,
          userRole,
          currentUserRole,
        });

        if (!isValid) {
          // If the user does not have the required role
          if (currentUserRole !== userRole) {
            setIsAuthenticated(false);
          } else {
            // Else, if the token is expired or invalid, attempt to refresh it
            try {
              console.log("Refreshing token. Please wait.");
              const newToken = await tokenRefresh({ refreshToken });
              secureStorage.set("access_token", newToken.accessToken);
              secureStorage.set(
                "accessToken_expiration",
                newToken.accessExpiration
              );
              secureStorage.set("refresh_token", newToken.refreshToken);
              secureStorage.set(
                "refreshToken_expiration",
                newToken.refreshExpiration
              );

              setIsAuthenticated(true);
            } catch (error) {
              console.error("Error occured: ", error);
              setIsAuthenticated(false);
            }
          }
        } else {
          // If the token is valid, user is authenticated
          setIsAuthenticated(isValid);
        }
      } else {
        console.error("Missing authentication data.");
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();

    // Set up a timer to check token expiration every 1 minute
    const timerId = setInterval(() => {
      checkAuthentication();
    }, 60000); // 60000 milliseconds = 1 minute

    // Clean up the timer when the component unmounts
    return () => clearInterval(timerId);
  }, []);
  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticated === null || isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
