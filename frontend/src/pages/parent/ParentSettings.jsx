import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaImage, FaLock, FaBell, FaLanguage, FaToggleOn, FaToggleOff, FaSave, FaExclamationTriangle } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';

const ParentSettings = ({ darkMode }) => {
  const [parentInfo, setParentInfo] = useState({
    name: '',
    email: '',
    phone: '',
    profilePic: null,
    language: 'English',
    notificationsEnabled: true,
    twoFactorEnabled: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchParentInfo();
  }, []);

  const fetchParentInfo = async () => {
    setIsLoading(true);
    try {
      // Simulating API call
      const response = await new Promise(resolve => setTimeout(() => resolve({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        profilePic: '/path-to-default-image.jpg',
        language: 'English',
        notificationsEnabled: true,
        twoFactorEnabled: false
      }), 1000));
      setParentInfo(response);
    } catch (error) {
      toast.error('Failed to fetch parent information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParentInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setParentInfo(prevInfo => ({
          ...prevInfo,
          profilePic: reader.result
        }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleChange = (field) => {
    setParentInfo(prevInfo => ({
      ...prevInfo,
      [field]: !prevInfo[field]
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings updated successfully');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-orange-600">Parent Settings</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4 sm:mb-6">
          <label htmlFor="profilePic" className="block mb-2 text-orange-600">
            <FaImage className="inline mr-2" />
            Profile Picture
          </label>
          <div className="flex flex-col sm:flex-row items-center">
            <img
              src={parentInfo.profilePic}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-2 sm:mb-0 sm:mr-4 border-2 border-orange-400"
            />
            <label htmlFor="profilePicInput" className={`cursor-pointer px-4 py-2 rounded ${darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'} text-white`}>
              Change Picture
            </label>
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-orange-600">
            <FaUser className="inline mr-2" />
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={parentInfo.name}
            onChange={handleInputChange}
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-orange-100 text-gray-800'} border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-orange-600">
            <FaEnvelope className="inline mr-2" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={parentInfo.email}
            onChange={handleInputChange}
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-orange-100 text-gray-800'} border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2 text-orange-600">
            <FaPhone className="inline mr-2" />
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={parentInfo.phone}
            onChange={handleInputChange}
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-orange-100 text-gray-800'} border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="language" className="block mb-2 text-orange-600">
            <FaLanguage className="inline mr-2" />
            Language
          </label>
          <select
            id="language"
            name="language"
            value={parentInfo.language}
            onChange={handleInputChange}
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-orange-100 text-gray-800'} border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <label htmlFor="notifications" className="text-orange-600 mb-2 sm:mb-0">
            <FaBell className="inline mr-2" />
            Enable Notifications
          </label>
          <button
            type="button"
            onClick={() => handleToggleChange('notificationsEnabled')}
            className={`p-2 rounded transition-colors duration-200 ${parentInfo.notificationsEnabled ? 'bg-orange-500' : 'bg-gray-400'}`}
          >
            {parentInfo.notificationsEnabled ? <FaToggleOn className="text-white text-2xl" /> : <FaToggleOff className="text-white text-2xl" />}
          </button>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <label htmlFor="twoFactor" className="text-orange-600 mb-2 sm:mb-0">
            <FaLock className="inline mr-2" />
            Enable Two-Factor Authentication
          </label>
          <button
            type="button"
            onClick={() => handleToggleChange('twoFactorEnabled')}
            className={`p-2 rounded transition-colors duration-200 ${parentInfo.twoFactorEnabled ? 'bg-orange-500' : 'bg-gray-400'}`}
          >
            {parentInfo.twoFactorEnabled ? <FaToggleOn className="text-white text-2xl" /> : <FaToggleOff className="text-white text-2xl" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!hasChanges || isLoading}
          className={`mt-4 px-4 py-2 rounded flex items-center justify-center w-full ${
            hasChanges && !isLoading
              ? darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white transition-colors duration-200`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <FaSave className="mr-2" />
          )}
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {hasChanges && (
        <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <FaExclamationTriangle className="inline mr-2" />
          You have unsaved changes. Don't forget to save!
        </div>
      )}
    </div>
  );
};

export default ParentSettings;
