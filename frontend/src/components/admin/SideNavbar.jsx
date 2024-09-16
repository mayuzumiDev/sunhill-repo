import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

const options = [
  { value: "Student", label: "Student" },
  { value: "Teacher", label: "Teacher" },
  { value: "Parent", label: "Parent" },
  { value: "Public", label: "Public" },
];

const SideNavbar = ({ setCurrentTab }) => {
  const handleTabClick = useCallback(
    (tab) => {
      setCurrentTab(tab);
    },
    [setCurrentTab]
  );

  const handleSelectChange = (selectedOption) => {
    handleTabClick(selectedOption.value);
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
            <Link className="block text-based text-gray-700 font-bold font-montserrat py-2.5 px-4 rounded ">
              Manage Accounts
            </Link>
          </li>
          <li>
            <Select
              options={options}
              onChange={handleSelectChange}
              placeholder="Select User Type"
              styles={{
                menu: (provided) => ({
                  ...provided,
                  width: "14rem",
                  textAlign: "center",
                }),
              }}
              className="text-based text-gray-700 font-bold font-montserrat  px-4"
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;
