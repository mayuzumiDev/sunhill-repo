import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaBell, FaCaretDown, FaBars, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; 
import uriel from '../../assets/img/home/uriel.jpg';

const TopNavbar = ({ setShowLogoutDialog, userName,  currentTab,
  setCurrentTab, userRole, notifications = [], toggleSidebar, darkMode, toggleDarkMode }) => {
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleNotifDropdown = () => setIsNotifDropdownOpen(prev => !prev);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(prev => !prev);

  const handleOutsideClick = (e) => {
    if (isNotifDropdownOpen && notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
      setIsNotifDropdownOpen(false);
    }
    if (isProfileDropdownOpen && profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isNotifDropdownOpen, isProfileDropdownOpen]);

  // handleTabClick to use navigate for redirection
  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
        // navigate(`/settings`); // Redirect to settings page on tab click
      }
    },
    [setCurrentTab, currentTab, navigate] // Added navigate to dependencies
  );

  return (
    <div className={`shadow-lg p-4 flex justify-between items-center rounded-b-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Left Side: Sidebar Toggle and Greeting Message */}
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-green-700 focus:outline-none">
          <FaBars className="text-2xl" />
        </button>
      </div>

      {/* Right Side: Profile and Notification Section */}
      <div className="flex items-center space-x-4 relative">
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="text-green-700 focus:outline-none">
          {darkMode ? <FaSun className="text-2xl" /> : <FaMoon className="text-2xl" />}
        </button>

        {/* Notification Button (hidden on small screens) */}
        <div className="relative hidden sm:block">
          <button onClick={toggleNotifDropdown} className={`flex items-center ${darkMode ? 'text-white' : 'text-green-700'} focus:outline-none`}>
            <FaBell className="text-2xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.length}
            </span>
          </button>

          {/* Notification Dropdown */}
          {isNotifDropdownOpen && (
            <div ref={notifDropdownRef} className={`absolute right-0 top-12 rounded-md shadow-xl border border-gray-300 z-10 p-4 w-56 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h5 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h5>
              <ul className="mt-2">
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <li key={idx} className={`border-b border-gray-200 py-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.date}</p>
                    </li>
                  ))
                ) : (
                  <li className="py-2 text-gray-500 text-sm">No notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Profile Section with Dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-3 focus:outline-none" onClick={toggleProfileDropdown}>
            <img
              src={uriel}
              alt="Profile"
              className={`w-10 h-10 rounded-full border-2 ${darkMode ? 'border-gray-700' : 'border-green-500'}`}
            />
            <div className="hidden sm:flex flex-col items-start">
              <span className={`text-${darkMode ? 'white' : 'green-700'} font-semibold text-base`}>{userName}</span>
              <span className="text-gray-500 text-xs">{userRole}</span>
            </div>
            <FaCaretDown className={`text-gray-700 text-lg ${darkMode ? 'text-white' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div ref={profileDropdownRef} className={`absolute right-0 mt-2 w-48 bg-${darkMode ? 'gray-800' : 'white'} rounded-lg shadow-lg`}>
              <ul className="py-1">
                <li>
                  <button
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleTabClick("AccountSettings"); //navigate to accountsettings
                      setIsProfileDropdownOpen(false); // close the dropdown after navigating
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Account Settings
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
