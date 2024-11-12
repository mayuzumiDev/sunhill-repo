import React from "react";

const EditSuccessAlert = ({ userType, userData }) => {
  const userID = userData?.id;
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="px-6 py-4 bg-green-50 border border-green-400 rounded-lg text-green-500">
        {userType} <span className="font-bold">ID {userID}</span> updated
        successfully.
      </div>
    </div>
  );
};

export default EditSuccessAlert;
