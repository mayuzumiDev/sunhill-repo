import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBook,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaChartLine,
} from "react-icons/fa";
import SunhillLogo from "../../assets/img/home/sunhill.jpg";
import { createPortal } from "react-dom";
function Tooltip({ name, position, isVisible }) {
  if (!isVisible) return null;

  const style = {
    top: position.top + 5 + "px",
    left: position.left + 13 + "px", // Offset from the sidebar for better visibility
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
    document.body // Render outside of sidebar container
  );
}
const SideNavbar = ({
  currentTab,
  setCurrentTab,
  toggleSidebar,
  isSidebarOpen,
  darkMode,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltip, setTooltip] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = (name, event) => {
    if (!isSidebarOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({ top: rect.top, left: rect.right });
      setTooltip(name);
    }
  };

  const handleMouseLeave = () => {
    setTooltip("");
  };

  const navItems = [
    { name: "Dashboard", icon: FaHome },
    { name: "Students", icon: FaUser },
    { name: "Scores", icon: FaBook },
    // { name: "Messages", icon: FaEnvelope },
    // { name: "Analytics", icon: FaChartLine },
    { name: "Settings", icon: FaCog },
  ];

  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
        // Hide sidebar if on small screen
        if (window.innerWidth < 1024) {
          toggleSidebar();
        }
      }
    },
    [setCurrentTab, currentTab, toggleSidebar]
  );

  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      } ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-orange-500 to-orange-700 text-white"
      } ${window.innerWidth < 1024 && !isSidebarOpen ? "hidden" : ""}`}
    >
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center p4">
          {/* <img
            src={SunhillLogo}
            alt="Sunhill LMS"
            className={`rounded-full transition-all duration-300 ${
              isSidebarOpen ? "w-12 h-12 mr-3" : "w-8 h-8"
            }`}
          /> */}
          {isSidebarOpen && (
            <div className="flex flex-col">
              <div className="relative">
                <Link
                  to="/"
                  className="font-semibold text-lg ml-1 sm:text-2xl text-white"
                >
                  Sunhill
                </Link>
                <h1 className="absolute -top-1 left-24 text-xs font-bold font-montserrat text-white">
                  LMS
                </h1>
              </div>
              <p className="text-xs italic mt-1 ml-1">
                Educating the Leaders of the Future...Today!
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-7 flex-1">
        <h1 className={`text-md ml-4 font-bold ${!isSidebarOpen && "hidden"}`}>
          Menu
        </h1>
        <ul className="space-y-4 py-4">
          {navItems.map((item) => (
            <li key={item.name} className="flex justify-left ml-3 text-white">
              <button
                onClick={() => handleTabClick(item.name)}
                onMouseEnter={(event) => handleMouseEnter(item.name, event)}
                onMouseLeave={handleMouseLeave}
                className={`flex items-center px-4 py-2 text-center rounded-full transition-all duration-200 ${
                  currentTab === item.name
                    ? `${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-orange-500"
                      } w-10/12`
                    : `hover:bg-orange-400 hover:text-white w-10/12` // Darker orange for hover
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${isSidebarOpen ? "mr-2" : "mr-0"}`}
                />
                {isSidebarOpen && <span>{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {isSidebarOpen && (
        <footer
          className={`mt-auto p-4 border-t ${
            darkMode ? "border-gray-700" : "border-orange-400"
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-white">
              &copy; 2024 Sunhill LMS. All rights reserved.
            </p>
          </div>
        </footer>
      )}
      <Tooltip
        name={tooltip}
        position={tooltipPosition}
        isVisible={!!tooltip}
      />
    </div>
  );
};

export default SideNavbar;
