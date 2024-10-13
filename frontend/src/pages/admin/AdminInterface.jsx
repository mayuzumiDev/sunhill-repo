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
import Breadcrumb from "../../components/Breadcrumbs"; // Import Breadcrumb component

function AdminInterface() {
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]); // State for notifications

  // Function to handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1090) {
        setIsSidebarOpen(false); // Automatically hide sidebar on smaller screens
      } else {
        setIsSidebarOpen(true); // Show sidebar on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Function to close sidebar on small screens
  const toggleSidebarOnSmallScreen = () => {
    if (window.innerWidth < 1090) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-opacity-50">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 w-64 z-10 bg-white shadow-lg">
          <SideNavbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            toggleSidebarOnSmallScreen={toggleSidebarOnSmallScreen}
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
          />
          {showLogoutDialog && (
            <Logout onClose={() => setShowLogoutDialog(false)} />
          )}
        </div>

        {/* Main content section */}
        <div className="flex-1 p-6 bg-blue-50 bg-opacity-50 mt-0 overflow-y-auto">
          <Breadcrumb pageName={currentTab} />
          {currentTab === "Dashboard" && <Dashboard />}
          {currentTab === "Teachers" && <Teacher />}
          {currentTab === "Students" && <Student />}
          {currentTab === "Parents" && <Parent />}
          {currentTab === "Public" && <Public />}
          {currentTab === "Branches" && <Branches />}
          {currentTab === "Events" && (
            <SchoolEventsCalendar setNotifications={setNotifications} />
          )}{" "}
          {/* Pass setNotifications */}
          {currentTab === "Create Account" && <CreateAccount />}
          {currentTab === "Settings" && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}

export default AdminInterface;
