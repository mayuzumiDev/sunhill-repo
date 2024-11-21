import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaRocket, FaStar, FaCheckCircle, FaGamepad, FaVideo, FaComments } from 'react-icons/fa';

const TutorialModal = ({ step, onNext, onClose, isLastStep }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top = rect.bottom + window.scrollY + 20;
      let left = rect.left + window.scrollX + 20; // Added 20px to move the box slightly to the right

      // Adjust top position if modal would go off-screen
      if (top + 250 > viewportHeight) {
        top = rect.top + window.scrollY - 260;
      }

      // Adjust left position if modal would go off-screen
      if (left + 320 > viewportWidth) {
        left = Math.max(40, viewportWidth - 340); // Increased left margin by 20px
      }

      // Center modal for small screens
      if (viewportWidth < 768) {
        top = Math.max(20, (viewportHeight - 280) / 2);
        left = Math.max(40, (viewportWidth - 320) / 2); // Increased left margin by 20px
      }

      setPosition({ top, left });
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetElement.classList.add('tutorial-highlight');
    }

    return () => {
      const prevTarget = document.querySelector('.tutorial-highlight');
      if (prevTarget) prevTarget.classList.remove('tutorial-highlight');
    };
  }, [step]);

  const getIcon = (title) => {
    switch (title) {
      case 'Welcome, Sunhillians!':
      case 'Blast Off to Knowledge!':
      case 'Wormholes to New Dimension': return FaRocket;
      case 'Cosmic Video Theater': return FaVideo;
      case 'Intergalactic Game Arena': return FaGamepad;
      case 'Alien Chat Room': return FaComments;
      case 'Mission Control Center': return FaCheckCircle;
      case 'Your Galactic Journey': return FaStar;
      default: return FaStar;
    }
  };

  const Icon = getIcon(step.title);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`tutorial-step-${step.title}`}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        key={`tutorial-modal-${step.title}`}
        className="fixed z-50 bg-white p-4 md:p-5 rounded-lg shadow-lg w-[90%] md:w-auto md:max-w-[320px] mx-auto md:mx-0"
        style={{ top: position.top, left: position.left }}
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      >
        <motion.div className="mb-3 text-2xl md:text-4xl text-purple-600" initial={{ rotateY: 0 }} animate={{ rotateY: 360 }} transition={{ duration: 1, delay: 0.2 }}>
          <Icon />
        </motion.div>
        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-purple-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{step.title}</h3>
        <p className="mb-3 md:mb-4 text-gray-700 text-sm md:text-base" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{step.text}</p>
        <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-3 mt-4">
          <motion.button
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-base md:text-lg font-bold hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            onClick={onNext}
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLastStep ? "Finish" : "Next"} <FaArrowRight className="ml-2" />
          </motion.button>
          <motion.button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-base md:text-lg font-bold hover:bg-gray-400 transition duration-300 flex items-center justify-center"
            onClick={onClose}
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialModal;
