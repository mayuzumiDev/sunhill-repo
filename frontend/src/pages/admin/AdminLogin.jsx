import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { BsPersonCircle } from "react-icons/bs";

function AdminLogin() { 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("LoginPageUserRole");
    sessionStorage.setItem("LoginPageUserRole", "admin");
  });

  const login = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(""); // Clear any previous error messages
    setLoading(true); // Set loading to true when login is initiated

    const axiosInstanceLogin = axios.create({
      baseURL: "http://127.0.0.1:8000/", // Set the base URL for all requests
      withCredentials: true,
    });

    try {
      // Make a POST request to the /api/admin-login/ endpoint
      const response = await axiosInstanceLogin.post("/api/admin-login/", {
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
    } finally {
      setLoading(false); // Reset loading state after the login process
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="w-full fixed top-0 left-0 shadow-md">
        <nav className="bg-white border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="text-gray-800 font-semibold text-md sm:text-lg hover:text-blue-500 transition duration-300 ease-in-out ml-4"
            >
              <span className="letter1">S</span>
              <span className="letter2">u</span>
              <span className="letter3">n</span>
              <span className="letter4">h</span>
              <span className="letter5">i</span>
              <span className="letter6">l</span>
              <span className="letter7">l</span>
            </Link>
            <span className="sm:inline text-md sm:text-lg font-semibold text-gray-800">
              Montessori Casa
            </span>
            <span className="sm:inline text-xs sm:text-sm text-blue-800 mb-2">
              LMS
            </span>
          </div>
        </nav>
      </div>

      {/* Admin Login Form */}
      <div className="mb-4 mt-20">
        <h1 className="text-gray-700 text-4xl font-bold font-montserrat text-center">
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
        className="max-w-md mx-auto px-10 py-12 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-semibold font-montserrat mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="appearance-none border border-gray-300 rounded-lg w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-semibold font-montserrat mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="appearance-none border border-gray-300 rounded-lg w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-2 mb-4 text-sm text-gray-600 font-montserrat">
          <Link
            to="/forgot-password"
            className="text-sky-500 hover:text-sky-700 focus:text-sky-700 active:text-sky-700"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          className={`bg-sky-500 hover:bg-sky-700 text-white text-base font-bold font-montserrat w-full h-12 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-sky-400 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={loading} // Disable the button while loading
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8H4z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
