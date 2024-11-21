import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import userThree from '../../assets/img/home/unknown.jpg';

const StudentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(userThree);
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    username: "",
    gradeLevel: "",
    section: "",
    branch_name: ""
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axiosInstance.get("/user-student/profile/");
        console.log('Student profile response:', response.data);
        
        if (!response.data.student_profile) {
          throw new Error('No student profile data received');
        }
        
        const userData = response.data.student_profile;
        setFormData({
          fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          phoneNumber: userData.student_info?.contact_no || '',
          emailAddress: userData.email || '',
          username: userData.username || '',
          gradeLevel: userData.student_info?.grade_level || '',
          branch_name: userData.branch_name || ''
        });
        
        setImageError(false);
        if (userData.student_info?.profile_image) {
          const imageUrl = userData.student_info.profile_image;
          let fullImageUrl;
          if (imageUrl.startsWith('http')) {
            fullImageUrl = imageUrl;
          } else {
            fullImageUrl = `${import.meta.env.VITE_API_URL}${imageUrl}`;
          }
          setProfileImage(fullImageUrl);
        } else {
          setProfileImage(userThree);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Oops! Something went wrong while loading your profile. Please try again!');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const updateData = {
        first_name: firstName,
        last_name: lastName,
        phone_number: formData.phoneNumber,
        email: formData.emailAddress,
        username: formData.username
      };

      await axiosInstance.patch('/user-student/profile/', updateData);
      setMessage('Yay! Your profile has been updated! 🎉');
      
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (err) {
      setError('Oops! Something went wrong. Please try again! 😕');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setError('');
        const formData = new FormData();
        formData.append('profile_image', file);

        const response = await axiosInstance.post('/user-student/profile/image/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.image_url) {
          setProfileImage(response.data.image_url);
          setMessage('Cool new profile picture! 😎');
          
          setTimeout(() => {
            setMessage('');
          }, 3000);
        }
      } catch (err) {
        setError('Oops! Could not upload your picture. Try again! 📸');
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      setError('');
      const response = await axiosInstance.delete('/user-student/profile/image/');
      
      if (response.status === 200) {
        setProfileImage(userThree);
        setMessage('Profile picture removed! 🗑️');
        
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setError('Could not remove the picture. Try again! 😅');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-bounce text-2xl">🎮 Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto max-w-270">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Profile Info Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-3"
        >
          <div className="rounded-lg border-2 border-blue-200 bg-white shadow-lg">
            <div className="border-b-2 border-blue-200 py-4 px-7">
              <h3 className="font-bold text-2xl text-blue-600">My Profile 📚</h3>
            </div>
            <div className="p-7">
              {message && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-medium"
                >
                  {message}
                </motion.div>
              )}
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        My Name 😊
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Phone Number 📱
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Email and Username */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Email Address 📧
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Username 🎮
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200"
                      required
                    />
                  </div>

                  {/* Grade Level and Section (Read-only) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Grade Level 📚
                      </label>
                      <input
                        type="text"
                        value={formData.gradeLevel}
                        className="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-200"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Section 🏫
                      </label>
                      <input
                        type="text"
                        value={formData.section}
                        className="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-200"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-200"
                    >
                      Save Changes ✨
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Profile Picture Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <div className="rounded-lg border-2 border-blue-200 bg-white shadow-lg">
            <div className="border-b-2 border-blue-200 py-4 px-7">
              <h3 className="font-bold text-2xl text-blue-600">My Picture 📸</h3>
            </div>
            <div className="p-7">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      setImageError(true);
                      e.target.src = userThree;
                    }}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('profileImageUpload').click()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-200"
                  >
                    Change Picture 🖼️
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-200"
                  >
                    Remove 🗑️
                  </motion.button>
                </div>
                
                <input
                  id="profileImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <div className="text-center text-gray-600">
                  <p>Upload a nice picture of yourself! 😊</p>
                  <p className="text-sm">Supported: JPEG, PNG, GIF</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentSettings;