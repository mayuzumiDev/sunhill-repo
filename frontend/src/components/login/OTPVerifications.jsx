import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstanceNoAuthHeader } from "../../utils/axiosInstance";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import sunhilllogo from "../../assets/img/home/sunhill.jpg"; // Import logo image

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate();

  useEffect(() => {
    const storedCode = sessionStorage.getItem("reset_code");
    if (storedCode) {
      setCode(storedCode);
    }

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
        setError("Invalid OTP verification code");
      } else {
        console.log("An error occured: ", error);
        setError("An error occured. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");

    console.log("Initial Code: ", code);

    try {
      const response = await axiosInstanceNoAuthHeader.post("api/otp-resend/", {
        email: email,
        reset_code: code,
      });

      const reset_code = response.data.verification_code;
      sessionStorage.setItem("reset_code", reset_code);
      setCode(reset_code);

      console.log("Resend Code: ", code);

      if (response.status === 200) {
        console.log("OTP resent successfully");
        setShowSuccessDialog(true);
      }
    } catch (error) {
      if (error.response) {
        console.log("error: ", error.response.data);
        setError("We couldn't resend the code. Please try again later.");
      } else {
        console.log("An error occured: ", error);
        setError("An error occured. Please try again.");
      }
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
        {error && <p className="text-red-600 mb-4">{error}</p>}
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
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:underline"
          >
            Resend
          </button>
        </div>
      </div>
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="flex w-96 shadow-lg rounded-lg">
            <div className="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-white fill-current"
                viewBox="0 0 16 16"
                width="20"
                height="20"
              >
                <path
                  fillRule="evenodd"
                  d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                ></path>
              </svg>
            </div>
            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
              <div>OTP code resent successfully!</div>
              <button onClick={() => setShowSuccessDialog(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current text-gray-700"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
