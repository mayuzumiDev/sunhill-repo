import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaBook, FaEnvelope, FaCog, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import SunhillLogo from "../../assets/img/home/sunhill.jpg";

const SideNavbar = ({ currentTab, setCurrentTab, toggleSidebar, isSidebarOpen, darkMode }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: "Dashboard", icon: FaHome },
    { name: "Students", icon: FaUser },
    { name: "Assignments", icon: FaBook },
    { name: "Messages", icon: FaEnvelope },
    { name: "Analytics", icon: FaChartLine },
    { name: "Settings", icon: FaCog },
  ];

  const handleTabClick = (tabName) => {
    setCurrentTab(tabName);
    if (isSmallScreen) {
      toggleSidebar(); // Hide sidebar when a tab is clicked on small screens
    }
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-orange-500 to-orange-700 text-white'}`}>
        <div className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <img src={SunhillLogo} alt="Sunhill LMS" className="w-12 h-12 rounded-full mr-3" />
          <div className="flex flex-col">
            <div className="relative">
              <Link
                to="/"
                className={`font-semibold text-lg ml-1 sm:text-2xl hover:text-blue-500 transition duration-300 ease-in-out text-white`}
              >
                <span className="letter1 text-white">S</span>
                <span className="letter2 text-white">u</span>
                <span className="letter3 text-white">n</span>
                <span className="letter4 text-white">h</span>
                <span className="letter5 text-white">i</span>
                <span className="letter6 text-white">l</span>
                <span className="letter7 text-white">l</span>
              </Link>
              <h1 className={`absolute -top-1 left-24 text-xs font-bold font-montserrat text-white`}>LMS</h1>
            </div>
            <p className="text-xs italic mt-1 ml-1">Educating the Leaders of the Future...Today!</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-7 flex-1">
        <h1 className="text-md ml-4 font-bold">Menu</h1>
        <ul className="space-y-4 py-4 ">
          {navItems.map((item) => (
            <li key={item.name} className="flex justify-left ml-5 text-white">
              <button
                onClick={() => handleTabClick(item.name)}
                className={`flex items-center px-4 py-2 text-center rounded-lg transition-all duration-200 ${
                  currentTab === item.name
                    ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-orange-500'} w-11/12`
                    : `hover:${darkMode ? 'bg-gray-700' : 'bg-white'} hover:text-${darkMode ? 'white' : 'orange-500'} hover:w-11/12`
                }`} 
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <footer className={`mt-auto p-4 border-t ${darkMode ? 'border-gray-700' : 'border-orange-400'}`}>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-white">&copy; 2024 Sunhill LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SideNavbar;
