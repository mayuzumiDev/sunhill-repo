import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown, FaBars, FaBell } from "react-icons/fa";
import Button from "../LogoutButton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import userThree from '../../assets/img/home/unknown.jpg';
import { PROFILE_IMAGE_UPDATED } from './settings/PhotoUpload';

const TopNavbar = ({
  setShowLogoutDialog,
  currentTab,
  setCurrentTab,
  toggleSidebar,
  notifications = [],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(notifications.length);
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );

  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  // Function to fetch profile image
  const fetchProfileImage = async () => {
    try {
      const response = await axiosInstance.get("/user-admin/user-info/profile-image/");
      if (response.status === 200 && response.data.profile_image) {
        setProfileImage(response.data.profile_image);
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      setProfileImage(null);
    }
  };

  // Listen for profile image updates
  useEffect(() => {
    const handleProfileImageUpdate = (event) => {
      const newProfileImage = event.detail.profileImage;
      setProfileImage(newProfileImage);
    };

    window.addEventListener(PROFILE_IMAGE_UPDATED, handleProfileImageUpdate);

    // Initial fetch
    fetchProfileImage();

    return () => {
      window.removeEventListener(PROFILE_IMAGE_UPDATED, handleProfileImageUpdate);
    };
  }, []);

  useEffect(() => {
    // Fetch user profile image on component mount
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    document.addEventListener("mousedown", (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(e.target) &&
        isNotifDropdownOpen
      ) {
        setIsNotifDropdownOpen(false);
      }
    });

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", (e) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target) &&
          isDropdownOpen
        ) {
          setIsDropdownOpen(false);
        }
        if (
          notifDropdownRef.current &&
          !notifDropdownRef.current.contains(e.target) &&
          isNotifDropdownOpen
        ) {
          setIsNotifDropdownOpen(false);
        }
      });
    };
  }, [isDropdownOpen, isNotifDropdownOpen]);

  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  const handleTabClick = (tab) => {
    if (tab !== currentTab) {
      setCurrentTab(tab);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleNotifDropdown = () => setIsNotifDropdownOpen((prev) => !prev);

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
              ref={notifDropdownRef}
              className="absolute right-0 top-12 bg-white rounded-md shadow-xl border border-gray-300 z-10 p-4 w-56 sm:w-64 md:w-72 lg:w-80"
            >
              <h5 className="text-sm font-bold text-gray-800">Notifications</h5>
              <ul className="mt-2">
                {notifications.map((notif, idx) => (
                  <li key={idx} className="border-b border-gray-200 py-2">
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-gray-500">{notif.date}</p>
                  </li>
                ))}
                {notifications.length === 0 && (
                  <li className="py-2 text-sm text-gray-500">
                    No new notifications
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  onError={() => setProfileImage(null)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">A</span>
                </div>
              )}
            </div>
            <FaCaretDown className="text-gray-700 text-lg ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-12 bg-white rounded-md shadow-xl border border-gray-300 z-10 w-48">
              <div className="p-2">
                <button
                  onClick={() => {
                    handleTabClick("Settings");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Account Settings
                </button>
                <hr className="my-2" />
                <div className="px-4 py-2">
                  <Button
                    onClick={() => {
                      setShowLogoutDialog(true);
                      setIsDropdownOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
