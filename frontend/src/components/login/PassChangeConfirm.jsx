import React from "react";
import { Link } from "react-router-dom";
import checkmarkImage from "../../assets/img/home/check.png"; // Adjust the path as needed

const PasswordChanged = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-md text-center">
        <img
          src={checkmarkImage}
          alt="Checkmark"
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6"
        />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Password Changed!
        </h2>
        <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8">
          Your password has been successfully changed.
        </p>
        <Link
          to="/login"
          className="inline-block py-2 px-4 sm:py-3 sm:px-6 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-300"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default PasswordChanged;
