import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const SideNavbar = ({ currentTab, setCurrentTab }) => {
  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
      }
    },
    [setCurrentTab, currentTab]
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const handleToggleMenu = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMouseOver = () => {
    setShowDropdown(true);
  };

  const handleMouseOut = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 1500);
  };

  return (
    <div className="w-64 h-screen bg-white text-gray-700 shadow">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-xl text-gray-700 font-bold font-montserrat">
          Sunhill LMS
        </h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <Link
              to="/admin/"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("Dashboard");
              }}
              className="block text-based text-gray-700 font-bold font-montserrat py-2.5 px-4 rounded "
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/create-account/"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("Create Account");
              }}
              className="block text-based text-gray-700 font-bold font-montserrat py-2.5 px-4 rounded "
            >
              Create Account
            </Link>
          </li>
          <li>
            <Link
              className="block text-based text-gray-700 font-bold font-montserrat py-2.5 px-4 rounded"
              onClick={handleToggleMenu}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Manage Accounts
              <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
            </Link>
            {showDropdown && (
              <div
                className="absolute bg-white shadow-md p-4 w-48 ml-6 rounded"
                id="dropdown-menu"
              >
                <ul>
                  <li className="text-based text-gray-700 font-bold font-montserrat py-2.5 px-4">
                    <Link
                      to="/admin/manage-accounts/student/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick("Manage Student");
                      }}
                    >
                      Student
                    </Link>
                  </li>
                  <li className="text-based text-gray-700 font-bold font-montserrat py-2.5 px-4">
                    <Link
                      to="/admin/manage-accounts/teacher/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick("Manage Teacher");
                      }}
                    >
                      Teacher
                    </Link>
                  </li>
                  <li className="text-based text-gray-700 font-bold font-montserrat py-2.5 px-4">
                    <Link
                      to="/admin/manage-accounts/parent/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick("Manage Parent");
                      }}
                    >
                      Parent
                    </Link>
                  </li>
                  <li className="text-based text-gray-700 font-bold font-montserrat py-2.5 px-4">
                    <Link
                      to="/admin/manage-accounts/public/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick("Manage Public");
                      }}
                    >
                      Public
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;
