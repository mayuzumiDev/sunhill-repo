import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstanceNoAuthHeader from "../../utils/axiosInstance";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import sunhilllogo from "../../assets/img/home/sunhill.jpg"; // Import logo image

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("reset_code", code);

    const storedEmail = sessionStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [code]);

  const handleChange = (value, index) => {
    const otpArray = [...otp];
    otpArray[index] = value;
    setOtp(otpArray);

    // Move focus to the next input field when a digit is entered
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if inside a form
      handleVerify();
    }

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    const otpCode = otp.join("");
    setCode(otpCode);

    // Validate OTP
    if (otpCode.length < 4) {
      setError("Please enter all 4 digits.");
      return;
    }

    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Session_Email: ", email);

    try {
      const response = await axiosInstanceNoAuthHeader.post(
        "api/password-reset-verify/",
        {
          email: email,
          verification_code: otpCode,
        }
      );

      if (response.status === 200) {
        setTimeout(() => {
          navigate("/create-new-password");
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        console.log("error: ", error.response.data);
        setError(error.response.data.error);
      } else {
        console.log("An error occured: ", error);
        setError("An error occured. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
        <div className="text-center mt-16 sm:">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Sunhill LMS
          </h2>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 mt-12">
          OTP Verification
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Enter the 4 digit code sent to your email address.
        </p>
        {error && <p className="text-red-600 mb-4">{error}</p>}{" "}
        {/* Error message */}
        <div className="flex justify-between mb-4 space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)} // Add onKeyDown event handler
              maxLength={1}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 text-lg sm:text-xl"
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" /> // Show spinner while loading
          ) : (
            "Verify"
          )}
        </button>
        <div className="text-sm sm:text-base text-gray-600 mt-4 text-center">
          <span>Didn't receive the code? </span>
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Resend
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
