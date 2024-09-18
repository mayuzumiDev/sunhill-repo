import React, { useState } from "react";
import Navbar from "../components/login/Navbar";
import { QRCodeSVG } from "qrcode.react";
import QRCodeScanner from "../pages/admin/qrcode/qrscan"; // QR Scanner component
import useSound from "use-sound";
import clickSound from "../assets/img/home/bubble.wav"; // Sound file
import SUNHILL from "../assets/img/home/sunhill.jpg"; // Logo image
import "../styles/Studentlogin.css"; // Custom styles

function StudentLogin() {
  const [play] = useSound(clickSound); // Play sound on hover
  const [isScannerVisible, setScannerVisible] = useState(false); // QR Scanner state

  // Toggle QR code scanner visibility
  const toggleScanner = () => {
    setScannerVisible(!isScannerVisible);
  };

  return (
    <div className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow px-4 py-6 md:py-8">
        {/* New Unified Login Box */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center space-y-4">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 text-center">
             Welcome, Sunhillians!
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-purple-600 text-center">
            Log in to begin today's adventure!
          </p>

          {/* Login Form */}
          <form className="w-full space-y-4">
            <div className="flex flex-col">
              <label className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">Username</label>
              <input
                type="text"
                className="p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter your username"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">Password</label>
              <input
                type="password"
                className="p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base md:text-lg font-semibold py-2 sm:py-3 rounded-full shadow-md transition-transform transform hover:scale-105"
              onMouseEnter={play} // Play sound on hover
            >
              Log In
            </button>

            {/* Forgot Password Link */}
            <div className="text-left">
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>

          {/* Or separator */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm sm:text-base md:text-lg">OR</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          {/* "Sign in with QR Code" Button */}
          <button
            className="bg-green-400 hover:bg-green-500 text-sm sm:text-base md:text-lg font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-md transition-transform transform hover:scale-105"
            onMouseEnter={play} // Play sound when hovered
            onClick={toggleScanner} // Toggle QR scanner visibility on click
          >
            Sign in with QR Code
          </button>

          {/* QR Code with Sunhill Logo in the Center */}
          <div className="relative flex items-center justify-center mt-4 sm:mt-6">
            <QRCodeSVG
              value="https://example.com/qr-login"
              size={100} // Smaller size for responsiveness
              bgColor="#FFFFFF"
              fgColor="#4A90E2"
              className="shadow-lg rounded-lg"
            />
            {/* Overlayed Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={SUNHILL}
                alt="Sunhill Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-4 border-white"
              />
            </div>
          </div>
        </div>

        {isScannerVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-300 ease-in-out">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[70%] bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-4">
              {/* Popup Heading */}
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-purple-700">Scan Your QR Code</h2>
              <p className="text-gray-600 text-center text-xs sm:text-sm md:text-base">Use your QR code to sign in securely.</p>

              {/* QR Code Scanner Component */}
              <QRCodeScanner />

              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-red-500 text-xl sm:text-2xl md:text-3xl bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                onClick={toggleScanner} // Close the popup
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentLogin;
