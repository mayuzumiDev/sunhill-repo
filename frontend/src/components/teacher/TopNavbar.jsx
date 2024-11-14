import React, { useState, useEffect, useRef, useCallback } from "react";
import { axiosInstance } from "../../utils/axiosInstance"; // Assuming this is where your axios instance is set up
import { FaBell, FaCaretDown, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../LogoutButton";
import Notif from "../NotifButton";
import Switch from "../Switch";
import unknown from "../../assets/img/home/unknown.jpg"; // Default image in case no profile image is available

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
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axiosInstance.get("/user-admin/current-teacher/");
        if (response.status === 200) {
          const current_teacher = response.data;
          setTeacherData(current_teacher);
        }
      } catch (error) {
        console.error("An error occurred while fetching the data:", error);
      }
    };

    fetchTeacherData();
  }, []);
  // Empty dependency array means this runs only once when the component mounts

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
    [setCurrentTab, currentTab, navigate]
  );

  return (
    <div
      className={`shadow-lg p-3 flex justify-between items-center rounded-b-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
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
          <button
            onChange={toggleDarkMode}
          >
            <Switch  checked={darkMode} />     
          </button>

         {/* Notification Button */}
         <div className="relative">
          <button
            onClick={toggleNotifDropdown}
            className={`flex items-center ${
              darkMode ? "text-white" : "text-green-700"
            } focus:outline-none relative`}
          >
            <Notif />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {notifications.length > 0 ? notifications.length : 0}
            </span>
          </button>

          {/* Notification Dropdown */}
          {isNotifDropdownOpen && (
            <div
              ref={notifDropdownRef}
              className={`absolute right-0 top-15 mt-1 rounded-md shadow-xl border border-gray-300 z-20 p-4 w-56 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h5
                className={`text-sm font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Notifications
              </h5>
              <ul className="mt-2">
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <li
                      key={idx}
                      className={`border-b border-gray-200 py-2 ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.date}</p>
                    </li>
                  ))
                ) : (
                  <li className="py-2 text-gray-500 text-sm">
                    No notifications
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {teacherData && (
  <div className="relative">
    <button
      onClick={toggleProfileDropdown}
      className="flex items-center text-green-700 focus:outline-none"
    >
      <img
        src={teacherData.profile_image || unknown}
        alt="Profile"
        className={`w-10 h-10 rounded-full border-2 ${
          darkMode ? "border-gray-700" : "border-green-500"
        }`}
      />
      
      {/* Profile Details (Shown only on medium screens and up) */}
      <div className="hidden sm:flex flex-col ml-2 items-start">
        <span
          className={`font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis ${
            darkMode ? "text-white" : "text-green-700"
          }`}
          style={{ maxWidth: "150px" }}
        >
          {teacherData.first_name} {teacherData.last_name}
        </span>
        <span className="text-gray-400 text-xs">{teacherData.role}</span>
        <span className="text-green-500 font-bold text-xs">
          {teacherData.branch_name}
        </span>
      </div>

      <FaCaretDown className="ml-1" />
    </button>

    {/* Profile Dropdown */}
    {isProfileDropdownOpen && (
      <div
        ref={profileDropdownRef}
        className={`absolute right-0 top-12 mt-3 rounded-md shadow-xl z-10 p-4 w-56 ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
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
          <span className={`font-semibold text-sm px-2 py-1 ${
              darkMode ? "text-white" : "text-green-700"
            }`}
          >
            {teacherData.first_name} {teacherData.last_name}
          </span>
          <p className="text-gray-400 text-xs px-2 ">{teacherData.role}</p>
          <p className="text-green-500 font-bold text-xs px-2 ">
            {teacherData.branch_name}
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
)}

      </div>
    </div>
  );
};

export default TopNavbar;
