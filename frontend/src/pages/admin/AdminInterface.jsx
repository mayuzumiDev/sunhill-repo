import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import SideNavbar from "../../components/admin/SideNavbar";
import TopNavbar from "../../components/admin/TopNavbar";
import Dashboard from "./Dashboard";
import Student from "./manage_accounts/Student";
import Teacher from "./manage_accounts/Teacher";
import Parent from "./manage_accounts/Parent";
import Public from "./manage_accounts/Public";
import Branches from "./Branches";
import Events from "./Events";
import AdminSettings from "./AdminSettings";
import Logout from "../../components/Logout";
import SpecialED from "./SpecialEd";
import Faq from "./Faqs";
// import Messages from "./Messages";
// import Breadcrumb from "../../components/Breadcrumbs";

function AdminInterface() {
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const [previousTab, setPreviousTab] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [adminData, setAdminData] = useState({
    id: "",
    user_info_id: "",
    username: "",
    // password: "",
    email: "",
    contact_no: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axiosInstance.get("/user-admin/current-admin/");

        if (response.status === 200 && response.data.current_admin) {
          const data = response.data.current_admin;

          setAdminData({
            id: data.id || "",
            user_info_id: data.user_info.id || "",
            username: data.username || "",
            // password: "",
            email: data.email || "",
            contact_no: data.user_info?.contact_no || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
          });
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      }
    };

    fetchAdminData();
  }, []);

  // Responsive sidebar toggle based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabChange = (tab) => {
    setPreviousTab(currentTab);
    setCurrentTab(tab);
  };

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
      {/* Sidebar */}
      <div className="print:hidden">
        <div
          className={`fixed inset-y-0 left-0 z-10 ${
            darkMode ? "bg-gray-900" : "bg-white"
          } shadow-lg`}
        >
          <SideNavbar
            currentTab={currentTab}
            setCurrentTab={handleTabChange}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode}
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
            : "ml-16"
        } print:ml-0`}
      >
        {/* Top Navbar */}
        <div className="flex-none print:hidden">
          <TopNavbar
            setCurrentTab={handleTabChange}
            setShowLogoutDialog={setShowLogoutDialog}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
          {showLogoutDialog && (
            <Logout onClose={() => setShowLogoutDialog(false)} />
          )}
        </div>

        {/* Main content section */}
        <div
          className={`flex-1 p-6 ${
            darkMode ? "bg-gray-700 text-white" : "bg-blue-50 text-black"
          } bg-opacity-60 mt-0 overflow-y-auto print:mt-0 print:p-0 print:bg-white print:text-black`}
        >
          {/* <Breadcrumb pageName={currentTab} /> */}
          {currentTab === "Dashboard" && <Dashboard />}
          {currentTab === "Teachers" && <Teacher />}
          {currentTab === "Students" && <Student />}
          {currentTab === "Parents" && <Parent />}
          {currentTab === "Public" && <Public />}
          {/* {currentTab === "Branches" && <Branches />} */}
          {currentTab === "Events" && <Events />}
          {currentTab === "Settings" && (
            <AdminSettings
              previousTab={previousTab}
              setCurrentTab={handleTabChange}
              adminData={adminData}
              setAdminData={setAdminData}
            />
          )}
          {currentTab === "SpecialED" && <SpecialED />}
          {currentTab === "FAQ" && <Faq />}
          {/* {currentTab === "Messages" && <Messages />} */}
        </div>
      </div>
    </div>
  );
}

export default AdminInterface;
