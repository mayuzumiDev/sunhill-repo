import React from "react";

const DeleteSuccessAlert = ({ userType }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="px-6 py-4 bg-green-50 border border-green-400 rounded-lg text-green-500">
        {userType} account deletion complete.
      </div>
    </div>
  );
};

export default DeleteSuccessAlert;
