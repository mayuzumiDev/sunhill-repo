import axios from "axios";

// Create a new instance of axios with a base URL
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/", // Set the base URL for all requests
  withCredentials: true,
});

const axiosInstanceNoAuthHeader = axios.create({
  baseURL: "http://127.0.0.1:8000/", // Set the base URL for all request without authorization header
});

axiosInstance.interceptors.request.use(
  // This function will be called before each request is sent
  async (config) => {
    const token = localStorage.getItem("access_token"); // Get the access token from local storage

    // If a token is found, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ` + token;
    }

    return config; // Return the updated config object
  },
  // This function will be called if there's an error in the request
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
