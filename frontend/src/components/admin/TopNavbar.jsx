import React from "react";

const TopNavbar = () => {
  return (
    <nav className="bg-gray-200 px-4 py-3 flex justify-between ml-64">
      <div className="flex items-center text-xl">
        <span className="text-black font-semibold font-montserrat">Admin</span>
      </div>
      <div className="flex items-center gap-x-5">
        <button>Settings</button>
        <button>Logout</button>
      </div>
    </nav>
  );
};

export default TopNavbar;
