import React, { useCallback } from "react";

const TopNavbar = ({ setShowLogoutDialog, currentTab, setCurrentTab }) => {
  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
      }
    },
    [setCurrentTab, currentTab]
  );

  return (
    <nav className="bg-white- px-4 py-3 flex justify-start ml-64 shadow-sm">
      <div className="flex items-center gap-x-5 ml-auto">
        <span className="text-gray-700 text-sm font-semibold font-montserrat">
          Welcome, Admin
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleTabClick("Settings");
          }}
          className="text-gray-700  font-bold font-montserrat"
        >
          Settings
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowLogoutDialog(true);
          }}
          className="text-gray-700  font-bold font-montserrat"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TopNavbar;
