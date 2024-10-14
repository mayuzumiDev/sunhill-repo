import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaCamera, FaTrophy, FaRocket, FaStar, FaSpaceShuttle, FaPlus, FaTrash, FaMedal, FaCertificate, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const StudentProfile = ({ student, onUpdateProfile, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');
  const [achievementType, setAchievementType] = useState('trophy');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setEditedStudent(student);
  }, [student]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    onUpdateProfile(editedStudent);
    setIsEditing(false);
    showNotification('Profile updated successfully!', 'success');
  };

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedStudent({ ...editedStudent, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim() !== '') {
      setEditedStudent({
        ...editedStudent,
        achievements: [...editedStudent.achievements, { text: newAchievement.trim(), type: achievementType }]
      });
      setNewAchievement('');
      setShowAchievementForm(false);
      showNotification('Achievement added!', 'success');
    }
  };

  const handleRemoveAchievement = (index) => {
    const updatedAchievements = editedStudent.achievements.filter((_, i) => i !== index);
    setEditedStudent({ ...editedStudent, achievements: updatedAchievements });
    showNotification('Achievement removed', 'info');
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'trophy': return FaTrophy;
      case 'medal': return FaMedal;
      case 'certificate': return FaCertificate;
      default: return FaStar;
    }
  };

  const getRandomSpaceIcon = () => {
    const icons = [FaRocket, FaStar, FaSpaceShuttle];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExit = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={handleExit}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 w-full max-w-6xl p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl relative"
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleExit}
            className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors duration-200"
          >
            <FaTimes className="text-2xl" />
          </button>

          {notification && (
            <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              {notification.message}
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>My Profile</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative mb-4"
              >
                <img
                  src={editedStudent.profilePicture}
                  alt={editedStudent.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-yellow-300 shadow-lg object-cover"
                />
                {isEditing && (
                  <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 cursor-pointer hover:bg-yellow-300 transition-colors duration-200">
                    <FaCamera className="text-purple-600 text-xl" />
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </motion.div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedStudent.name}
                  onChange={handleChange}
                  className="text-xl sm:text-2xl font-semibold mb-2 text-center border-b-2 border-yellow-300 bg-transparent text-white placeholder-white w-full"
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  placeholder="Your Name"
                />
              ) : (
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{editedStudent.name}</h3>
              )}
              {isEditing ? (
                <input
                  type="text"
                  name="grade"
                  value={editedStudent.grade}
                  onChange={handleChange}
                  className="text-lg mb-1 text-center border-b-2 border-yellow-300 bg-transparent text-white placeholder-white w-full"
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  placeholder="Grade"
                />
              ) : (
                <p className="text-lg text-white mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Grade: {editedStudent.grade}</p>
              )}
            </div>

            <div className="w-full md:w-2/3">
              <h4 className="text-xl sm:text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                <FaTrophy className="inline-block mr-2 text-yellow-300" />
                Achievements
              </h4>
              <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                <AnimatePresence>
                  {editedStudent.achievements.map((achievement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between text-white text-base sm:text-lg"
                      style={{ fontFamily: 'Comic Sans MS, cursive' }}
                    >
                      <span className="flex items-center">
                        {React.createElement(getAchievementIcon(achievement.type), { className: "mr-2 text-yellow-300 text-xl" })}
                        {achievement.text}
                      </span>
                      {isEditing && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveAchievement(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTrash />
                        </motion.button>
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              {isEditing && (
                <div className="mt-4">
                  <AnimatePresence>
                    {showAchievementForm ? (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col sm:flex-row items-center gap-2"
                      >
                        <input
                          type="text"
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          className="flex-grow p-2 rounded-lg bg-white text-purple-600 w-full text-base"
                          placeholder="Enter new achievement"
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        />
                        <select
                          value={achievementType}
                          onChange={(e) => setAchievementType(e.target.value)}
                          className="p-2 rounded-lg bg-white text-purple-600 text-base"
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        >
                          <option value="trophy">Trophy</option>
                          <option value="medal">Medal</option>
                          <option value="certificate">Certificate</option>
                        </select>
                        <button
                          onClick={handleAddAchievement}
                          className="bg-yellow-400 text-purple-600 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors duration-200 w-full sm:w-auto text-base font-semibold"
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        >
                          Add
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onClick={() => setShowAchievementForm(true)}
                        className="bg-yellow-400 text-purple-600 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto text-base font-semibold"
                        style={{ fontFamily: 'Comic Sans MS, cursive' }}
                      >
                        <FaPlus className="mr-2" /> Add New Achievement
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
              whileTap={{ scale: 0.95 }}
              onClick={isEditing ? handleSave : handleEdit}
              className={`${
                isEditing ? 'bg-green-500' : 'bg-yellow-400'
              } text-white px-6 py-3 rounded-full flex items-center text-lg font-bold shadow-lg`}
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              {isEditing ? (
                <>
                  <FaSave className="mr-2 text-xl" /> Save Profile
                </>
              ) : (
                <>
                  <FaEdit className="mr-2 text-xl" /> Edit Profile
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentProfile;
