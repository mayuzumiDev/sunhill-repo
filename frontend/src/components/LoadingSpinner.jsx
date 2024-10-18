import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-blue-500 font-bold mt-4">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
