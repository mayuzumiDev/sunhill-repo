import React, { useState, useEffect } from "react";
import SideNavbar from "../../components/parents/Sidebar";
import TopNavbar from "../../components/parents/TopNavbar";
import ParentDashboard from "./ParentDashboard";
import ViewStudents from "./ViewStudents";
import ViewQuizScores from "./ViewQuizScores";
import Messages from "./Messages";
import ParentSettings from "./ParentAccSettings";
import Logout from "../../components/Logout";
import Breadcrumb from "../../components/Breadcrumbs";
import { axiosInstance } from "../../utils/axiosInstance";

function ParentInterface() {
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const [previousTab, setPreviousTab] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [parentData, setParentData] = useState(null);

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/user-parent/current-parent/"
        );
        if (response.data.status === "success") {
          setParentData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };

    fetchParentData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024); // Open sidebar on larger screens
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

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
      {isSidebarOpen && (
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
      )}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
          window.innerWidth < 1024 && !isSidebarOpen
            ? "ml-0"
            : isSidebarOpen
            ? "ml-64"
            : "ml-20"
        }`}
      >
        <div className="flex-none">
          <TopNavbar
            setCurrentTab={handleTabChange}
            setShowLogoutDialog={setShowLogoutDialog}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            parentData={parentData}
          />
          {showLogoutDialog && (
            <Logout onClose={() => setShowLogoutDialog(false)} />
          )}
        </div>

        <div
          className={`flex-1 p-6 ${
            darkMode ? "bg-gray-700 text-white" : "bg-orange-100 text-black"
          } bg-opacity-60 mt-0 overflow-y-auto`}
        >
          {/* <Breadcrumb pageName={currentTab} /> */}
          {currentTab === "Dashboard" && (
            <ParentDashboard darkMode={darkMode} />
          )}
          {currentTab === "Students" && <ViewStudents darkMode={darkMode} />}
          {currentTab === "Scores" && <ViewQuizScores darkMode={darkMode} />}
          {/* {currentTab === "Messages" && <Messages darkMode={darkMode} />} */}
          {currentTab === "Settings" && (
            <ParentSettings
              previousTab={previousTab}
              setCurrentTab={handleTabChange}
              parentData={parentData}
              setParentData={setParentData}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentInterface;
