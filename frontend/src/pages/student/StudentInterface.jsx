import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/student/TopNav';
import Subjects from './Subjects';
import SpaceBG from '../../assets/img/home/space.png';
import TutorialModal from './TutorialModal';
import Uriel from '../../assets/img/home/uriel.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import '../../components/student/student.css';
import { FaPlay, FaVideo, FaGamepad, FaTasks, FaStar, FaClock, FaCalendarAlt, FaBook, FaPencilAlt, FaMusic, FaPalette, FaComments, FaRocket, FaLightbulb, FaPuzzlePiece, FaGraduationCap, FaHome, FaQuestionCircle, FaSpaceShuttle } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [xp, setXp] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todos, setTodos] = useState([
    { id: 1, text: 'Do Math', done: false },
    { id: 2, text: 'Read Story', done: false },
    { id: 3, text: 'Spell Words', done: false },
    { id: 4, text: 'Draw Picture', done: false },
    { id: 5, text: 'Learn Song', done: false },
  ]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const synth = useRef(window.speechSynthesis);
  const [showWelcome, setShowWelcome] = useState(true);
  const [encouragement, setEncouragement] = useState('');
  const tutorialSteps = [
    { title: "Welcome, Students!", text: "Get ready for a fun learning adventure on your Sunhill LMS!", target: ".container" },
    { title: "Start Learning", text: "Click here to begin your daily learning activities!", target: "#start-class-button" },
    { title: "Watch Videos", text: "Explore educational videos that teach you new things!", target: "#watch-video-button" },
    { title: "Play Games", text: "Enjoy interactive games that help you learn!", target: "#play-game-button" },
    { title: "Chat", text: "Connect with your classmates and share what you've learned!", target: "#chat-button" },
    { title: "To-Do List", text: "Keep track of your tasks and assignments here!", target: "#todo-list" },
    { title: "Your Progress", text: "View your learning progress and achievements!", target: "#progress-chart" },
    { title: "Subjects", text: "Explore different subjects and topics here!", target: ".grid-cols-2.sm\\:grid-cols-4" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setXp(prevXp => prevXp + 1);
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const welcomeMessage = "Welcome to Sunhill, young learners! Get ready for an amazing, out-of-this-world learning adventure!";
      speak(welcomeMessage);
      const timer = setTimeout(() => {
        setShowWelcome(false);
        setShowTutorial(true);
      }, 6000); // Increased duration to allow for sound effect and full speech
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  useEffect(() => {
    if (showTutorial && currentTutorialStep < tutorialSteps.length) {
      speak(tutorialSteps[currentTutorialStep].text);
    }
  }, [showTutorial, currentTutorialStep]);

  const speak = (text) => {
    synth.current.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices and choose a friendly-sounding one
    const voices = synth.current.getVoices();
    const friendlyVoice = voices.find(voice => voice.name.includes('Samantha') || voice.name.includes('Zira') || voice.name.includes('Google UK English Female'));
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    // Adjust speech parameters for a more engaging sound
    utterance.rate = 1.1; // Slightly faster
    utterance.pitch = 1.2; // Higher pitch for a more cheerful sound
    utterance.volume = 1; // Full volume

    // Add some variety and excitement to the voice
    const excitingWords = ['amazing', 'awesome', 'fantastic', 'incredible', 'super'];
    excitingWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      text = text.replace(regex, `<emphasis level="strong">${word}</emphasis>`);
    });
    utterance.text = text;

    synth.current.speak(utterance);
  };

  const nextTutorialStep = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(currentTutorialStep + 1);
      setEncouragement(encouragementPhrases[Math.floor(Math.random() * encouragementPhrases.length)]);
    } else {
      closeTutorial();
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setCurrentTutorialStep(0);
    synth.current.cancel();
    launchConfetti();
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleStartClass = () => {
    setXp(prevXp => prevXp + 10);
    setShowDashboard(false);
  };

  const handleWatchVideo = () => {
    setIsVideoPlaying(true);
    setXp(prevXp => prevXp + 5);
  };

  const handlePlayGame = () => {
    setIsGameActive(true);
    setXp(prevXp => prevXp + 5);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
    setXp(prevXp => prevXp + 2);
  };

  const handleSubjectClick = (subject) => {
    navigate(`/subjects/${subject.toLowerCase()}`);
  };

  const handleBackToDashboard = () => {
    setShowDashboard(true);
  };

  const student = {
    name: 'Uriel Fruelda',
    profilePicture: Uriel,
    grade: 'Grade 1',
    section: 'A',
    achievements: ['10 fun lessons done', 'Super Math Badge'],
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${SpaceBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      ></div>

      <TopNav student={student} onLogout={handleLogout} />
      <div className="container mx-auto relative z-10 pt-24 px-4 sm:px-6 md:px-8">
        {showDashboard ? (
          <>
            <motion.header 
              className="text-center text-white mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Welcome to {student.grade} Adventure!</h1>
              <p className="text-lg sm:text-xl mt-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Section {student.section} Explorers</p>
            </motion.header>

            <motion.div 
              className="bg-white p-4 rounded-3xl shadow-lg mb-8 flex flex-col sm:flex-row justify-between items-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center text-lg sm:text-xl text-purple-600 mb-2 sm:mb-0">
                <FaClock className="mr-2" />
                Time: {currentTime.toLocaleTimeString()}
              </div>
              <div className="flex items-center text-lg sm:text-xl text-blue-600">
                <FaCalendarAlt className="mr-2" />
                Today: {currentTime.toLocaleDateString()}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <motion.div 
                className="bg-white p-6 rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-purple-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Start Adventure</h2>
                <motion.button 
                  id="start-class-button"
                  className="w-full py-3 px-6 bg-green-500 text-white rounded-full text-lg font-bold hover:bg-green-600 transition duration-300 flex items-center justify-center"
                  onClick={handleStartClass}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  <FaRocket className="mr-2" /> Start Class!
                </motion.button>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-blue-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Video Time</h2>
                <motion.button 
                  id="watch-video-button"
                  className="w-full py-3 px-6 bg-blue-500 text-white rounded-full text-lg font-bold hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                  onClick={handleWatchVideo}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  <FaVideo className="mr-2" />Watch Video
                </motion.button>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-yellow-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Fun Games</h2>
                <motion.button 
                  id="play-game-button"
                  className="w-full py-3 px-6 bg-yellow-500 text-white rounded-full text-lg font-bold hover:bg-yellow-600 transition duration-300 flex items-center justify-center"
                  onClick={handlePlayGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  <FaGamepad className="mr-2" /> Play & Learn
                </motion.button>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-pink-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Chat</h2>
                <motion.button 
                  id="chat-button"
                  className="w-full py-3 px-6 bg-pink-500 text-white rounded-full text-lg font-bold hover:bg-pink-600 transition duration-300 flex items-center justify-center"
                  onClick={handleOpenChat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  <FaComments className="mr-2" /> Chat with classmates
                </motion.button>
              </motion.div>
            </div>

            {isVideoPlaying && (
              <motion.div 
                className="mb-8 p-6 bg-white rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-purple-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Magic Video</h3>
                <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Your video is playing!</p>
                <motion.button
                  onClick={() => setIsVideoPlaying(false)}
                  className="py-2 px-4 bg-red-500 text-white rounded-full text-lg font-bold hover:bg-red-600 transition duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Stop
                </motion.button>
              </motion.div>
            )}

            {isGameActive && (
              <motion.div 
                className="mb-8 p-6 bg-white rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-green-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Fun Game</h3>
                <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Your game is ready!</p>
                <motion.button
                  onClick={() => setIsGameActive(false)}
                  className="py-2 px-4 bg-red-500 text-white rounded-full text-lg font-bold hover:bg-red-600 transition duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  End
                </motion.button>
              </motion.div>
            )}

            {isChatOpen && (
              <motion.div 
                className="mb-8 p-6 bg-white rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-pink-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Friend Chat</h3>
                <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Say hi to friends!</p>
                <motion.button
                  onClick={() => setIsChatOpen(false)}
                  className="py-2 px-4 bg-red-500 text-white rounded-full text-lg font-bold hover:bg-red-600 transition duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Close
                </motion.button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                id="todo-list"
                className="bg-white p-6 rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-center text-orange-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  <FaTasks className="inline-block mr-2" /> To-Do List
                </h2>
                <ul className="space-y-3">
                  {todos.map(todo => (
                    <motion.li 
                      key={todo.id} 
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <input 
                        type="checkbox" 
                        checked={todo.done} 
                        onChange={() => toggleTodo(todo.id)}
                        className="mr-3 h-6 w-6"
                      />
                      <span className={`text-lg ${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        {todo.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                id="progress-chart"
                className="bg-white p-6 rounded-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-center text-purple-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  <FaStar className="inline-block mr-2" /> Your Progress
                </h2>
                <div className="flex items-center justify-center">
                  <div className="w-40 h-40 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#e6e6e6" 
                        strokeWidth="10"
                      />
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#4CAF50" 
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - xp / 100)}`}
                        transform="rotate(-90 50 50)"
                        initial={{ strokeDashoffset: `${2 * Math.PI * 45}` }}
                        animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - xp / 100)}` }}
                        transition={{ duration: 1 }}
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <motion.p 
                        className="text-3xl font-bold text-purple-600" 
                        style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      >
                        {xp}
                      </motion.p>
                      <p className="text-xl text-gray-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Points</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="bg-white p-4 rounded-3xl shadow-lg flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSubjectClick('stories')}
              >
                <FaBook className="text-4xl text-blue-500 mb-3" />
                <p className="text-lg text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Stories</p>
              </motion.div>
              <motion.div 
                className="bg-white p-4 rounded-3xl shadow-lg flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSubjectClick('writing')}
              >
                <FaPencilAlt className="text-4xl text-green-500 mb-3" />
                <p className="text-lg text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Writing</p>
              </motion.div>
              <motion.div 
                className="bg-white p-4 rounded-3xl shadow-lg flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSubjectClick('music')}
              >
                <FaMusic className="text-4xl text-yellow-500 mb-3" />
                <p className="text-lg text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Music</p>
              </motion.div>
              <motion.div 
                className="bg-white p-4 rounded-3xl shadow-lg flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSubjectClick('art')}
              >
                <FaPalette className="text-4xl text-purple-500 mb-3" />
                <p className="text-lg text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Art</p>
              </motion.div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <Subjects />
              <motion.button
                className="fixed bottom-4 right-4 bg-white text-purple-600 p-4 rounded-full shadow-lg"
                onClick={handleBackToDashboard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaHome className="text-2xl" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center relative overflow-hidden max-w-md w-full"
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="stars"></div>
              </motion.div>
              <motion.div
                className="text-5xl sm:text-6xl mb-4 text-yellow-500"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <FaRocket />
              </motion.div>
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold mb-4 text-purple-600" 
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Welcome to Sunhill LMS, Sunhillian!
              </motion.h1>
              <motion.p 
                className="text-lg sm:text-xl mb-6 text-blue-600" 
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Get ready for an out-of-this-world learning adventure!
              </motion.p>
              <motion.div
                className="flex justify-center space-x-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <FaStar className="text-3xl sm:text-4xl text-yellow-500 animate-pulse" />
                <FaSpaceShuttle className="text-3xl sm:text-4xl text-blue-500 animate-bounce" />
                <FaStar className="text-3xl sm:text-4xl text-yellow-500 animate-pulse" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTutorial && !showWelcome && (
          <TutorialModal 
            step={tutorialSteps[currentTutorialStep]}
            onNext={nextTutorialStep}
            onClose={closeTutorial}
            isLastStep={currentTutorialStep === tutorialSteps.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;