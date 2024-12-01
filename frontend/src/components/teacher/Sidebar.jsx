import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom"; // Import createPortal for rendering outside of sidebar
import sunhillLogo from "../../assets/img/home/sunhill.jpg";
import SpecialEducationTool from "../../assets/img/home/specialed.png";
import {
  FaHome,
  FaChalkboardTeacher,
  FaSearch,
  FaUserGraduate,
  FaClipboardList,
  FaCog,
  FaEnvelope,
} from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";

// Tooltip component
function Tooltip({ name, position, isVisible }) {
  if (!isVisible) return null;

  const style = {
    position: "fixed",
    top: `${position.top + 12}px`,
    left: `${position.left + 10}px`,
    zIndex: 1000,
    whiteSpace: "nowrap",
    transform: "translateY(-100%)",
  };

  return createPortal(
    <div
      className="bg-black text-white text-xs rounded py-1 px-2"
      style={style}
    >
      {name}
    </div>,
    document.body
  );
}

const Sidebar = ({
  currentTab,
  setCurrentTab,
  toggleSidebar,
  isSidebarOpen,
  darkMode,
}) => {
  const [tooltip, setTooltip] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

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

  const handleMouseEnter = (name, event) => {
    if (!isSidebarOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      setTooltipPosition({
        top: centerY,
        left: rect.right,
      });
      setTooltip(name);
    }
  };

  const mainTabs = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Classroom", icon: <FaChalkboardTeacher /> },
    // { name: "Materials", icon: <MdLibraryBooks /> },
    // { name: "Scores", icon: <FaUserGraduate /> },
    // { name: "Quizzes", icon: <FaClipboardList /> },
    {
      name: "SpecialED",
      icon: <FaSearch/>,
      // (
      // //   <img
      //     src={SpecialEducationTool}
      //     alt="Special Education Tool"
      //     className="w-5 h-5"
      //   />
      // ),
    },
  ];

  // const additionalTabs = [
  //   // { name: "Messages", icon: <FaEnvelope /> },
  //   { name: "Settings", icon: <FaCog /> },
  // ];

  return (
    <div>
      <style>
        {`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(180deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          /* Apply hover animations to the entire Link element */
          .link-hover:hover {
            transform: scale(1.0); /* Slight scaling for the whole item */
            transition: all 0.2s ease-in-out;
          }
          .link-hover:hover .rotate-on-hover {
            animation: rotate 0.6s ease-in-out;
          }
        `}
      </style>

      <div
        className={`fixed top-0 left-0 h-full ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        } shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        } ${window.innerWidth < 1024 && !isSidebarOpen ? "hidden" : ""}`}
      >
        {/* Fixed Logo and title */}
        <div className="flex flex-col items-center justify-center mt-4 mb-7 h-20 border-b border-gray-200">
          <div className="flex items-center p-4">
            {/* <img
              src={sunhillLogo}
              alt="Sunhill Logo"
              className="h-12 w-12 rounded-full shadow-md"
            /> */}
            {isSidebarOpen && (
              <div className="flex flex-col ml-2">
                <h1 className="font-semibold text-lg">
                  <span className="text-red-500">S</span>
                  <span className="text-orange-500">u</span>
                  <span className="text-green-500">n</span>
                  <span className="text-teal-500">h</span>
                  <span className="text-blue-500">i</span>
                  <span className="text-purple-500">l</span>
                  <span className="text-orange-500">l</span>
                  <span className="text-green-800"> LMS</span>
                </h1>
                <p className="text-xs italic">
                  Educating the Leaders of the Future...Today!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Main navigation */}
        <div className="overflow-y-auto h-[calc(100vh-4rem)] scrollbar-hidden rounded-b-t-lg">
          <nav className="mt-4">
            <ul className="flex flex-col space-y-2">
              {/* Menu Header */}
              {isSidebarOpen && (
                <li
                  className={`w-full text-left ml-4 font-semibold text-sm sm:text-base ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  MENU
                </li>
              )}

              {/* Main Tabs */}
              {mainTabs.map(({ name, icon }) => (
                <li key={name} className="w-full relative">
                  <Link
                    to={`/teacher/${name.toLowerCase()}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(name);
                    }}
                    onMouseEnter={(e) => handleMouseEnter(name, e)}
                    onMouseLeave={() => setTooltip("")}
                    className={`link-hover flex items-center py-3 mx-2 rounded-full transition-all duration-200 ease-in-out transform ${
                      currentTab === name
                        ? "bg-green-500 text-white font-bold shadow-xl"
                        : `${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-green-200"
                          } hover:shadow-xl`
                    } text-sm sm:text-base`}
                    style={{ width: "calc(100% - 1rem)" }}
                    aria-label={name}
                    role="menuitem"
                  >
                    <span className="mr-4 ml-6 transform transition-transform duration-200 hover:scale-110 rotate-on-hover">
                      {icon}
                    </span>
                    {isSidebarOpen && <span>{name}</span>}
                  </Link>
                </li>
              ))}

              {/* Additional Tabs */}
              {/* {additionalTabs.map(({ name, icon }) => (
                <li key={name} className="w-full relative">
                  <Link
                    to={`/teacher/${name.toLowerCase().replace(/\s+/g, "-")}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(name);
                    }}
                    onMouseEnter={(e) => handleMouseEnter(name, e)}
                    onMouseLeave={() => setTooltip("")}
                    className={`link-hover flex items-center py-3 mx-2 rounded-full transition-all duration-200 ease-in-out transform ${
                      currentTab === name
                        ? "bg-green-500 text-white font-bold shadow-xl"
                        : `${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-green-200"
                          } hover:shadow-xl`
                    } text-sm sm:text-base`}
                    style={{ width: "calc(100% - 1rem)" }}
                    aria-label={name}
                    role="menuitem"
                  >
                    <span className="mr-4 ml-6 transform transition-transform duration-200 hover:scale-110 rotate-on-hover">
                      {icon}
                    </span>
                    {isSidebarOpen && <span>{name}</span>}
                  </Link>
                </li>
              ))} */}
            </ul>
          </nav>
        </div>
        {/* Tooltip */}
        <Tooltip
          name={tooltip}
          position={tooltipPosition}
          isVisible={!!tooltip}
        />
      </div>
    </div>
  );
};

export default Sidebar;
