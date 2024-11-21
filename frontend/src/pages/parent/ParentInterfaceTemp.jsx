import React, { useState, useEffect } from "react";
import SideNavbar from "../../components/parents/Sidebar";
import TopNavbar from "../../components/parents/TopNavbar";
import ParentDashboard from "./ParentDashboard";
import ViewStudents from "./ViewStudents";
import ViewAssignments from "./ViewAssignments";
import Messages from "./Messages";
import ParentSettings from "./ParentAccSettings";
import Logout from "../../components/Logout";
import Breadcrumb from "../../components/Breadcrumbs";

function ParentInterface() {
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-800" : "bg-opacity-50"}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-10 ${darkMode ? "bg-gray-900" : "bg-white"} shadow-lg`}>
        <SideNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          darkMode={darkMode} // Pass dark mode state to Sidebar
        />
      </div>
      {isSidebarOpen && (
        <div className={`fixed inset-y-0 left-0 z-10 ${darkMode ? "bg-gray-900" : "bg-white"} shadow-lg`}>
          <SideNavbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode} // Pass dark mode state to Sidebar
          />
        </div>
      )}

<div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${window.innerWidth < 768 && !isSidebarOpen ? 'ml-0' : isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="flex-none">
          <TopNavbar
            setCurrentTab={setCurrentTab}
            setShowLogoutDialog={setShowLogoutDialog}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
          {showLogoutDialog && <Logout onClose={() => setShowLogoutDialog(false)} />}
        </div>

        <div className={`flex-1 p-6 ${darkMode ? "bg-gray-700 text-white" : "bg-orange-100 text-black"} bg-opacity-60 mt-0 overflow-y-auto`}>
          <Breadcrumb pageName={currentTab} />
          {currentTab === "Dashboard" && <ParentDashboard darkMode={darkMode} />}
          {currentTab === "Students" && <ViewStudents darkMode={darkMode} />}
          {currentTab === "Assignments" && <ViewAssignments darkMode={darkMode} />}
          {currentTab === "Messages" && <Messages darkMode={darkMode} />}
          {currentTab === "Settings" && <ParentSettings darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}

export default ParentInterface;
