import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import axiosInstance from "../utils/axiosInstance";
import { generateCsrfToken, getCookie, setCsrfToken } from "../utils/csrfUtils";
import "../styles/AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const csrfToken = generateCsrfToken();
  setCsrfToken(csrfToken);

  const login = async (e) => {
    e.preventDefault();
    console.log("Calling login with:", username, password);
    try {
      const token = getCookie("csrftoken");
      console.log("CSRF token:", csrfToken);

      const response = await axiosInstance.post(
        "/api/admin/login/",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json, charset=UTF-8",
            "X-CSRFToken": token,
          },
          timeout: 10000,
        }
      );

      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);

      if (response.data.success) {
        setIsLoggedIn(true);
        console.log("Login successful");
        navigate("/admin/interface/", { replace: true });
      } else {
        console.log("Login failed");
        setError("Please check if your username and password are correct.");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={login} className="login-form">
        <h2>Admin Login</h2>
        <div className="input-container">
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="button" className="forgot-pwd-bttn">
          Forgot Password?
        </button>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-bttn">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
