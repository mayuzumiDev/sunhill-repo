import React, { useState, useEffect } from "react";
import SideNavbar from "../../components/teacher/Sidebar";
import TopNavbar from "../../components/teacher/TopNavbar";
import TeacherDashboard from "./TeacherDashboard";
import ManageStudents from "./ManageStudents";
import ManageLessons from "./Classes";
import ManageAssignments from "./ManageAssignments";
import SpecialEducationTool from "./SpeEdTool";
import Messages from "./Messages";
import TeacherSettings from "./TeacherSettings";
import Logout from "../../components/Logout";

function TeacherInterface() {
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  // Function to handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1090);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-opacity-50"
      }`}
    >
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          className={`fixed inset-y-0 left-0 w-64 z-10 ${
            darkMode ? "bg-gray-900" : "bg-white"
          } shadow-lg`}
        >
          <SideNavbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode} // Pass dark mode state to Sidebar
          />
        </div>
      )}

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Fixed Top Navbar */}
        <div className="flex-none">
          <TopNavbar
            setCurrentTab={setCurrentTab}
            setShowLogoutDialog={setShowLogoutDialog}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode} // Pass dark mode state to TopNavbar
            toggleDarkMode={toggleDarkMode} // Pass toggle function to TopNavbar
          />
          {showLogoutDialog && (
            <Logout onClose={() => setShowLogoutDialog(false)} />
          )}
        </div>

        {/* Main content section */}
        <div
          className={`flex-1 p-6 ${
            darkMode ? "bg-gray-700 text-white" : "bg-green-100 text-black"
          } bg-opacity-60 mt-0 overflow-y-auto`}
        >
          {currentTab === "Dashboard" && (
            <TeacherDashboard darkMode={darkMode} />
          )}
          {currentTab === "Students" && <ManageStudents darkMode={darkMode} />}
          {currentTab === "Classes" && <ManageLessons darkMode={darkMode} />}
          {currentTab === "Assignments" && (
            <ManageAssignments darkMode={darkMode} />
          )}
          {currentTab === "SpecialED Tool" && (
            <SpecialEducationTool darkMode={darkMode} />
          )}
          {currentTab === "Messages" && <Messages darkMode={darkMode} />}
          {currentTab === "Settings" && <TeacherSettings darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}

export default TeacherInterface;