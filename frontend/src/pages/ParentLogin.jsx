import React, { useEffect } from "react";
import Navbar from "../components/login/Navbar";
import { Link } from "react-router-dom";
import sunhillLogo from "../assets/img/home/sunhill.jpg"; // Path to Sunhill logo

function ParentLogin() {
  useEffect(() => {
    sessionStorage.removeItem("LoginPageUserRole");
    sessionStorage.setItem("LoginPageUserRole", "parent");
  });

  return (
    <div>
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300">
        {/* Background design */}
        <div className="absolute inset-0">
          <img
            src="https://www.transparenttextures.com/patterns/paper-fibers.png"
            alt="Background"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-transparent opacity-50 z-0"></div>

        {/* Diagonal dividers for modern effect */}
        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-orange-600 to-yellow-400 transform -skew-y-6 "></div>
        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-orange-600 to-yellow-400 transform skew-y-6 z-10"></div>

        {/* Subtle animated floating shapes */}
        <div className="absolute w-32 h-32 bg-orange-400 rounded-full opacity-40 top-90 right-10 animate-bounce"></div>
        <div className="absolute w-20 h-20 bg-red-400 rounded-full opacity-30 bottom-10 left-10 animate-bounce"></div>

        <div className="relative w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8 z-10 mt-16 mx-4 sm:mx-8">
          <div className="flex justify-center mb-6">
            <img
              src={sunhillLogo}
              alt="Sunhill Logo"
              className="w-16 h-16 rounded-full object-cover shadow-lg border border-gray-300"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-center text-orange-800 mb-4">
            Welcome Parents!
          </h2>
          <p className="text-sm sm:text-base text-center text-gray-700 mb-8">
            Thank you for your ongoing support. Log in to stay informed and
            involved.
          </p>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-orange-600 hover:text-orange-800 transition duration-150 ease-in-out"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ParentLogin;
