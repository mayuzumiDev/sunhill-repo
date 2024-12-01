import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFontAwesome, FaSpinner } from "react-icons/fa";
// import sunhilllogo from "../../assets/img/home/sunhill.jpg";
import { axiosInstanceNoAuthHeader } from "../../utils/axiosInstance";
import checkLoginPageUserRole from "../../utils/LoginPageUserRole";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBackToLogin = () => {
    const urlPath = checkLoginPageUserRole(
      sessionStorage.getItem("loginPageName")
    );
    navigate(urlPath, { replace: true });
  };

  useEffect(() => {
    sessionStorage.setItem("email", email);
    sessionStorage.removeItem("reset_code");
  }, [email]);

  // Handle the password reset code sending and navigation to OTP verification page
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setIsLoading(false);
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Send a POST request to the password-reset-request API endpoint
      const response = await axiosInstanceNoAuthHeader.post(
        "api/password-reset-request/",
        {
          email: email,
        }
      );

      const resetCode = response.data.verification_code;
      sessionStorage.setItem("reset_code", resetCode);

      if (response.status === 200) {
        // If the request is successful, navigate to the OTP verification page
        setTimeout(() => {
          navigate("/otp-verification");
        }, 1000);
      }
    } catch (error) {
      // Handle any errors that occur during the request
      if (error.response) {
        console.log("error:", error.response.data);
        setError(error.response.data.error);
      } else {
        console.log("An error occurred:", error);
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
          {/* <img
            src={sunhilllogo}
            alt="Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg border border-gray-300"
          /> */}
        </div>
        <div className="mt-16 text-center sm:">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Sunhill LMS
          </h2>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 mt-12">
          Forgot Password?
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Don't worry! It happens. Please enter the email address linked with
          your account.
        </p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSendCode}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4 text-sm sm:text-base"
            onKeyDown={handleKeyDown} // Add onKeyDown event handler
          />
          <button
            // onClick={handleSendCode}
            type="submit"
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
            <button
              onClick={handleBackToLogin}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
