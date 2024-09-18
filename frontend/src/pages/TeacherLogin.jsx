import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/login/Navbar";
import sunhillLogo from "../assets/img/home/sunhill.jpg"; // Path to Sunhill logo

function TeacherLogin() {
  return (
    <div>
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
        {/* Background design */}
        <div className="absolute inset-0">
          <img
            src="https://www.transparenttextures.com/patterns/education.png" // Example background image
            alt="Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8 z-10 mt-16 mx-4 sm:mx-8">
          <div className="flex justify-center mb-6">
            <img
              src={sunhillLogo}
              alt="Sunhill Logo"
              className="w-16 h-16 rounded-full object-cover shadow-lg border border-gray-300"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-center text-blue-800 mb-4">
            Welcome, Educators!
          </h2>
          <p className="text-sm sm:text-base text-center text-gray-700 mb-8">
            Log in to access your teaching tools and resources.
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out"
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
