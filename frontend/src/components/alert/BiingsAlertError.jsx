import React from "react";

const BiingsAlertError = ({ userType }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="px-6 py-4 bg-red-50 border border-red-400 rounded-lg text-red-500">
        An <span className="font-bold">error</span> occurred while creating{" "}
        {userType} accounts.
      </div>
    </div>
  );
};

export default BiingsAlertError;
