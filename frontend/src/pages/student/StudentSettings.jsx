import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { axiosInstance } from "../../utils/axiosInstance";
import userThree from '../../assets/img/home/unknown.jpg';
import { FaCamera, FaStar, FaBook, FaUser, FaEnvelope, FaPhone, FaTree, FaTrash } from 'react-icons/fa';

const StudentSettings = ({ onProfileUpdate }) => {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(userThree);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    username: '',
    grade_level: '',
    branch_name: ''
  });

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching student data...');
      const response = await axiosInstance.get("/api/user-student/profile/");
      console.log('API Response:', response.data);
      
      if (response.status === 200) {
        const data = response.data.student_profile;
        console.log('Full API response:', response.data);
        console.log('Student profile data:', data);
        console.log('Student info:', data.student_info);
        setStudentData(data);
        
        setFormData({
          fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          phoneNumber: data.user_info?.contact_no || '',
          emailAddress: data.email || '',
          username: data.username || '',
          grade_level: data.grade_level || '',
          branch_name: data.branch_name || ''
        });

        if (data.user_info?.profile_image) {
          setProfileImage(data.user_info.profile_image);
        }
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to load student data";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      setIsLoading(true);
      setError('');
      
      const response = await axiosInstance.post('/api/user-student/profile/image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Profile image updated successfully');
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
        setMessage('Yay! Your new profile picture looks awesome! 🌟');
        // Update TopNav immediately
        onProfileUpdate && onProfileUpdate(prevState => !prevState);
      }
    } catch (err) {
      console.error('Error uploading profile image:', err);
      setError('Oops! Something went wrong with your picture. Try again! 🎨');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await axiosInstance.delete('/api/user-student/profile/image/');
      
      if (response.status === 200) {
        setProfileImage(userThree);
        setMessage('Profile picture removed successfully! 🗑️');
        // Update TopNav immediately
        onProfileUpdate && onProfileUpdate(prevState => !prevState);
      }
    } catch (err) {
      console.error('Error deleting profile image:', err);
      setError('Oops! Something went wrong while removing the picture. Try again! 🎨');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      const [firstName = '', lastName = ''] = formData.fullName.split(' ');

      const updateData = {
        first_name: firstName,
        last_name: lastName,
        email: formData.emailAddress,
        contact_no: formData.phoneNumber,
        username: formData.username,
        student_info: {
          grade_level: formData.grade_level
        },
        branch_name: formData.branch_name
      };

      console.log('Updating profile with data:', updateData);
      
      const response = await axiosInstance.patch('/api/user-student/profile/update/', updateData);
      
      if (response.status === 200) {
        setMessage('Woohoo! Your profile has been updated! 🎉');
        // Update TopNav immediately
        onProfileUpdate && onProfileUpdate(prevState => !prevState);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Oops! Something went wrong. Let\'s try again! 🌈');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-2 xs:p-3 sm:p-4 md:p-8 bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen">
        <div className="text-2xl font-bold text-purple-600 animate-bounce">
          Loading your awesome profile... 🌟
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-50 sm:min-h-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-2 xs:p-3 sm:p-4 md:p-8">
      <div className="max-w-5xl  sm:max-w-2xl mx-auto">
        <motion.div 
          className="bg-white backdrop-blur-lg bg-opacity-90 rounded-xl xs:rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl p-3 xs:p-4 sm:p-6 md:p-8 border-2 border-purple-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 xs:mb-6 md:mb-8"
          >
            ✨ My Profile ✨
          </motion.h1>

          {error && (
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-red-50 border-l-4 border-red-400 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl mb-3 xs:mb-4 sm:mb-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 text-xs xs:text-sm sm:text-base">❌</div>
                <div className="ml-2 xs:ml-3">
                  <p className="text-red-700 text-xs xs:text-sm sm:text-base">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {message && (
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-green-50 border-l-4 border-green-400 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl mb-3 xs:mb-4 sm:mb-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 text-xs xs:text-sm sm:text-base">✅</div>
                <div className="ml-2 xs:ml-3">
                  <p className="text-green-700 text-xs xs:text-sm sm:text-base">{message}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6 sm:space-y-8">
            {/* Profile Image Section */}
            <div className="flex justify-center mb-6 xs:mb-8 sm:mb-12">
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-purple-300 group-hover:border-pink-400 transition-all duration-300 shadow-xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = userThree;
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 xs:-bottom-3 xs:-right-3 sm:-bottom-4 sm:-right-4 flex gap-1 xs:gap-2 sm:gap-3">
                    <motion.button
                      type="button"
                      onClick={handleImageClick}
                      className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-2 xs:p-3 sm:p-4 rounded-full hover:shadow-lg transition-all duration-200"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <FaCamera className="text-base xs:text-lg sm:text-xl md:text-2xl" />
                    </motion.button>
                    {profileImage !== userThree && (
                      <motion.button
                        type="button"
                        onClick={handleDeleteImage}
                        className="bg-gradient-to-br from-red-500 to-pink-500 text-white p-2 xs:p-3 sm:p-4 rounded-full hover:shadow-lg transition-all duration-200"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                      >
                        <FaTrash className="text-base xs:text-lg sm:text-xl md:text-2xl" />
                      </motion.button>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
              {/* Full Name Field */}
              <motion.div 
                className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-yellow-100"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label className="flex items-center text-base xs:text-lg font-semibold text-yellow-800 mb-2 xs:mb-3">
                  <FaUser className="mr-2 xs:mr-3 text-yellow-600" /> My Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 text-base xs:text-lg bg-white bg-opacity-70"
                  placeholder="What's your name? 😊"
                />
              </motion.div>

              {/* Phone Number Field */}
              <motion.div 
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-emerald-100"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label className="flex items-center text-base xs:text-lg font-semibold text-emerald-800 mb-2 xs:mb-3">
                  <FaPhone className="mr-2 xs:mr-3 text-emerald-600" /> Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-100 text-base xs:text-lg bg-white bg-opacity-70"
                  placeholder="Your phone number 📱"
                />
              </motion.div>

              {/* Email Address Field */}
              <motion.div 
                className="bg-gradient-to-br from-sky-50 to-blue-50 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-sky-100"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label className="flex items-center text-base xs:text-lg font-semibold text-sky-800 mb-2 xs:mb-3">
                  <FaEnvelope className="mr-2 xs:mr-3 text-sky-600" /> Email Address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-100 text-base xs:text-lg bg-white bg-opacity-70"
                  placeholder="Your email 📧"
                />
              </motion.div>

              {/* Username Field */}
              <motion.div 
                className="bg-gradient-to-br from-violet-50 to-purple-50 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-violet-100"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label className="flex items-center text-base xs:text-lg font-semibold text-violet-800 mb-2 xs:mb-3">
                  <FaStar className="mr-2 xs:mr-3 text-violet-600" /> Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-violet-200 focus:border-violet-400 focus:ring focus:ring-violet-100 text-base xs:text-lg bg-white bg-opacity-70"
                  placeholder="Your username 🌟"
                />
              </motion.div>

              {/* Grade Level Field */}
              <motion.div 
                className="bg-gradient-to-br from-rose-50 to-pink-50 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-rose-100"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label className="flex items-center text-base xs:text-lg font-semibold text-rose-800 mb-2 xs:mb-3">
                  <FaBook className="mr-2 xs:mr-3 text-rose-600" /> Grade Level
                </label>
                <div className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-rose-200 bg-white bg-opacity-70 text-base xs:text-lg">
                  {formData.grade_level || 'Not Set Yet 📚'}
                </div>
              </motion.div>

              {/* Branch Field */}
              <motion.div 
                className="bg-gradient-to-br from-amber-50 to-yellow-50 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-amber-100"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label className="flex items-center text-base xs:text-lg font-semibold text-amber-800 mb-2 xs:mb-3">
                  <FaTree className="mr-2 xs:mr-3 text-amber-600" /> Branch
                </label>
                <input
                  type="text"
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={handleInputChange}
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:ring focus:ring-amber-100 text-base xs:text-lg bg-white bg-opacity-70"
                  placeholder="Your branch 🌳"
                />
              </motion.div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-6 xs:mt-8 sm:mt-10 md:mt-12">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="px-6 xs:px-8 sm:px-10 md:px-12 py-2 xs:py-3 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-base xs:text-lg sm:text-xl font-bold rounded-full shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? '🔄 Saving...' : '✨ Save Profile ✨'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentSettings;