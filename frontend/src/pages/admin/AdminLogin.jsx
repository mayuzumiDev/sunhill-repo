import React, { useState, useContext } from "react";
import { replace, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    setError(""); // Clear any previous error messages

    try {
      // Make a POST request to the /api/admin-login/ endpoint
      const response = await axiosInstance.post("/api/admin-login/", {
        username,
        password,
      });

      // Extract the access token from the response
      const access_token = response.data.access_token;

      // Decode the access token to get the expiration time
      const decodedToken = jwtDecode(access_token);
      const expirationTime = decodedToken.exp;

      // Store the tokens and user role in local storage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user_role", response.data.role);
      localStorage.setItem("token_expiration", expirationTime);

      // If the response status is 200, navigate to the admin dashboard
      if (response.status === 200) {
        navigate("/admin/", { replace: true });
      }

      console.log(response.data);
    } catch (error) {
      // Handle errors from the API response
      if (error.response) {
        console.log(error.response.data);
        setError(error.response.data.error || "Login failed");
      } else {
        // Handle other types of errors
        console.log("An error occurred:", error);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Top Navbar */}
      <div className="w-full fixed top-0 left-0 shadow">
        <nav className="bg-white px-4 py-3 flex justify-between ">
          <span className="text-sky-500 text-xl font-semibold font-montserrat">
            Sunhill LMS
          </span>
        </nav>
      </div>

      {/* Admin Login Form */}
      <div className="mb-4">
        <h1 className="text-gray-700 text-3xl font-bold font-montserrat text-center">
          Admin Login
        </h1>
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline text-sm font-montserrat">
            {error}
          </span>
        </div>
      )}
      <form
        onSubmit={login}
        className="max-w-md mx-auto px-10 py-12 bg-white rounded-xl shadow-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold font-montserrat mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="appearance-none border rounded w-full h-9 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-2 focus:border-sky-500"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold font-montserrat mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="appearance-none border rounded w-full h-9 py-2 px-3 text-gray-700 leading-tight focus:outline:none focus:shadow-outline focus:border-2 focus:border-sky-500"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-4 mb-4 text-sm text-gray-600 font-montserrat">
          <a
            href="/forgot-password"
            className="text-sky-500 hover:text-sky-700 focus:text-sky-700 active:text-sky-700"
          >
            Forgot Password?
          </a>
        </div>
        <button
          className="bg-sky-500 hover:bg-sky-700 text-white text-base font-bold font-montserrat w-full py-1 px-4 rounded-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
