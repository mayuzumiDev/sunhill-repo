import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const SelectUserErrorAlert = () => {
  return (
    <div className="bg-red-200 text-red-800 border-l-4 border-red-600 px-6 py-3 rounded-md mb-4 shadow-lg flex items-center">
      <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 mr-3" />
      <span className="text-sm font-medium">
        <strong className="text-lg">ALERT!</strong> You need to select the
        user(s) before proceeding with deletion.
      </span>
    </div>
  );
};

export default SelectUserErrorAlert;
