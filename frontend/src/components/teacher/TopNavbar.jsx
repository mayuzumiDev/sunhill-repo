import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaCaretDown, FaUserCircle } from "react-icons/fa";
import Button from "../LogoutButton";
import Switch from "../Switch";
import unknown from "../../assets/img/home/unknown.jpg";
import { axiosInstance } from "../../utils/axiosInstance";
import NotificationButton from "../common/NotificationButton";

const TopNavbar = ({
  setShowLogoutDialog,
  currentTab,
  setCurrentTab,
  notifications = [],
  toggleSidebar,
  darkMode,
  toggleDarkMode,
}) => {
  const [teacherData, setTeacherData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchTeacherData = async () => {
    try {
      const response = await axiosInstance.get(
        "/user-teacher/current-teacher/"
      );
      if (response.data?.teacher_profile) {
        const profile = response.data.teacher_profile;
        setTeacherData(profile);

        // Store role and branch in localStorage
        localStorage.setItem("userRole", profile.user_info?.role || "teacher");
        localStorage.setItem(
          "userBranch",
          profile.user_info?.branch_name || ""
        );
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  useEffect(() => {
    if (teacherData?.user_info?.profile_image) {
      // console.log(
      //   "Setting profile image:",
      //   teacherData.user_info.profile_image
      // );
      setProfileImage(teacherData.user_info.profile_image);
    } else {
      // console.log("Setting default image");
      setProfileImage(null);
    }
  }, [teacherData]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      // console.log("Profile update detected, refreshing data...");
      fetchTeacherData();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const toggleNotifDropdown = () => setIsNotifDropdownOpen((prev) => !prev);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen((prev) => !prev);

  const handleOutsideClick = (e) => {
    if (
      isNotifDropdownOpen &&
      notifDropdownRef.current &&
      !notifDropdownRef.current.contains(e.target)
    ) {
      setIsNotifDropdownOpen(false);
    }
    if (
      isProfileDropdownOpen &&
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(e.target)
    ) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isNotifDropdownOpen, isProfileDropdownOpen]);

  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
      }
    },
    [setCurrentTab, currentTab]
  );

  return (
    <div
      className={`shadow-lg p-3 flex justify-between items-center rounded-b-lg ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="group relative inline-block w-[44px] p-[5px] h-[35px]"
        >
          <span className="mx-[auto] my-[0] relative top-[0px] w-[20px] h-[4px] bg-green-600 block [transition-property:margin,_width] group-hover:w-[20px] duration-200 after:absolute after:content-[''] after:mt-[8px] after:w-[30px] after:h-[4px] after:bg-green-600 after:block after:left-[0] after:[transition-property:margin,_left] after:duration-200 group-hover:after:mt-[4px] group-hover:after:-left-[5px] before:absolute before:content-[''] before:-mt-[8px] before:w-[30px] before:h-[4px] before:bg-green-600 before:block before:left-[0] before:[transition-property:margin,_width,_left] before:duration-200 group-hover:before:-mt-[4px] group-hover:before:w-[10px] group-hover:before:left-[5px]" />
        </button>
      </div>

      <div className="flex items-center space-x-4 relative">
        <button onChange={toggleDarkMode}>
          <Switch checked={darkMode} />
        </button>

        {/* Notification Button */}
        <NotificationButton
          userRole={localStorage.getItem("userRole")}
          userBranch={localStorage.getItem("userBranch")}
          notifications={notifications}
        />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center text-green-700 focus:outline-none"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className={`w-10 h-10 rounded-full border-2 object-cover ${
                  darkMode ? "border-gray-700" : "border-green-500"
                }`}
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  darkMode
                    ? "border-gray-700 bg-gray-700"
                    : "border-green-500 bg-gray-200"
                }`}
              >
                <FaUserCircle className="w-full h-full text-gray-400" />
              </div>
            )}

            {/* Profile Details (Shown only on medium screens and up) */}
            <div className="hidden sm:flex flex-col ml-2 items-start">
              <span
                className={`font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis ${
                  darkMode ? "text-white" : "text-green-700"
                }`}
                style={{ maxWidth: "150px" }}
              >
                {teacherData?.first_name || ""} {teacherData?.last_name || ""}
              </span>
              <span className="text-gray-400 text-xs">
                {teacherData?.role || "Teacher"}
              </span>
              <span className="text-green-500 font-bold text-xs">
                {teacherData?.branch_name || ""}
              </span>
            </div>

            <FaCaretDown className="ml-1" />
          </button>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div
              ref={profileDropdownRef}
              className={`absolute right-0 top-12 mt-3 rounded-md shadow-xl z-10 p-4 w-56 ${
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-300"
              }`}
            >
              {/* Account Information (Visible on small screens only) */}
              <div className="sm:hidden mb-2">
                <h5
                  className={`text-md font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Account
                </h5>
                <span
                  className={`font-semibold text-sm px-2 py-1 ${
                    darkMode ? "text-white" : "text-green-700"
                  }`}
                >
                  {teacherData?.first_name || ""} {teacherData?.last_name || ""}
                </span>
                <p className="text-gray-400 text-xs px-2 ">
                  {teacherData?.role || "Teacher"}
                </p>
                <p className="text-green-500 font-bold text-xs px-2 ">
                  {teacherData?.branch_name || ""}
                </p>
              </div>
              <ul className="mt-2">
                <h5
                  className={`text-sm font-bold mb-2 hidden lg:block ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Account
                </h5>
                <li>
                  <button
                    onClick={() => {
                      handleTabClick("Account Settings");
                      setIsProfileDropdownOpen(false);
                    }}
                    className={`text-sm px-2 py-1 w-full text-left rounded ${
                      darkMode
                        ? "text-white hover:text-green-700 hover:bg-gray-800"
                        : "text-gray-700 hover:text-green-700 hover:bg-gray-200"
                    }`}
                  >
                    Account Settings
                  </button>
                </li>
                <li className="py-2 ml-2">
                  <Button
                    onClick={() => {
                      setShowLogoutDialog(true);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="text-sm text-gray-700 hover:text-red-600 hover:bg-gray-200 w-full text-left px-2 py-1 rounded"
                  />
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
