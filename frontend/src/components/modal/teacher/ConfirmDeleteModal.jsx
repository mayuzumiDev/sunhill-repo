import React from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-700 mb-3 text-center">
          {title}
        </h2>
        <p className="mb-4 text-gray-700 text-center">{message}</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold bg-gray-200 rounded hover:bg-gray-300"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
