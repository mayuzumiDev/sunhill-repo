import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import sunhilllogo from "../../assets/img/home/sunhill.jpg";
import { axiosInstanceNoAuthHeader } from "../../utils/axiosInstance";

const CreateNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    const storedCode = sessionStorage.getItem("reset_code");
    if (storedCode) {
      setCode(storedCode);
    }
  }, []);

  // Handle reset password function
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Check if both fields are filled
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Both fields are required!");
    } else if (newPassword === confirmPassword) {
      try {
        setIsLoading(true);
        //  Send a POST request to the server to reset the password
        const response = await axiosInstanceNoAuthHeader.post(
          "api/password-reset-confirm/",
          {
            email: email,
            new_password: newPassword,
            reset_code: code,
          }
        );

        if (response.status === 200) {
          // if successful, navigate to password change successfully page
          setTimeout(() => {
            navigate("/password-changed");
          }, 1000);
        }
      } catch (error) {
        // Handle error response from API
        if (error.response) {
          console.log("error: ", error.response.data);
          setErrorMessage("Ensure the password has at least 8 characters");
        } else {
          console.log("An error occured: ", error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Passwords do not match!");
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleResetPassword();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full max-w-md relative">
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
          Create New Password
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Your new password must be unique from those previously used.
        </p>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4 text-sm sm:text-base"
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4 text-sm sm:text-base"
          onKeyDown={handleKeyDown}
        />
        {errorMessage && (
          <p className="text-red-500 text-sm sm:text-base mb-4">
            {errorMessage}
          </p>
        )}
        <button
          onClick={handleResetPassword}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" aria-label="Loading" />
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateNewPassword;
