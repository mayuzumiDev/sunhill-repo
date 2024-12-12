import axios from "axios";
import SecureLS from "secure-ls";
import { ENCRYPTION_KEY } from "../constants";

// comment
``;
const secureStorage = new SecureLS({
  encodingType: "aes",
  encryptionSecret: ENCRYPTION_KEY,
});

// Create a new instance of axios with a base URL
const axiosInstance = axios.create({
  baseURL: "https://sunhilllms.online/", // Set the base URL for all requests
  // baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
});

const axiosInstanceNoAuthHeader = axios.create({
  baseURL: "https://sunhilllms.online/", // Set the base URL for all request without authorization header
  // baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = secureStorage.get("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ` + token;
    }
    // console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, {
    //   headers: config.headers,
    //   data: config.data
    // });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, {
    //   status: response.status,
    //   data: response.data
    // });
    return response;
  },
  async (error) => {
    console.error("Response Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message,
    });

    const originalRequest = error.config;

    // If the error response is 401 (Unauthorized) and it's not a retry request
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark the request as retried

      // Try refreshing the token
      try {
        const refreshToken = secureStorage.get("refresh_token"); // Use SecureLS to get the refresh token

        // Make request to refresh the token (adjust endpoint as necessary)
        const response = await axiosInstanceNoAuthHeader.post(
          "/api/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        // If successful, update access token and retry original request
        const newAccessToken = response.data.access; // Adjust depending on your backend response structure
        secureStorage.set("access_token", newAccessToken); // Store the new access token in SecureLS

        // Retry the original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, reject the promise
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const setAuthorizationHeader = (token) => {
  if (token) {
    // Ensure the token doesn't already have 'Bearer ' prefix
    const bearerToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    axiosInstance.defaults.headers.common["Authorization"] = bearerToken;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export { axiosInstance, axiosInstanceNoAuthHeader, setAuthorizationHeader };
export default {
  axiosInstance,
  axiosInstanceNoAuthHeader,
  setAuthorizationHeader,
};
