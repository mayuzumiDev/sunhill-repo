import React from "react";
import { Link } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="w-full fixed top-0 left-0 shadow-lg z-50">
      <nav className="bg-white shadow-md px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="text-gray-800 font-semibold text-md sm:text-lg hover:text-blue-500 transition duration-300 ease-in-out ml-4"
          >
            <span className="letter1">S</span>
            <span className="letter2">u</span>
            <span className="letter3">n</span>
            <span className="letter4">h</span>
            <span className="letter5">i</span>
            <span className="letter6">l</span>
            <span className="letter7">l</span>
          </Link>
          <span className=" sm:inline text-md sm:text-lg font-semibold text-gray-800">
            Montessori Casa
          </span>
          <span className=" sm:inline text-xs sm:text-sm text-blue-800 mb-2">
            LMS
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="block text-gray-800 hover:text-blue-500 transition duration-300 ease-in-out focus:outline-none lg:hidden"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <Link
            to="/login"
            className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out border border-blue-500"
          >
            <BsPersonCircle className="text-xl" />
            <span className="text-sm font-medium">Select Role</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isOpen ? "block" : "hidden"} bg-white border-t border-gray-200`}>
        <Link
          to="/login"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out"
        >
          <div className="flex items-center space-x-2">
            <BsPersonCircle className="text-xl" />
            <span className="text-sm font-medium">Select Role</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
