import React, { useState, useEffect, useRef } from "react";
import {
  FaCaretDown,
  FaBars,
  FaBell,
  FaKeyboard,
  FaSpinner,
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import Button from "../LogoutButton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { PROFILE_IMAGE_UPDATED } from "../admin/settings/PhotoUpload";
import userThree from "../../assets/img/home/unknown.jpg";
import NotificationButton from "../common/NotificationButton";

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
  const [isLoading, setIsLoading] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(
    notifications.length
  );
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );

  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const keyboardShortcuts = {
    n: () => setIsNotifDropdownOpen((prev) => !prev),
    p: () => setIsDropdownOpen((prev) => !prev),
    k: () => setShowShortcuts((prev) => !prev),
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey && keyboardShortcuts[e.key.toLowerCase()]) {
        e.preventDefault();
        keyboardShortcuts[e.key.toLowerCase()]();
      }
      // Close dropdowns on Escape
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsNotifDropdownOpen(false);
        setShowShortcuts(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const handleProfileImageUpdate = (event) => {
      const { profileImage: newProfileImage } = event.detail;
      if (newProfileImage) {
        setProfileImage(newProfileImage);
        setIsLoading(false);
      }
    };

    window.addEventListener(PROFILE_IMAGE_UPDATED, handleProfileImageUpdate);
    return () =>
      window.removeEventListener(
        PROFILE_IMAGE_UPDATED,
        handleProfileImageUpdate
      );
  }, []);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await axiosInstance.get("/user-admin/current-admin/");
        if (response.status === 200 && response.data.current_admin) {
          const adminData = response.data.current_admin;
          setAdminInfo({
            id: adminData.id,
            user_info_id: adminData.user_info?.id,
            username: adminData.username,
            email: adminData.email,
            contact_no: adminData.user_info?.contact_no,
            first_name: adminData.first_name,
            last_name: adminData.last_name,
            role: adminData.role,
            branch: adminData.branch,
          });
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchAdminInfo();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/user-admin/user-info/profile-image/"
        );
        if (response.status === 200 && response.data.profile_image) {
          const imageUrl = response.data.profile_image;
          setProfileImage(imageUrl);
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileImage();
  }, []);

  useEffect(() => {
    const handleUserInfoUpdate = (event) => {
      const { first_name, last_name, email, username, contact_no } =
        event.detail;
      setAdminInfo((prevInfo) => ({
        ...prevInfo,
        first_name,
        last_name,
        email,
        username,
        contact_no,
      }));
    };

    window.addEventListener("USER_INFO_UPDATED", handleUserInfoUpdate);
    return () =>
      window.removeEventListener("USER_INFO_UPDATED", handleUserInfoUpdate);
  }, []);

  const handleTabClick = (tab) => {
    if (tab !== currentTab) {
      setCurrentTab(tab);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleNotifDropdown = () => setIsNotifDropdownOpen((prev) => !prev);

  const handleOutsideClick = (e) => {
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
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen, isNotifDropdownOpen]);

  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  return (
    <nav className="bg-white shadow-md top-0 left-0 w-full z-50 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center ">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <FaBars className="text-gray-700 text-xl md:text-2xl" />
        </button>

        <div className="flex flex-col ml-4">
          <span className="text-gray-700 text-sm font-semibold hidden md:block">
            Welcome, {adminInfo?.first_name} {adminInfo?.last_name || "Admin"}
          </span>
          <span className="text-gray-500 text-xs hidden md:block">
            {currentDateTime}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={() => setShowShortcuts(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Keyboard Shortcuts (Alt+K)"
            aria-label="Show Keyboard Shortcuts"
          >
            <FaKeyboard className="text-gray-700" />
          </button>
        </div>

        {/* Notification Bell */}
        <NotificationButton
          userRole={adminInfo?.role}
          userBranch={adminInfo?.branch}
        />

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="User Profile (Alt+P)"
            aria-expanded={isDropdownOpen}
          >
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <FaSpinner className="animate-spin text-gray-400" />
                </div>
              ) : profileImage ? (
                <img
                  src={profileImage}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <FaUserCircle className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <FaCaretDown
              className={`text-gray-700 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-16 bg-white rounded-lg shadow-xl border border-gray-200 z-10 w-56 py-2 transform opacity-0 scale-95 animate-dropdown">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {adminInfo
                    ? `${adminInfo.first_name} ${adminInfo.last_name}`
                    : "Admin User"}
                </p>
                <p className="text-xs text-gray-500">
                  {adminInfo?.email || "admin@sunhill.edu"}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    handleTabClick("Settings");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                >
                  <FaUser className="text-gray-400" />
                  <span>Account Settings</span>
                </button>
                <hr className="my-1" />
                <div className="px-4 py-2">
                  <Button
                    onClick={() => {
                      setShowLogoutDialog(true);
                      setIsDropdownOpen(false);
                    }}
                    icon={<FaSignOutAlt />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) =>
            e.target === e.currentTarget && setShowShortcuts(false)
          }
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span>Notifications</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
                  Alt + N
                </kbd>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span>Profile</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
                  Alt + P
                </kbd>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span>Shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
                  Alt + K
                </kbd>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span>Close/Escape</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Add dropdown and modal animations
const style = document.createElement("style");
style.textContent = `
  @keyframes dropdown {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  .animate-dropdown {
    animation: dropdown 0.2s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default TopNavbar;
