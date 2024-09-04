import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../styles/AdminLogin.css";

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    console.log("Calling login with:", username, password);
    try {
      const csrfToken = getCookie("csrftoken");
      console.log("CSRF token:", csrfToken);

      const response = await axiosInstance.post(
        "/api/admin/login/",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          timeout: 10000,
        }
      );

      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);

      if (response.data.success) {
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
