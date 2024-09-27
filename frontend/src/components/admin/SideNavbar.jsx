import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import sunhillLogo from "../../assets/img/home/sunhill.jpg";
import {
  FaHome,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaClipboardList,
  FaBell,
  FaUser,
  FaEnvelope,
  FaBox,
  FaQuestion,
} from "react-icons/fa";

const SideNavbar = ({ currentTab, setCurrentTab, toggleSidebarOnSmallScreen }) => {
  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab); // Update the current tab state
        toggleSidebarOnSmallScreen(); // Close the sidebar on small screens
      }
    },
    [setCurrentTab, currentTab, toggleSidebarOnSmallScreen]
  );

  const mainTabs = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Teachers", icon: <FaChalkboardTeacher /> },
    { name: "Students", icon: <FaUserGraduate /> },
    { name: "Parents", icon: <FaUser /> },
    { name: "Public", icon: <FaUsers /> },
    { name: "Branches", icon: <FaClipboardList /> },
    { name: "Events", icon: <FaBell /> },
  ];

  const additionalTabs = [
    { name: "Messages", icon: <FaEnvelope /> },
    { name: "Special Identification Tool", icon: <FaBox /> },
    { name: "FAQ", icon: <FaQuestion /> },
  ];

  return (
    <div className="w-64 h-screen bg-[#1B2430] fixed text-white shadow-lg">
      {/* Fixed Logo and title */}
      <div className="flex items-center justify-center h-20">
        <img
          src={sunhillLogo}
          alt="Sunhill Logo"
          className="h-12 w-12 rounded-full"
        />
        <h1 className="text-lg font-bold font-montserrat ml-2 sm:text-xl">
          Sunhill LMS
        </h1>
      </div>

      {/* Scrollable Main navigation */}
      <div className="overflow-y-auto h-[calc(100vh-4rem)] scrollbar-hidden">
        <nav className="mt-4">
          <ul className="flex flex-col space-y-1">
            {/* Menu Header */}
            <li className="w-full text-left text-gray-400 ml-9 mt-4 font-semibold text-sm sm:text-base sm:ml-4">
              MENU
            </li>

            {/* Main Tabs */}
            {mainTabs.map(({ name, icon }) => (
              <li key={name} className="w-full">
                <Link
                  to={`/admin/${name.toLowerCase()}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(name);
                  }}
                  className={`flex items-center py-3 mx-2 rounded-lg transition-all duration-200 ease-in-out transform hover:bg-blue-700 ${
                    currentTab === name ? "bg-blue-600 font-bold" : "text-white"
                  } text-xs sm:text-base`}
                  style={{ width: "calc(100% - 1rem)" }}
                  aria-label={name}
                  role="menuitem"
                >
                  <span className="mr-6 ml-10 sm:ml-4">{icon}</span>
                  <span>{name}</span>
                </Link>
              </li>
            ))}

            {/* Additional Tabs */}
            <li className="w-full text-left text-gray-400 ml-9 mt-4 font-semibold text-sm sm:text-base sm:ml-4">
              SUPPORT
            </li>
            {additionalTabs.map(({ name, icon }) => (
              <li key={name} className="w-full">
                <Link
                  to={`/admin/${name.toLowerCase().replace(/\s+/g, "-")}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(name);
                  }}
                  className={`flex items-center py-3 mx-2 rounded-lg transition-all duration-200 ease-in-out transform hover:bg-blue-700 ${
                    currentTab === name ? "bg-blue-600 font-bold" : "text-white"
                  } text-xs sm:text-base`}
                  style={{ width: "calc(100% - 1rem)" }}
                  aria-label={name}
                  role="menuitem"
                >
                  <span className="mr-6 ml-10 sm:ml-4">{icon}</span>
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Styles to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hidden {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default SideNavbar;
