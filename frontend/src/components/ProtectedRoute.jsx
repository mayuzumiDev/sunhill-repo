import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SecureLS from "secure-ls";
import ValidateToken from "../utils/validateUserCredentials";
import { refreshAccessToken } from "../utils/refreshAccessToken";
import LoadingSpinner from "./LoadingSpinner";
import generateEncryptionKey from "../utils/EncryptionKeyGenerator";

// This component protects routes that require user authentication
const ProtectedRoute = ({ children, userRole }) => {
  const navigate = useNavigate();
  const secureStorage = new SecureLS({
    encodingType: "aes",
    encryptionSecret: generateEncryptionKey(256),
  });

  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Check authentication status when the component mounts
  useEffect(() => {
    const checkAuthentication = async () => {
      const accessToken = secureStorage.get("access_token");
      const currentUserRole = secureStorage.get("user_role");
      const tokenExpiration = secureStorage.get("token_expiration");

      // If authentication data exists
      if (accessToken && currentUserRole && tokenExpiration) {
        const isValid = await ValidateToken({
          accessToken,
          tokenExpiration,
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
              const refreshToken = secureStorage.get("refresh_token");
              const newAccessToken = await refreshAccessToken({ refreshToken });
              secureStorage.set("access_token", newAccessToken.accessToken);
              secureStorage.set(
                "token_expiration",
                newAccessToken.tokenExpiration
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
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {console.log("User can access the protected route.")}
      {children}
    </>
  );
};

export default ProtectedRoute;
