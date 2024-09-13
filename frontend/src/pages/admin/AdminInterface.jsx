import React, { useState } from "react";
import SideNavbar from "../../components/admin/SideNavbar";
import TopNavbar from "../../components/admin/TopNavbar";
import Dashboard from "../admin/Dashboard";
import CreateAccount from "./CreateAccount";

const items = [
  { id: 1, name: "Dashboard", tab: "dashboard" },
  { id: 2, name: "Create Account", tab: "create-account" },
];

function AdminInterface() {
  const [currentTab, setCurrentTab] = useState("dashboard");

  const handleSideBarClick = (tab) => {
    setCurrentTab(tab);
  };

  const renderTab = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard />;
      case "create-account":
        return <CreateAccount />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <div className="w-screen fixed top-0 left-0">
        <TopNavbar />
      </div>
      <SideNavbar items={items} onSidebarClick={handleSideBarClick} />
      <main className="flex-1">{renderTab()}</main>
    </div>
  );
}

export default AdminInterface;
