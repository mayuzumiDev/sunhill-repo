import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import userThree from '../../../assets/img/home/unknown.jpg';

// Create a custom event for profile image updates
export const PROFILE_IMAGE_UPDATED = 'profileImageUpdated';

// Helper function to dispatch the profile image update event
const dispatchProfileImageUpdate = (imageUrl) => {
  const event = new CustomEvent(PROFILE_IMAGE_UPDATED, { 
    detail: { profileImage: imageUrl } 
  });
  window.dispatchEvent(event);
};

const PhotoUpload = ({ parentData, refreshParentData, onImageUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(
    parentData?.user_info?.profile_image || userThree
  );

  // Update profile image when parentData changes
  useEffect(() => {
    if (parentData?.user_info?.profile_image) {
      setProfileImage(parentData.user_info.profile_image);
    }
  }, [parentData]);

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB");
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage("");

      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await axiosInstance.patch(
        '/api/user-parent/user-info/profile-image/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Profile image update response:', response);

      if (response.data && response.data.profile_image) {
        const imageUrl = response.data.profile_image;
        setProfileImage(imageUrl);
        setMessage(response.data.message || 'Profile image updated successfully!');
        
        // Update parent component
        if (onImageUpdate) {
          onImageUpdate(imageUrl);
        }
        
        // Refresh parent data
        if (refreshParentData) {
          await refreshParentData();
        }
      } else {
        throw new Error(response.data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.error || error.message || 'Failed to upload image');
      setProfileImage(userThree);
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage("");

      const response = await axiosInstance.delete('/api/user-parent/user-info/profile-image/');

      if (response.data.message) {
        setProfileImage(userThree);
        setMessage(response.data.message);
        
        // Update parent component
        if (onImageUpdate) {
          onImageUpdate(null);
        }
        
        // Refresh parent data
        if (refreshParentData) {
          await refreshParentData();
        }
      } else {
        throw new Error(response.data.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
        <h3 className="font-medium text-black">Your Photo</h3>
      </div>
      <div className="p-7">
        {message && <div className="text-green-500 mb-4">{message}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-14 w-14 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              ) : (
                <img
                  src={profileImage}
                  alt="User"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    setProfileImage(userThree);
                    e.target.src = userThree;
                  }}
                />
              )}
            </div>
            <div>
              <span className="mb-1.5 text-xs sm:text-sm inline-block font-medium text-black">
                Edit your photo
              </span>
              <span className="flex gap-2.5">
                <button
                  type="button"
                  className="text-xs sm:text-sm text-red-500 cursor-pointer hover:underline"
                  onClick={handleImageDelete}
                  disabled={loading || profileImage === userThree}
                >
                  Delete
                </button>
                <label
                  className="text-xs sm:text-sm text-blue-500 cursor-pointer hover:underline"
                  htmlFor="profileImageUpload"
                >
                  Update
                </label>
                <input
                  id="profileImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  disabled={loading}
                />
              </span>
            </div>
          </div>

          <div
            id="FileUpload"
            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              disabled={loading}
            />
            <div className="flex flex-col text-gray-400 items-center justify-center space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white">
                <FontAwesomeIcon icon={faUpload} />
              </span>
              <span className="text-xs sm:text-sm  font-medium">Upload your photo</span>
              <span className="text-xs sm:text-sm">Supported formats: JPEG, PNG, GIF</span>
              <span className="text-xs sm:text-sm">Maximum size: 5MB</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoUpload;
