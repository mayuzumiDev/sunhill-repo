import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import sunhillLogo from "../../assets/img/home/sunhill.jpg";
import SpecialEducationTool from "../../assets/img/home/specialed.png";
import {
  FaHome,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaClipboardList,
  FaCog,
  FaEnvelope,
} from "react-icons/fa";

const Sidebar = ({ currentTab, setCurrentTab, toggleSidebar, isSidebarOpen, darkMode }) => {
  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
        // Hide sidebar if on small screen
        if (window.innerWidth < 1090) {
          toggleSidebar();
        }
      }
    },
    [setCurrentTab, currentTab, toggleSidebar]
  );

  const mainTabs = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Classes", icon: <FaChalkboardTeacher /> },
    { name: "Students", icon: <FaUserGraduate /> },
    { name: "Assignments", icon: <FaClipboardList /> },
    {
      name: "SpecialED Tool",
      icon: <img src={SpecialEducationTool} alt="Special Education Tool" className="w-5 h-5" />,
    },
  ];

  const additionalTabs = [
    { name: "Messages", icon: <FaEnvelope /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-lg transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Fixed Logo and title */}
      <div className="flex items-center justify-center h-20">
        <img src={sunhillLogo} alt="Sunhill Logo" className="h-12 w-12 rounded-full shadow-md" />
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className={`font-semibold text-lg sm:text-2xl hover:text-blue-500 transition duration-300 ease-in-out ml-4 ${darkMode ? 'text-white' : 'text-black'}`}
          >
            <span className="letter1">S</span>
            <span className="letter2">u</span>
            <span className="letter3">n</span>
            <span className="letter4">h</span>
            <span className="letter5">i</span>
            <span className="letter6">l</span>
            <span className="letter7">l</span>
          </Link>
        </div>
        <h1 className={`text-sm font-bold font-montserrat ml-2 mb-5 sm:text-sm ${darkMode ? 'text-green-300' : 'text-green-800'}`}>LMS</h1>
      </div>

      {/* Scrollable Main navigation */}
      <div className="overflow-y-auto h-[calc(100vh-4rem)] scrollbar-hidden rounded-b-t-lg">
        <nav className="mt-4">
          <ul className="flex flex-col space-y-2">
            {/* Menu Header */}
            <li className={`w-full text-left ml-4 font-semibold text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              MENU
            </li>

            {/* Main Tabs */}
            {mainTabs.map(({ name, icon }) => (
              <li key={name} className="w-full">
                <Link
                  to={`/teacher/${name.toLowerCase()}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(name);
                  }}
                  className={`flex items-center py-3 mx-2 rounded-lg transition-all duration-200 ease-in-out transform ${
                    currentTab === name
                      ? "bg-green-500 text-white font-bold shadow-xl" // Active tab style
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-green-200'} hover:shadow-xl` // Non-active hover style
                  } text-sm sm:text-base`}
                  style={{ width: "calc(100% - 1rem)" }}
                  aria-label={name}
                  role="menuitem"
                >
                  <span className="mr-4 ml-4 transform transition-transform duration-200 hover:scale-110">
                    {icon}
                  </span>
                  <span>{name}</span>
                </Link>
              </li>
            ))}

            {/* Additional Tabs */}
            <li className={`w-full text-left ml-4 mt-6 font-semibold text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              SUPPORT
            </li>
            {additionalTabs.map(({ name, icon }) => (
              <li key={name} className="w-full">
                <Link
                  to={`/teacher/${name.toLowerCase().replace(/\s+/g, "-")}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(name);
                  }}
                  className={`flex items-center py-3 mx-2 rounded-lg transition-all duration-200 ease-in-out transform ${
                    currentTab === name
                      ? "bg-green-500 text-white font-bold shadow-xl" // Active tab style
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-green-200'} hover:shadow-xl` // Non-active hover style
                  } text-sm sm:text-base`}
                  style={{ width: "calc(100% - 1rem)" }}
                  aria-label={name}
                  role="menuitem"
                >
                  <span className="mr-4 ml-4 transform transition-transform duration-200 hover:scale-110">
                    {icon}
                  </span>
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
