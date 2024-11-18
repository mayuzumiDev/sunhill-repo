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

const PhotoUpload = ({ adminData, refreshAdminData }) => {
  const [profileImage, setProfileImage] = useState(userThree);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [imageError, setImageError] = useState(false);

  const fetchProfileImage = async () => {
    try {
      const response = await axiosInstance.get('/user-admin/user-info/profile-image/');
      console.log('Profile image response:', response.data);
      
      if (response.data.profile_image) {
        setProfileImage(response.data.profile_image);
        setImageError(false);
      } else {
        console.log('No profile image found, using default');
        setProfileImage(userThree);
      }
    } catch (err) {
      console.error('Error fetching profile image:', err);
      setImageError(true);
      setProfileImage(userThree);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  useEffect(() => {
    if (adminData?.user_info?.profile_image) {
      setProfileImage(adminData.user_info.profile_image);
      setImageError(false);
    } else {
      setProfileImage(userThree);
    }
  }, [adminData]);

  // Clear messages after 5 seconds
  useEffect(() => {
    let timer;
    if (message || error) {
      timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        console.log('Starting image upload...');
        setLoading(true);
        setError('');
        setMessage('');
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.error('File size exceeds 5MB limit');
          setError("File size should not exceed 5MB");
          setLoading(false);
          return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          console.error('Invalid file type:', file.type);
          setError("Please upload a valid image file (JPEG, PNG, or GIF)");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('profile_image', file);

        console.log('Sending image upload request...');
        const response = await axiosInstance.patch(
          '/user-admin/user-info/profile-image/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Upload response:', response.data);

        if (response.data.profile_image) {
          console.log('Profile image updated successfully:', response.data.profile_image);
          setMessage('Profile image updated successfully!');
          setProfileImage(response.data.profile_image);
          
          // Dispatch event for profile image update
          console.log('Dispatching profile image update event...');
          dispatchProfileImageUpdate(response.data.profile_image);
          
          // Refresh admin data
          try {
            console.log('Refreshing admin data...');
            const adminResponse = await axiosInstance.get('/user-admin/current-admin/');
            if (refreshAdminData) {
              refreshAdminData(adminResponse.data);
            }
          } catch (err) {
            console.error('Error refreshing admin data:', err);
          }
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        setError(err.response?.data?.error || 'Failed to upload image');
        setProfileImage(userThree);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const response = await axiosInstance.delete('/user-admin/user-info/profile-image/');

      if (response.status === 200) {
        setProfileImage(userThree);
        setMessage('Profile image deleted successfully!');
        
        // Dispatch event for profile image deletion
        dispatchProfileImageUpdate(null);
        
        // Refresh admin data
        try {
          const adminResponse = await axiosInstance.get('/user-admin/current-admin/');
          if (refreshAdminData) {
            refreshAdminData(adminResponse.data);
          }
        } catch (err) {
          console.error('Error refreshing admin data:', err);
        }
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err.response?.data?.error || 'Failed to delete image');
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
                  src={imageError ? userThree : profileImage}
                  alt="User"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    setImageError(true);
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
                  onChange={handleImageUpload}
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
              onChange={handleImageUpload}
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
