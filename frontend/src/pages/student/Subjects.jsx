import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalculator, FaBook, FaFlask, FaPalette, FaGlobeAmericas, FaMusic, FaArrowLeft } from 'react-icons/fa';
import SubjectsInterface from './SubjectsInterface';


const SubjectTile = ({ title, icon, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-400 to-purple-500 p-4 sm:p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden flex items-center"
      whileHover={{ scale: 1.05, rotate: 2, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 50 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.1 }}
    >
      <motion.div 
        className="text-4xl sm:text-6xl text-white mr-4"
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <div className="flex-grow">
        <motion.div 
          className="text-lg sm:text-xl font-bold text-white"
          animate={{ y: isHovered ? -5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.div>
        <motion.div 
          className="text-sm text-white opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.75 }}
          transition={{ duration: 0.2 }}
        >
          Click to explore!
        </motion.div>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <motion.p 
              className="text-white text-lg font-bold"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              Let's Learn!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Subjects = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    { title: 'Math', icon: <FaCalculator className="text-yellow-300" />, path: '/student/math' },
    { title: 'Reading', icon: <FaBook className="text-green-300" />, path: '/student/reading' },
    { title: 'Science', icon: <FaFlask className="text-blue-300" />, path: '/student/science' },
    { title: 'Art', icon: <FaPalette className="text-pink-300" />, path: '/student/art' },
    { title: 'Social Studies', icon: <FaGlobeAmericas className="text-orange-300" />, path: '/student/social-studies' },
    { title: 'Music', icon: <FaMusic className="text-purple-300" />, path: '/student/music' },
  ];

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {selectedSubject ? (
          <motion.div
            key="subject-interface"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between mb-4">
              <motion.button
                className="py-2 px-4 bg-purple-500 text-white rounded-full text-sm sm:text-lg font-bold hover:bg-purple-600 transition duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToSubjects}
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              >
                <FaArrowLeft className="mr-2" /> 
                <span>Back to Subjects</span>
              </motion.button>
            </div>
            <SubjectsInterface subject={selectedSubject} />
          </motion.div>
        ) : (
          <motion.div
            key="subject-list"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex justify-between items-center mb-8"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <h1 className="text-4xl font-bold text-white text-left" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Subjects</h1>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {subjects.map((subject, index) => (
                <SubjectTile
                  key={subject.title}
                  title={subject.title}
                  icon={subject.icon}
                  onClick={() => handleSubjectClick(subject)}
                  index={index}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Subjects;
