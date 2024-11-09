import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const TableSearchBar = () => {
  return (
    <div className="relative text-gray-600">
      <input
        type="search"
        name="search"
        placeholder="Search..."
        className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none border border-gray-300 
                   focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-300"
      />
      <button type="submit" className="absolute right-0 top-0 mt-2 mr-4">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="h-4 w-4 text-gray-600"
        />
      </button>
    </div>
  );
};

export default TableSearchBar;
