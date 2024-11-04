import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom"; // Import createPortal for rendering outside of sidebar
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
  FaSearch,
  FaQuestion,
} from "react-icons/fa";

// Tooltip component
function Tooltip({ name, position, isVisible }) {
  if (!isVisible) return null;

  const style = {
    top: position.top + 8 + "px",
    left: position.left + 9 + "px",
    zIndex: 1000,
    whiteSpace: "nowrap",
  };

  return createPortal(
    <div
      className="absolute bg-black text-white text-xs rounded py-1 px-2"
      style={style}
    >
      {name}
    </div>,
    document.body
  );
}

const SideNavbar = ({
  currentTab,
  setCurrentTab,
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [tooltip, setTooltip] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
        // Hide sidebar if on small screen
        if (window.innerWidth < 768) {
          toggleSidebar();
        }
      }
    },
    [setCurrentTab, currentTab, toggleSidebar]
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
    { name: "SpecialED Tool", icon: <FaSearch /> },
    { name: "FAQ", icon: <FaQuestion /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full ${
        isSidebarOpen ? "w-64" : "w-16"
      }  ${window.innerWidth < 768 && !isSidebarOpen ? "hidden" : ""} bg-[#1B2430] transition-width duration-300 text-white shadow-lg`}
    >
      {/* Fixed Logo and title */}
      <div className="flex flex-col items-center justify-center mt-4 mb-5 h-20 border-b border-gray-200">
        <div className="flex items-center p-4">
        <img
            src={sunhillLogo}
            alt="Sunhill Logo"
            className={`rounded-full shadow-md ${isSidebarOpen ? "h-12 w-12" : "h-8 w-8"}`} // Adjusted size here
          />
          {isSidebarOpen && (
            <div className="flex flex-col ml-2">
              <h1 className="font-semibold text-lg">
                <span className="text-red-400">S</span>
                <span className="text-orange-400">u</span>
                <span className="text-green-400">n</span>
                <span className="text-teal-400">h</span>
                <span className="text-blue-400">i</span>
                <span className="text-purple-400">l</span>
                <span className="text-orange-400">l</span>
                <span className="text-white-500"> LMS</span>
              </h1>
              <p className="text-xs italic">Educating the Leaders of the Future...Today!</p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Main navigation */}
      <div className="overflow-y-auto h-[calc(100vh-4rem)] scrollbar-hidden">
        <nav className="mt-4">
          <ul className="flex flex-col space-y-1 ">
            {/* Menu Header */}
            {isSidebarOpen && (
              <li className="w-full text-left text-gray-400 ml-3 mt-4 font-semibold text-sm sm:text-base sm:ml-4">
                MENU
              </li>
            )}

            {/* Main Tabs */}
            {mainTabs.map(({ name, icon }) => (
              <li key={name} className="w-full  relative">
                <Link
                  to={`/admin/${name.toLowerCase()}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(name);
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPosition({ top: rect.top, left: rect.right });
                    setTooltip(name);
                  }}
                  onMouseLeave={() => setTooltip("")}
                  className={`flex items-center py-3 mx-2 rounded-2xl transition-all duration-200 ease-in-out transform hover:bg-blue-700 ${
                    currentTab === name ? "bg-blue-600 font-bold" : "text-white"
                  } text-xs sm:text-base`}
                  style={{ width: "calc(100% - 1rem)" }}
                  aria-label={name}
                  role="menuitem"
                >
                  <span className="mr-4 ml-4 sm:ml-4">{icon}</span>
                  {isSidebarOpen && <span>{name}</span>}
                </Link>
              </li>
            ))}

            {/* Additional Tabs */}
            {isSidebarOpen && (
              <li className="w-full text-left text-gray-400 ml-3 mt-4 font-semibold text-sm sm:text-base sm:ml-4">
                SUPPORT
              </li>
            )}
            {additionalTabs.map(({ name, icon }) => (
              <li key={name} className="w-full relative">
                <Link
                  to={`/admin/${name.toLowerCase().replace(/\s+/g, "-")}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(name);
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPosition({ top: rect.top, left: rect.right });
                    setTooltip(name);
                  }}
                  onMouseLeave={() => setTooltip("")}
                  className={`flex items-center py-3 mx-2 rounded-lg transition-all duration-200 ease-in-out transform hover:bg-blue-700 ${
                    currentTab === name ? "bg-blue-600 font-bold" : "text-white"
                  } text-xs sm:text-base`}
                  style={{ width: "calc(100% - 1rem)" }}
                  aria-label={name}
                  role="menuitem"
                >
                  <span className="mr-6 ml-4 sm:ml-4">{icon}</span>
                  {isSidebarOpen && <span>{name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Tooltip */}
      <Tooltip name={tooltip} position={tooltipPosition} isVisible={!!tooltip && !isSidebarOpen} />

      {/* Styles to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SideNavbar;
