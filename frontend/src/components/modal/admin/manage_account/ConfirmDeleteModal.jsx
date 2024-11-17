import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import SlimyTigerLoader from "../../../loaders/SlimyTigerLoader";

function ConfirmDeleteModal({ title, onConfirm, onCancel }) {
  const [isLoading, setIsloading] = useState(false);

  const handleConfirm = async () => {
    setIsloading(true);
    await onConfirm();
    setIsloading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-20" />

      <div className="bg-white p-4 rounded-lg shadow-xl relative max-w-sm">
        <div className="p-6  text-center">
          {!isLoading && (
            <>
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="w-20 h-20 text-red-600 mx-auto"
              />
            </>
          )}
          {isLoading && (
            <div className="mt-5">
              <SlimyTigerLoader />
            </div>
          )}

          <h3 className="text-xl font-normal text-gray-800 mt-5 mb-6">
            {title}
          </h3>
          <a
            href="#"
            onClick={handleConfirm}
            className="text-white bg-red-600 hover:bg-red-800 font-bold rounded-lg text-base inline-flex items-center px-7 py-2.5 text-center mr-2"
          >
            Yes
          </a>
          <a
            href="#"
            onClick={onCancel}
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 font-bold inline-flex items-center rounded-lg text-base px-7 py-2.5 text-center"
          >
            No
          </a>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
