import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa"; 
import sunhilllogo from "../../assets/img/home/sunhill.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSendCode = () => {
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Clear any previous errors
    setError("");

    // Show the loader when the button is clicked
    setIsLoading(true);

    // Simulate sending the code (e.g., make an API request)
    setTimeout(() => {
      console.log("Code sent to:", email);

      // Hide the loader after the code is sent
      setIsLoading(false);

      // Navigate to OTP Verification after sending the code
      navigate("/otp-verification");
    }, 2000); // Simulate a delay (2 seconds)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if inside a form
      handleSendCode();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full max-w-md relative mx-4 sm:mx-6 lg:mx-8">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={sunhilllogo}
            alt="Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg border border-gray-300"
          />
        </div>
        <div className="mt-16 text-center sm: mt-7">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Sunhill LMS
          </h2>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 mt-12">
          Forgot Password?
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Don't worry! It happens. Please enter the email address linked with your account.
        </p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4 text-sm sm:text-base"
          onKeyDown={handleKeyDown} // Add onKeyDown event handler
        />
        <button
          onClick={handleSendCode}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" aria-label="Loading" /> // Show spinner while loading
          ) : (
            "Send Code"
          )}
        </button>
        <div className="text-sm sm:text-base text-center text-gray-600 mt-4">
          <span>Remember Password? </span>
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
