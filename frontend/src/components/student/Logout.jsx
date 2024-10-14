import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaGraduationCap, FaBook, FaPencilAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout, onCancel }) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any additional logout logic here
    onLogout();
  };

  const handleExit = () => {
    onCancel();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg p-8 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-800 flex items-center">
              <FaGraduationCap className="mr-2" /> Ready to Take a Break?
            </h2>
            <button
              onClick={handleExit}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <p className="text-gray-600 mb-6 flex items-center">
            <FaBook className="mr-2 text-yellow-500" /> Great job on your studies today!
          </p>
          <div className="flex justify-center">
            <motion.button
              className="bg-yellow-400 text-purple-800 px-6 py-3 rounded-full text-xl font-bold shadow-lg flex items-center"
              whileHover={{ scale: 1.05, backgroundColor: '#fbbf24' }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              Log Out
              <motion.div
                className="ml-2"
                animate={{ rotate: isHovering ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaPencilAlt />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Logout;
