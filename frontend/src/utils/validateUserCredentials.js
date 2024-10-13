// This function validates the user's access token and role
const ValidateToken = async ({
  accessToken,
  accessTokenExpiration,
  refreshToken,
  refreshTokenExpiration,
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
      const isAccessTokenExpired = accessTokenExpiration < Date.now() / 1000;
      const isNearExpiration =
        Date.now() / 1000 > accessTokenExpiration - 3 * 60;

      if (isNearExpiration) {
        console.error(
          "Your access token is near expiration. Please refresh it."
        );
        return false;
      }

      if (isAccessTokenExpired) {
        console.error("Access token has expired.");

        if (!refreshToken) {
          console.error("Refresh token not found: ", refreshToken);
          return false;
        }

        const isRefreshTokenExpired =
          refreshTokenExpiration < Date.now() / 1000;
        if (isRefreshTokenExpired) {
          console.error("Refresh token has expired. Please re-authenticate.");
          return false;
        }
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
