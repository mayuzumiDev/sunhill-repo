import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faUser } from "@fortawesome/free-solid-svg-icons";

const PhotoUpload = () => {
  const [profileImage, setProfileImage] = useState();

  const handleImageUpload = () => {};

  const handleImageDelete = () => {};

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
        <h3 className="font-bold text-gray-700">Your Photo</h3>
      </div>
      <div className="p-7">
        <form action="#">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="User"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-12 w-12 text-gray-400"
                />
              )}
            </div>
            <div>
              <span className="mb-1.5 font-bold text-gray-700">
                Edit your photo
              </span>
              <span className="flex gap-2.5">
                <button
                  className="text-sm text-red-500 cursor-pointer hover:underline"
                  onClick={handleImageDelete}
                >
                  Delete
                </button>
              </span>
            </div>
          </div>

          <div
            id="FileUpload"
            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
              onChange={handleImageUpload}
            />
            <div className="flex flex-col text-gray-400 items-center justify-center space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white">
                <FontAwesomeIcon icon={faUpload} />
              </span>
              <span className="text-sm font-bold">Upload your photo</span>
              <span className="text-xs">Supported formats: JPEG, PNG, GIF</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoUpload;
