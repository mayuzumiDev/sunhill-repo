import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaMoon,
  FaSun,
  FaUser,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";
import userThree from "../../assets/img/home/unknown.jpg";
import { axiosInstance } from "../../utils/axiosInstance";
import Parent from "../../assets/img/home/mom.jpg";
import NotificationButton from "../common/NotificationButton";

const TopNavbar = ({
  setCurrentTab,
  setShowLogoutDialog,
  toggleSidebar,
  darkMode,
  toggleDarkMode,
  parentData,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [profileInfo, setProfileInfo] = useState({
    name: "Loading...",
    role: "Parent",
    image: null,
  });

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Fetch parent data
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          "/api/user-parent/current-parent/"
        );

        if (response?.data?.status === "success") {
          const profile = response.data.data;

          if (profile) {
            setProfileInfo({
              name:
                profile.first_name && profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : "Loading...",
              role: profile.role || "Parent",
              image: profile.user_info?.profile_image || null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching parent data:", error);
        setApiError(error.response?.data?.error || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParentData();
  }, []);

  // Update profile when parentData changes
  useEffect(() => {
    if (parentData) {
      setProfileInfo({
        name:
          parentData.first_name && parentData.last_name
            ? `${parentData.first_name} ${parentData.last_name}`
            : profileInfo.name,
        role: parentData.role || "Parent",
        image: parentData.user_info?.profile_image || null,
      });
    }
  }, [parentData]);

  // Listen for user info updates
  useEffect(() => {
    const handleUserInfoUpdate = (event) => {
      const updatedInfo = event.detail;
      setProfileInfo((prev) => ({
        ...prev,
        name:
          updatedInfo.first_name && updatedInfo.last_name
            ? `${updatedInfo.first_name} ${updatedInfo.last_name}`
            : prev.name,
      }));
    };

    window.addEventListener("USER_INFO_UPDATED", handleUserInfoUpdate);
    return () =>
      window.removeEventListener("USER_INFO_UPDATED", handleUserInfoUpdate);
  }, []);

  return (
    <nav
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } shadow-lg`}
    >
      <div className="w-full px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* Left side: Sidebar toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                darkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500`}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Right side: Dark mode toggle and profile */}
          <div className="flex items-center space-x-4">
            <NotificationButton />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                {profileInfo.image ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={profileInfo.image}
                    alt="Profile"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 border border-gray-300">
                    <FaUserCircle className="w-7 h-7 text-gray-400" />
                  </div>
                )}
                <div className="ml-2 flex flex-col items-start">
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {isLoading ? "Loading..." : profileInfo.name}
                  </span>
                  <span className="text-xs text-orange-500">
                    {profileInfo.role}
                  </span>
                </div>
                <FaChevronDown
                  className={`ml-3 h-4 w-4 ${
                    darkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
              </button>
              {dropdownOpen && (
                <div
                  className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  } ring-1 ring-black ring-opacity-5 z-50`}
                >
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-600"
                        : "text-gray-700 hover:bg-gray-100"
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
                      darkMode
                        ? "text-gray-300 hover:bg-gray-600"
                        : "text-gray-700 hover:bg-gray-100"
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
            <button
              onClick={toggleDarkMode}
              className={`p-1 rounded-full ${
                darkMode
                  ? "text-yellow-400 hover:text-yellow-300"
                  : "text-orange-400 hover:text-orange-600"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-4`}
            >
              {darkMode ? (
                <FaSun className="h-6 w-6" />
              ) : (
                <FaMoon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
