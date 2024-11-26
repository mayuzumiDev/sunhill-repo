import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/login/Navbar";
import useSound from "use-sound";
import clickSound from "../assets/img/home/bubble.wav";
import "../styles/Studentlogin.css";
import useLogin from "../hooks/useLogin";
import LoginAlert from "../components/alert/LoginAlert";
import { motion } from "framer-motion";

function StudentLogin() {
  const navigate = useNavigate();
  const [play] = useSound(clickSound);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, errorMessage, showAlert } = useLogin();
  const loginPageName = "student";

  sessionStorage.setItem("loginPageName", loginPageName);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ username, password, loginPageName });
  };
  const greetings = [
    "Welcome Sunhillians! Let's have fun learning today. Login to begin your journey!",
    "Hey there Sunhillians! Ready for another exciting day? Login to get started!",
    "Good to see you Sunhillians! Let's make today a day of learning and fun!",
    "Hi Sunhillians Time to learn something amazing! Login to begin todays adventure!",
    "Hello Sunhillians Adventure awaits you today. Login and let's go!",
    "Hey Sunhillians Let's dive into a new adventure today. Login and discover something new!",
    "Welcome back Sunhillians! Your learning journey continues. Login to explore!",
    "Greetings Sunhillians! Another exciting day of learning is just a login away!",
    "Sunhillians it's time to shine! Login and start your day of learning now!",
    "Hi there Sunhillians! Let's unlock new knowledge today. Ready to begin? Login now!",
    "Welcome aboard Sunhillians! Your educational voyage begins with a simple login!",
    "Greetings young Sunhillians! Ready to embark on today's learning quest? Login now!",
    "Hello bright minds! Another day of discovery awaits. Login to start your journey!",
    "Hi future leaders! Your path to knowledge starts here. Login to begin!",
    "Welcome champions of learning! Ready for today's challenges? Login to get started!",
    "Hey brilliant Sunhillians! Your next adventure in education is just a login away!",
    "Good day knowledge seekers! Login to unlock today's learning treasures!",
    "Hello amazing Sunhillians! Your next learning milestone awaits. Login now!",
    "Welcome back eager learners! Ready to make today count? Login to begin!",
    "Hi dedicated Sunhillians! Your journey of growth continues. Login to proceed!"
  ];

  const getRandomGreeting = () => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  useEffect(() => {
    const speakWelcome = () => {
      const randomGreeting = getRandomGreeting();
      const message = new SpeechSynthesisUtterance(randomGreeting);
      message.lang = "en-US";
      message.pitch = 1.8;
      message.rate = 0.95;
      message.volume = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const childVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('child') || 
        voice.name.toLowerCase().includes('kid') || 
        voice.name.toLowerCase().includes('junior') ||
        voice.name.toLowerCase().includes('girl') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Microsoft Michelle') ||
        voice.name.includes('Google UK English Female') ||
        voice.name.toLowerCase().includes('zira')
      );
      
      console.log('Available voices:', voices.map(v => v.name));
      
      if (childVoice) {
        console.log('Selected voice:', childVoice.name);
        message.voice = childVoice;
        if (childVoice.name.includes('Microsoft')) {
          message.pitch = 1.6;
          message.rate = 1.0;
        }
      } else {
        message.pitch = 2.0;
        message.rate = 0.9;
      }
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(message);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', speakWelcome);
    } else {
      speakWelcome();
    }

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged', speakWelcome);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Fun characters for background animation
  const characters = [
    { emoji: "📚", color: "yellow" },
    { emoji: "✏️", color: "blue" },
    { emoji: "🎨", color: "pink" },
    { emoji: "🔬", color: "purple" },
    { emoji: "🎭", color: "green" },
    { emoji: "🌟", color: "gold" }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200">
      <Navbar />

      {/* Animated Background Characters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {characters.map((char, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -50
            }}
            animate={{
              y: window.innerHeight + 50,
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${(index / characters.length) * 100}%`
            }}
          >
            {char.emoji}
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="flex flex-col items-center justify-center flex-grow px-6 py-6 md:py-4 relative mt-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="w-full max-w-xs sm:max-w-sm md:max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl 
                     flex flex-col items-center space-y-6 relative z-10 border-4 border-purple-300"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Rainbow Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400 -z-10 blur-md opacity-50"></div>

          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-6xl"
            animate={{
              y: [0, -10, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🌞
          </motion.div>

          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center w-full mb-2"
            variants={itemVariants}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500">
              Welcome, Sunhillians! 
            </span>
          </motion.h1>

          <motion.div 
            className="text-lg text-center text-purple-600 mb-4 w-full"
            variants={itemVariants}
          >
            {showAlert ? (
              <LoginAlert errorMessage={errorMessage} />
            ) : (
              <span className="font-medium">Let's Start Our Learning Adventure! 🚀</span>
            )}
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="w-full space-y-6"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-col space-y-2 relative"
              whileHover={{ scale: 1.02 }}
            >
              <label className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <span>Username</span>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👋
                </motion.span>
              </label>
              <input
                type="text"
                className="p-4 rounded-2xl border-3 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 
                         outline-none text-sm sm:text-base transition-all duration-200 bg-purple-50 placeholder-purple-300"
                placeholder="Type your username here!"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </motion.div>

            <motion.div 
              className="flex flex-col space-y-2 relative"
              whileHover={{ scale: 1.02 }}
            >
              <label className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <span>Password</span>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔑
                </motion.span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-4 rounded-2xl border-3 border-purple-200 focus:border-purple-400 focus:ring-2 
                           focus:ring-purple-200 outline-none text-sm sm:text-base transition-all duration-200 bg-purple-50 placeholder-purple-300"
                  placeholder="Enter your secret code!"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? "🙈" : "👀"}
                  </motion.div>
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-xl 
                       font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(167, 139, 250, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={play}
            >
              <span className="flex items-center justify-center gap-2">
                Start Learning!
                <motion.span
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  ✨
                </motion.span>
              </span>
            </motion.button>

            <motion.div 
              className="text-center mt-4"
              variants={itemVariants}
            >
              <a
                href="/forgot-password"
                className="text-purple-500 hover:text-purple-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>Forgot your password?</span>
                <motion.span
                  animate={{ 
                    rotate: [0, 20, -20, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🤔
                </motion.span>
              </a>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default StudentLogin;