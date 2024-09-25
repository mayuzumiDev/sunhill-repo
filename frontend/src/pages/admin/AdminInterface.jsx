import React, { useState } from "react";
import SideNavbar from "../../components/admin/SideNavbar";
import TopNavbar from "../../components/admin/TopNavbar";
import Dashboard from "./Dashboard";
import CreateAccount from "./CreateAccount";
import Student from "./manage_accounts/Student";
import Teacher from "./manage_accounts/Teacher";
import Parent from "./manage_accounts/Parent";
import Public from "./manage_accounts/Public";
import AdminSettings from "./AdminSettings";
import AdminLogout from "../../components/admin/Logout";

function AdminInterface() {
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <div className="flex">
      <div className="w-screen fixed top-0 left-0 z-10">
        <TopNavbar
          setCurrentTab={setCurrentTab}
          setShowLogoutDialog={setShowLogoutDialog}
        />
        {showLogoutDialog && (
          <AdminLogout onClose={() => setShowLogoutDialog(false)} />
        )}
      </div>
      <div className="w-64 h-screen">
        <SideNavbar setCurrentTab={setCurrentTab} />
      </div>
      <div className="flex-1 ml-6 mt-16 p-6">
        {currentTab === "Dashboard" && <Dashboard />}
        {currentTab === "Create Account" && <CreateAccount />}
        {currentTab === "Manage Student" && <Student />}
        {currentTab === "Manage Teacher" && <Teacher />}
        {currentTab === "Manage Parent" && <Parent />}
        {currentTab === "Manage Public" && <Public />}
        {currentTab === "Settings" && <AdminSettings />}
      </div>
    </div>
  );
}

export default AdminInterface;
