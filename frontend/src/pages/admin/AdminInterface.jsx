// AdminInterface.js

import React, { useState, useEffect } from "react";
import SideNavbar from "../../components/admin/SideNavbar";
import TopNavbar from "../../components/admin/TopNavbar";
import Dashboard from "./Dashboard";
import CreateAccount from "./CreateAccount";
import Student from "./manage_accounts/Student";
import Teacher from "./manage_accounts/Teacher";
import Parent from "./manage_accounts/Parent";
import Public from "./manage_accounts/Public";
import Branches from "./Branches";
import SchoolEventsCalendar from "./Events";
import AdminSettings from "./AdminSettings";
import Logout from "../../components/Logout";
import Breadcrumb from "../../components/Breadcrumbs";

function AdminInterface() {
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Responsive sidebar toggle based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024);
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
        <div className={`fixed inset-y-0 left-0 z-10  ${darkMode ? "bg-gray-900" : "bg-white"} shadow-lg`}>
          <SideNavbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      )}

      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${window.innerWidth < 1024 && !isSidebarOpen ? 'ml-0' : isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Top Navbar */}
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

        {/* Main content section */}
        <div className={`flex-1 p-6 ${darkMode ? "bg-gray-700 text-white" : "bg-blue-50 text-black"} bg-opacity-60 mt-0 overflow-y-auto`}>
          <Breadcrumb pageName={currentTab} />
          {currentTab === "Dashboard" && <Dashboard />}
          {currentTab === "Teachers" && <Teacher />}
          {currentTab === "Students" && <Student />}
          {currentTab === "Parents" && <Parent />}
          {currentTab === "Public" && <Public />}
          {currentTab === "Branches" && <Branches />}
          {currentTab === "Events" && <SchoolEventsCalendar />}
          {currentTab === "Create Account" && <CreateAccount />}
          {currentTab === "Settings" && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}

export default AdminInterface;
