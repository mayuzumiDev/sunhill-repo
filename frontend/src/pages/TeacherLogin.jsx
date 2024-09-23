import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/login/Navbar";
import sunhillLogo from "../assets/img/home/sunhill.jpg"; // Path to Sunhill logo

function TeacherLogin() {
  return (
    <div>
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-green-200 to-green-300">
        {/* Background design */}
        <div className="absolute inset-0">
          <img
            src="https://www.transparenttextures.com/patterns/cubes.png" // New background pattern
            alt="Background"
            className="w-full h-full object-cover opacity-100"
          />
        </div>

        {/* Diagonal dividers for modern effect */}
        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-green-600 to-yellow-400 transform -skew-y-6 z-10"></div>
        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-green-600 to-yellow-400 transform skew-y-6 z-10"></div>

      

        {/* Content container */}
        <div className="relative w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8 z-20 mt-16 mx-4 sm:mx-8">
          <div className="flex justify-center mb-6">
            <img
              src={sunhillLogo}
              alt="Sunhill Logo"
              className="w-16 h-16 rounded-full object-cover shadow-lg border border-gray-300"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-center text-green-800 mb-4">
            Welcome Teachers!
          </h2>
          <p className="text-sm sm:text-base text-center text-gray-700 mb-8">
            Please log in to access your dashboard and manage your classes.
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-800 transition duration-150 ease-in-out"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;
