import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useSecureLocalStorage } from "../utils/SecureLocalStorage";

const useLogin = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const secureStorage = useSecureLocalStorage();

  const handleLogin = async ({ username, password, loginPageName }) => {
    const axiosInstanceLogin = axios.create({
      baseURL: "http://127.0.0.1:8000/",
      withCredentials: true,
    });

    try {
      const response = await axiosInstanceLogin.post("/api/account-login/", {
        username: username,
        password: password,
        login_page: loginPageName,
      });

      const { refresh_token, access_token, role } = response.data;
      const decodedToken = jwtDecode(access_token);

      secureStorage.set("Refresh", refresh_token);
      secureStorage.set("Access", access_token);
      secureStorage.set("Role", role);
      secureStorage.set("Expire", decodedToken.exp);

      console.log("RefreshToken", secureStorage.get("Refresh"));
      console.log("AccessToken", secureStorage.get("Access"));
      console.log("Role", secureStorage.get("Role"));
      console.log("DecodedToken", secureStorage.get("Expire"));

      if (response.status === 200) {
        navigate(`/${role}/interface/`, { replace: true });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
        setShowAlert(true);
      } else {
        console.log("An error occured: ", error);
        setErrorMessage("An error occured. Please try again.");
      }
    }
  };

  return { handleLogin, errorMessage, showAlert };
};

export default useLogin;
