// This function validates the user's access token and role
const ValidateToken = async ({
  accessToken,
  tokenExpiration,
  userRole,
  currentUserRole,
}) => {
  // Inner function to check if the access token is valid
  const isAccessTokenValid = async () => {
    try {
      // Check if the user's role matches the current user role
      if (userRole !== currentUserRole) {
        console.error("You are not authorized to access this page.");
        return false;
      }

      // Check if the access token exists
      if (!accessToken) {
        console.error("Access token not found: ", accessToken);
        return false;
      }

      // Check if the token has expired
      const isExpired = tokenExpiration < Date.now() / 1000;

      if (isExpired) {
        console.error("Access token has expired.");
        return false;
      }

      // If all checks pass, the user is authenticated
      return true;
    
    } catch (error) {
      console.error("An error occurred while validating the token:", error);
      return false;
    }
  };

  return await isAccessTokenValid();
};

export default ValidateToken;
