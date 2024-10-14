import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSignOutAlt,
  FaGraduationCap,
  FaBook,
  FaPencilAlt,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  axiosInstance,
  setAuthorizationHeader,
} from "../../utils/axiosInstance";
import SecureLS from "secure-ls";
import { ENCRYPTION_KEY } from "../../constants";

const Logout = ({ onCancel }) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const [refreshToken, setRefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userRole, setUserRole] = useState("");

  const secureStorage = new SecureLS({
    encodingType: "aes",
    encryptionSecret: ENCRYPTION_KEY,
  });

  useEffect(() => {
    const refreshToken = secureStorage.get("refresh_token");
    const accessToken = secureStorage.get("access_token");
    const userRole = secureStorage.get("user_role");
    setRefreshToken(refreshToken);
    setAccessToken(accessToken);
    setUserRole(userRole);
  }, [secureStorage]);
  const handleLogout = async () => {
    try {
      setAuthorizationHeader(accessToken);

      // Send logout request to API with the refresh token
      const response = await axiosInstance.post("/api/account-logout/", {
        refresh_token: refreshToken,
      });

      // Clear storage to remove any sensitive data
      secureStorage.clear();
      sessionStorage.clear();

      // Redirect the user to the  login page
      if (userRole === "admin") {
        navigate("/admin/login", { replace: true });
      } else {
        navigate("/login/", { replace: true });
      }
    } catch (error) {
      console.error("An error occured: ", error);
    }
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
            <FaBook className="mr-2 text-yellow-500" /> Great job on your
            studies today!
          </p>
          <div className="flex justify-center">
            <motion.button
              className="bg-yellow-400 text-purple-800 px-6 py-3 rounded-full text-xl font-bold shadow-lg flex items-center"
              whileHover={{ scale: 1.05, backgroundColor: "#fbbf24" }}
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
