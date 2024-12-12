import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import SecureLS from "secure-ls";
import { ENCRYPTION_KEY } from "../constants";

// Custom hook to handle login functionality
const useLogin = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const secureStorage = new SecureLS({
    encodingType: "aes",
    encryptionSecret: ENCRYPTION_KEY,
  });

  const handleLogin = async ({ username, password, loginPageName }) => {
    // Create axios instance with base URL and credentials
    const axiosInstanceLogin = axios.create({
      baseURL: "https://sunhilllms.online/",
      // baseURL: "http://127.0.0.1:8000/",
      withCredentials: true,
    });

    try {
      // Make POST request to login API
      const response = await axiosInstanceLogin.post("/api/account-login/", {
        username: username,
        password: password,
        login_page: loginPageName,
      });

      // Extract tokens and role from response data
      const { refresh_token, access_token, role } = response.data;
      const decodedAccessToken = jwtDecode(access_token);
      const decodedRefreshToken = jwtDecode(refresh_token);

      secureStorage.set("user_role", role);
      secureStorage.set("access_token", access_token);
      secureStorage.set("refresh_token", refresh_token);
      secureStorage.set("accessToken_expiration", decodedAccessToken.exp);
      secureStorage.set("refreshToken_expiration", decodedRefreshToken.exp);

      // Navigate to interface page based on role
      if (response.status === 200) {
        navigate(`/${role}/interface/`, { replace: true });
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        setErrorMessage(error.response.data.error);
        setShowAlert(true);
      } else {
        console.error("An error occured: ", error);
        setErrorMessage("An error occured. Please try again.");
      }
    }
  };

  return { handleLogin, errorMessage, showAlert };
};

export default useLogin;
