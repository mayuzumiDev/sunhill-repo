import React, { useState } from "react";
import { FaBars, FaMoon, FaSun, FaUser, FaChevronDown } from "react-icons/fa";
import Parent from '../../assets/img/home/mom.jpg'

const TopNavbar = ({
  setCurrentTab,
  setShowLogoutDialog,
  toggleSidebar,
  darkMode,
  toggleDarkMode,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
      <div className="w-full px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* Left side: Sidebar toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500`}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Right side: Dark mode toggle and profile */}
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-1 rounded-full ${
                darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-orange-400 hover:text-orange-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-4`}
            >
              {darkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
            </button>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={Parent}
                  alt="Profile"
                />
                <div className="ml-2 flex flex-col items-start">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Maricel Fruelda</span>
                  <span className="text-xs text-orange-500">Parent</span>
                </div>
                <FaChevronDown className={`ml-3 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </button>
              {dropdownOpen && (
                <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                } ring-1 ring-black ring-opacity-5`}>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setCurrentTab("Settings");
                      setDropdownOpen(false);
                    }}
                  >
                    Settings
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setShowLogoutDialog(true);
                      setDropdownOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
