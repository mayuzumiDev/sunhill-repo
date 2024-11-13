import React, { useCallback, useState, useEffect } from "react";
import { FaCaretDown, FaBars, FaBell } from "react-icons/fa";
import Button from "../LogoutButton";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Image from "../../assets/img/home/uriel.jpg";

const TopNavbar = ({
  setShowLogoutDialog,
  currentTab,
  setCurrentTab,
  toggleSidebar,
  notifications = [],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const [notificationCount, setNotificationCount] = useState(
    notifications.length
  );
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );

  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
        // navigate(`/settings`); // Redirect to settings page on tab click
      }
    },
    [setCurrentTab, currentTab, navigate] // Added navigate to dependencies
  );

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleNotifDropdown = () => setIsNotifDropdownOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    const dropdown = document.getElementById("dropdown-menu");
    const notifDropdown = document.getElementById("notif-dropdown-menu");

    if (dropdown && !dropdown.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (notifDropdown && !notifDropdown.contains(event.target)) {
      setIsNotifDropdownOpen(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  return (
    <nav className="bg-white shadow-md top-0 left-0 w-full z-50 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 focus:outline-none">
          <FaBars className="text-gray-700 text-xl md:text-2xl" />
        </button>

        <div className="flex flex-col ml-2">
          <span className="text-gray-700 text-sm font-semibold hidden md:block">
            Welcome, Admin
          </span>
          <span className="text-gray-500 text-xs hidden md:block">
            {currentDateTime}
          </span>
        </div>
      </div>

      <div className="flex items-center relative">
        {/* Notification Bell */}
        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center relative mr-4">
          <button onClick={toggleNotifDropdown} className="focus:outline-none">
            <FaBell className="text-gray-700 text-xl" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div
              id="notif-dropdown-menu"
              className="absolute right-0 top-12 bg-white rounded-md shadow-xl border border-gray-300 z-10 p-4 w-56 sm:w-64 md:w-72 lg:w-80"
            >
              <h5 className="text-sm font-bold text-gray-800 lg:text-sm md:text-md sm:text-sm">
                Notifications
              </h5>
              <ul className="mt-2">
                {notifications.map((notif, idx) => (
                  <li key={idx} className="border-b border-gray-200 py-2">
                    <p className="text-sm lg:text-base md:text-sm">
                      {notif.message}
                    </p>
                    <p className="text-xs lg:text-sm md:text-xs text-gray-500">
                      {notif.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <img
              src={Image}
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
            <FaCaretDown className="text-gray-700 text-lg ml-1" />
          </button>

          {isDropdownOpen && (
            <div
              id="dropdown-menu"
              className="absolute right-0 top-12 bg-white rounded-md shadow-xl border border-gray-300 z-10 p-4 w-48"
            >
              <h5 className="text-sm font-bold text-gray-800">Account</h5>
              <ul className="mt-2">
                <li className="py-1">
                  <button
                    onClick={() => {
                      handleTabClick("Settings"); // Use handleTabClick to navigate to settings
                      setIsDropdownOpen(false);
                    }}
                    className="text-sm text-gray-700 hover:text-gray-900 w-full text-left"
                  >
                    Account Settings
                  </button>
                </li>
                <li className="py-1">
                  <Button
                    onClick={() => {
                      setShowLogoutDialog(true);
                      setIsDropdownOpen(false);
                    }}
                  />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
