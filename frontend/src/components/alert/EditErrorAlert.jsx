import React from "react";

const EditErrorAlert = ({ userType, userData }) => {
  const userID = userData?.user_id;
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="px-6 py-4 bg-red-50 border border-red-400 rounded-lg text-red-500">
        {userType} <span className="font-bold">ID {userID}</span> updated
        failed.
      </div>
    </div>
  );
};

export default EditErrorAlert;
