import React, { useState} from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleLogin, errorMessage, showAlert } = useLogin();
  const loginPageName = "admin";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleLogin({ username, password, loginPageName });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200"
    >
      {/* Top Navbar */}
      <div className="w-full fixed top-0 left-0 shadow-md">
        <nav className="bg-white border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="text-gray-800 font-semibold text-md sm:text-lg hover:text-blue-500 transition duration-300 ease-in-out ml-4"
            >
              <span className="letter1">S</span>
              <span className="letter2">u</span>
              <span className="letter3">n</span>
              <span className="letter4">h</span>
              <span className="letter5">i</span>
              <span className="letter6">l</span>
              <span className="letter7">l</span>
            </Link>
            <span className="sm:inline text-md sm:text-lg font-semibold text-gray-800">
              Montessori Casa
            </span>
            <span className="sm:inline text-xs sm:text-sm text-blue-800 mb-2">
              LMS
            </span>
          </div>
        </nav>
      </div>

      {/* Admin Login Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-xs sm:max-w-md p-6 sm:p-10 bg-white rounded-xl shadow-lg mt-24 sm:mt-20"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Admin Login
        </h1>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded"
              role="alert"
            >
              <p className="font-medium">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="relative">
            <label
              className="block text-gray-700 text-sm sm:text-base font-bold mb-1 sm:mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="flex items-center"
            >
              <FaUser className="absolute left-3 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2 sm:py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </motion.div>
          </div>

          <div className="relative">
            <label
              className="block text-gray-700 text-sm sm:text-base font-bold mb-1 sm:mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="flex items-center"
            >
              <FaLock className="absolute left-3 text-gray-400" />
              <input
                className="w-full pl-10 pr-12 py-2 sm:py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 text-gray-400 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300"
            >
              Forgot Password?
            </Link>
            <Link
              to="/"
              className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300"
            >
              Back to Home
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AdminLogin;
