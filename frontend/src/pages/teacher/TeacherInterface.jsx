import React, { useState, useEffect } from "react";
import SideNavbar from "../../components/teacher/Sidebar";
import TopNavbar from "../../components/teacher/TopNavbar";
import TeacherDashboard from "./TeacherDashboard";
import StudentScores from "./StudentScores";
import ManageLessons from "./Classes";
import ManageMaterials from "./ManageMaterials";
import ManageAssignments from "./ManageAssignments";
import SpecialEd from "../admin/SpecialEd";
// import Messages from "./Messages";
// import TeacherSettings from "./TeacherSettings";
import AccountSettings from "./AccountSettings";
import Logout from "../../components/Logout";
import HideScrollbar from "../../components/misc/HideScrollBar";

function TeacherInterface() {
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start with sidebar closed on small screens
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  // Function to handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024); // Open sidebar on larger screens
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
      className={`font-montserrat flex h-screen overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-opacity-50"
      }`}
    >
      <HideScrollbar />
      {/* Sidebar */}
      <div className="print-hidden">
        <div
          className={`fixed  inset-y-0 left-0 z-10 ${
            darkMode ? "bg-gray-900" : "bg-white"
          } shadow-lg transition-all duration-300 ease-in-ot`}
        >
          <SideNavbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode} // Pass dark mode state to Sidebar
          />
        </div>
      </div>

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
          window.innerWidth < 1024 && !isSidebarOpen
            ? "ml-0"
            : isSidebarOpen
            ? "ml-64"
            : "ml-20"
        } print:ml-0`}
      >
        {/* Fixed Top Navbar */}
        <div className="flex-none print-hidden">
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
          } bg-opacity-60 mt-0 overflow-y-auto  print:mt-0 print:p-0 print:bg-white print:text-black`}
        >
          {currentTab === "Dashboard" && (
            <TeacherDashboard darkMode={darkMode} />
          )}
          {/* {currentTab === "Scores" && <StudentScores darkMode={darkMode} />} */}
          {currentTab === "Classroom" && <ManageLessons darkMode={darkMode} />}
          {/* {currentTab === "Materials" && <ManageMaterials />}
          {currentTab === "Quizzes" && (
            <ManageAssignments darkMode={darkMode} />
          )} */}
          {currentTab === "SpecialED" && <SpecialEd darkMode={darkMode} />}
          {/* {currentTab === "Messages" && <Messages darkMode={darkMode} />} */}
          {/* {currentTab === "Settings" && <TeacherSettings darkMode={darkMode} />} */}
          {currentTab === "Account Settings" && (
            <AccountSettings
              setCurrentTab={setCurrentTab}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherInterface;
