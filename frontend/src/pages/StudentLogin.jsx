import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/login/Navbar";
import { QRCodeSVG } from "qrcode.react";
import QRCodeScanner from "./student/qrcode/qrscan";
import useSound from "use-sound";
import clickSound from "../assets/img/home/bubble.wav";
import SUNHILL from "../assets/img/home/sunhill.jpg";
import MrSun from "../assets/img/home/mr_sun.gif";
import "../styles/Studentlogin.css";
import useLogin from "../hooks/useLogin";
import LoginAlert from "../components/alert/LoginAlert";

function StudentLogin() {
  const navigate = useNavigate();
  const [play] = useSound(clickSound); // Play sound on hover
  const [isScannerVisible, setScannerVisible] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {handleLogin, errorMessage, showAlert } = useLogin();
  const loginPageName = "student";

  sessionStorage.setItem("loginPageName", loginPageName);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ username, password, loginPageName });
  };

  // Toggle QR code scanner visibility
  const toggleScanner = () => {
    setScannerVisible(!isScannerVisible);
  };
  const greetings = [
    "Welcome, Sunhillians! Let's have fun learning today. Login to begin your journey!",
    "Hey there, Sunhillians! Ready for another exciting day? Login to get started!",
    "Good to see you, Sunhillians! Let's make today a day of learning and fun!",
    "Hi Sunhillians! Time to learn something amazing! Login to begin todays adventure!",
    "Hello Sunhillians! Adventure awaits you today. Login and let's go!",
    "Hey Sunhillians! Let's dive into a new adventure today. Login and discover something new!",
    "Welcome back, Sunhillians! Your learning journey continues. Login to explore!",
    "Greetings, Sunhillians! Another exciting day of learning is just a login away!",
    "Sunhillians, it's time to shine! Login and start your day of learning now!",
    "Hi there, Sunhillians! Let's unlock new knowledge today. Ready to begin? Login now!",
  ];

  // Function to pick a random greeting
  const getRandomGreeting = () => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Voice prompt on component mount
  useEffect(() => {
    const speakWelcome = () => {
      const randomGreeting = getRandomGreeting();
      const message = new SpeechSynthesisUtterance(randomGreeting);
      message.lang = "en-US";
      message.pitch = 2.9;
      message.rate = 1.3;
      window.speechSynthesis.speak(message);
    };

    // Trigger the speech synthesis when the component mounts
    speakWelcome();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow px-6 py-6 md:py-4 relative mt-10">
        {/* Responsive Login Box */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-4xl p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-lg flex flex-col sm:flex-col md:flex-row items-center space-y-4 sm:space-y-4 md:space-y-0 md:space-x-8 relative z-10">
          {/* Login Form */}
          <div className="w-full md:w-1/2 flex flex-col items-start space-y-4">
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-blue-800 text-center md:text-left">
              Welcome,&nbsp;
              <span className="letter-s">S</span>
              <span className="letter-u">u</span>
              <span className="letter-n">n</span>
              <span className="letter-h">h</span>
              <span className="letter-i">i</span>
              <span className="letter-l">l</span>
              <span className="letter-l">l</span>
              <span className="letter-l1">i</span>
              <span className="letter-l1">a</span>
              <span className="letter-l2">n</span>
              <span className="letter-l2">s!</span>
            </h1>

            <div className="text-sm sm:text-base text-center text-purple-600 mb-8">
              {showAlert ? (
                <div>
                  <LoginAlert errorMessage={errorMessage} />
                </div>
              ) : (
                "Log in to begin today's adventure!"
              )}
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="flex flex-col">
                <label className="text-xs sm:text-sm md:text-lg text-gray-700 font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  className="p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base md:text-lg"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs sm:text-sm md:text-lg text-gray-700 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base md:text-lg w-full"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                        <svg className="h-6 w-6 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                  </button>
                </div>
              </div>

              {/*               <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" id="rememberMe" />
                <label
                  htmlFor="rememberMe"
                  className="text-xs sm:text-sm md:text-lg text-gray-700"
                >
                  Remember Me
                </label>
              </div> */}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base md:text-lg font-semibold py-2 sm:py-3 rounded-full shadow-md transition-transform transform hover:scale-105"
                onMouseEnter={play} // Play sound on hover
              >
                Log In
              </button>

              <div className="text-left">
                <a
                  href="/forgot-password"
                  className="text-blue-500 hover:underline text-sm sm:text-base"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>

          <div className="md:flex md:flex-col items-center space-y-4">
            <div className="flex items-center space-x-2 w-full">
              <hr className="border-t border-gray-300 flex-grow" />
              <span className="text-black-600 font-bold px-2 text-sm sm:text-base">
                OR
              </span>
              <hr className="border-t border-gray-300 flex-grow" />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center mt-4 sm:mt-6">
              <QRCodeSVG
                value="https://example.com/qr-login"
                size={150}
                bgColor="#FFFFFF"
                fgColor="#4A90E2"
                className="shadow-lg rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={SUNHILL}
                  alt="Sunhill Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-4 border-white"
                />
              </div>
            </div>

            <button
              className="bg-green-400 hover:bg-green-500 text-sm sm:text-base md:text-lg font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-md transition-transform transform hover:scale-105 mt-4"
              onMouseEnter={play} // Play sound when hovered
              onClick={toggleScanner} //QR scanner visibility on click
            >
              Sign in with QR Code
            </button>
          </div>
        </div>

        {/* Bouncing and Rotating Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-30 animate-bounce z-0 hidden sm:block"></div>
        <div className="absolute bottom-14 right-10 mr-10 w-24 h-24 bg-yellow-300 rounded-full opacity-40 animate-ping z-0 hidden sm:block"></div>
        <div className="absolute top-35 right-12 w-40 h-40 bg-red-400 rounded-full opacity-30 animate-bounce z-0 hidden sm:block"></div>
        <div className="absolute bottom-20 left-8 w-36 h-36 bg-green-300 rounded-full opacity-70 animate-bounce z-0 hidden sm:block"></div>

        {/* Additional Shapes */}
        <div className="absolute top-25 left-16 w-20 h-20 ml-20 bg-purple-500 rounded-lg opacity-50 animate-spin z-0 hidden md:block"></div>
        <div className="absolute bottom-10 left-24 w-20 h-20 bg-pink-400 rounded-full opacity-60 animate-bounce z-0 hidden md:block"></div>
        <div className="absolute top-16 right-16 w-20 h-20 bg-teal-400 animate-bounce rounded-lg opacity-70 z-0 hidden lg:block">
          {/* Custom triangle shape */}
          <svg className="w-30 h-30 animate-spin" viewBox="0 0 100 100">
            <polygon points="50,10 100,100 0,100" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-8 w-20 h-20 bg-orange-300 rounded-full opacity-50 animate-bounce z-0 hidden lg:block"></div>

        {/* Mr. Sun GIF with bouncing animation */}
        <div className="absolute bottom-16 right-14 w-40 h-70 animate-bounce hidden md:block">
          <img
            src={MrSun}
            alt="Mr. Sun"
            className="w-full h-full object-cover"
          />
        </div>

        {isScannerVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-300 ease-in-out">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[70%] bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-4">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-purple-700">
                Scan Your QR Code
              </h2>
              <p className="text-gray-600 text-center text-xs sm:text-sm md:text-base">
                Use your QR code to sign in securely.
              </p>
              <QRCodeScanner />
              <button
                className="absolute top-2 right-2 text-red-500 text-xl sm:text-2xl md:text-3xl bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                onClick={toggleScanner} // Close the popup
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentLogin;
