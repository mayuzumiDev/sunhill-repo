import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../utils/axiosInstance";
import userThree from "../../assets/img/home/unknown.jpg";
import {
  FaCamera,
  FaStar,
  FaBook,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTree,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";

const StudentSettings = ({ onProfileUpdate }) => {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const messageTimerRef = useRef(null);
  const errorTimerRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    username: "",
    grade_level: "",
    branch_name: "",
  });

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  // Handle success message timer
  useEffect(() => {
    if (message) {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [message]);

  // Handle error message timer
  useEffect(() => {
    if (error) {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      setError("");
      // console.log("Fetching student data...");
      const response = await axiosInstance.get("/api/user-student/profile/");
      // console.log("API Response:", response.data);

      if (response.status === 200) {
        const data = response.data.student_profile;
        // console.log("Full API response:", response.data);
        // console.log("Student profile data:", data);
        // console.log("Student info:", data.student_info);
        setStudentData(data);

        setFormData({
          fullName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          phoneNumber: data.user_info?.contact_no || "",
          emailAddress: data.email || "",
          username: data.username || "",
          grade_level: data.grade_level || "",
          branch_name: data.branch_name || "",
        });

        if (data.user_info?.profile_image) {
          setProfileImage(data.user_info.profile_image);
        }
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to load student data";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      setIsLoading(true);
      setError("");

      const response = await axiosInstance.post(
        "/api/user-student/profile/image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // console.log("Profile image updated successfully");
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
        setMessage("Yay! Your new profile picture looks awesome! 🌟");
        // Update TopNav immediately
        onProfileUpdate && onProfileUpdate((prevState) => !prevState);
      }
    } catch (err) {
      console.error("Error uploading profile image:", err);
      setError("Oops! Something went wrong with your picture. Try again! 🎨");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axiosInstance.delete(
        "/api/user-student/profile/image/"
      );

      if (response.status === 200) {
        setProfileImage(userThree);
        setMessage("Profile picture removed successfully! 🗑️");
        // Update TopNav immediately
        onProfileUpdate && onProfileUpdate((prevState) => !prevState);
      }
    } catch (err) {
      console.error("Error deleting profile image:", err);
      setError(
        "Oops! Something went wrong while removing the picture. Try again! 🎨"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      setMessage("");

      const [firstName = "", lastName = ""] = formData.fullName.split(" ");

      const updateData = {
        first_name: firstName,
        last_name: lastName,
        email: formData.emailAddress,
        username: formData.username,
        student_info: {
          grade_level: formData.grade_level,
        },
        user_info: {
          contact_no: formData.phoneNumber
        },
        branch_name: formData.branch_name,
      };

      // console.log("Updating profile with data:", updateData);

      const response = await axiosInstance.patch(
        "/api/user-student/profile/update/",
        updateData
      );

      if (response.status === 200) {
        setMessage("Woohoo! Your profile has been updated! 🎉");
        // Update TopNav immediately
        onProfileUpdate && onProfileUpdate((prevState) => !prevState);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Oops! Something went wrong. Let's try again! 🌈");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-2 xs:p-3 sm:p-4 md:p-8 bg-[#F5F5F5] min-h-screen">
        <div className="text-2xl font-bold text-[#2B3A67] animate-bounce">
          Loading your awesome profile... 🌟
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-2 xs:p-3 sm:p-4 md:p-8 relative overflow-hidden">
      {/* Educational Background Decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 text-[#2B3A67] opacity-20">
        📚
      </div>
      <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 text-[#2B3A67] opacity-20">
        🎨
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 text-[#2B3A67] opacity-20">
        ✏️
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 text-[#2B3A67] opacity-20">
        📝
      </div>

      <div className="max-w-5xl sm:max-w-2xl mx-auto">
        <motion.div
          className="bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden"
          style={{
            backgroundImage: `
              repeating-linear-gradient(#F5F5F5 0px, #F5F5F5 1px, transparent 1px, transparent 27px),
              repeating-linear-gradient(90deg, #F5F5F5 0px, #F5F5F5 1px, transparent 1px, transparent 27px)
            `,
            backgroundSize: "27px 27px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Red Margin Line */}
          <div className="absolute left-[30px] top-0 bottom-0 w-[2px] bg-[#FF6B6B] opacity-50"></div>

          {/* Notebook Holes */}
          <div className="absolute left-2 top-0 bottom-0 w-6 flex flex-col justify-evenly">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-[#2B3A67] opacity-10"
              ></div>
            ))}
          </div>

          <div className="p-6 xs:p-8 sm:p-10 pl-12">
            {/* Header with School Theme */}
            <div className="relative mb-8">
              <motion.h1
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#2B3A67] relative z-10"
              >
                <span className="inline-block mr-3">📓</span>
                My School Profile
                <span className="inline-block ml-3">📓</span>
              </motion.h1>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-[#FFD700] opacity-20 transform -skew-x-12"></div>
            </div>

            {/* Notifications with School Theme */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="bg-white rounded-lg border-2 border-[#FF6B6B] p-4 mb-6 relative overflow-hidden"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #FFF1F1 0px, #FFF1F1 1px, transparent 1px, transparent 10px)`,
                  }}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B6B]"></div>
                  <div className="absolute top-1 left-0 w-full h-[2px] bg-[#FF6B6B] opacity-30"></div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#FFF1F1] border-2 border-[#FF6B6B]">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[#FF6B6B] font-bold text-sm xs:text-base">
                          Let's Review This
                        </p>
                      </div>
                      <p className="text-[#2B3A67] text-sm leading-relaxed">
                        {error}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm">✏️</span>
                        <p className="text-[#FF6B6B] text-xs italic">
                          Time to make some corrections!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {message && (
                <motion.div
                  key="message"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="bg-white rounded-lg border-2 border-[#4CAF50] p-4 mb-6 relative overflow-hidden"
                  style={{
                    backgroundImage: `repeating-linear-gradient(-45deg, #F1FFF2 0px, #F1FFF2 1px, transparent 1px, transparent 10px)`,
                  }}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#4CAF50]"></div>
                  <div className="absolute top-1 left-0 w-full h-[2px] bg-[#4CAF50] opacity-30"></div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#F1FFF2] border-2 border-[#4CAF50]">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[#4CAF50] font-bold text-sm xs:text-base">
                          Great Progress!
                        </p>
                        <span className="text-lg">⭐</span>
                      </div>
                      <p className="text-[#2B3A67] text-sm leading-relaxed">
                        {message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm">📚</span>
                        <p className="text-[#4CAF50] text-xs italic">
                          You're doing amazing!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form with School Theme */}
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              {/* Profile Image Section with School Theme */}
              <div className="flex justify-center mb-8 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-[#FFD700] opacity-20"></div>
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-32 h-32 xs:w-40 xs:h-40 rounded-full object-cover border-4 border-[#2B3A67] group-hover:border-[#4CAF50] transition-all duration-300 shadow-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 xs:w-40 xs:h-40 rounded-full border-4 border-[#2B3A67] group-hover:border-[#4CAF50] transition-all duration-300 shadow-xl bg-gray-100 flex items-center justify-center">
                        <FaUserCircle className="w-24 h-24 xs:w-32 xs:h-32 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute -bottom-3 -right-3 flex gap-2">
                      <motion.button
                        type="button"
                        onClick={handleImageClick}
                        className="bg-[#2B3A67] text-white p-3 rounded-full shadow-lg hover:bg-[#4CAF50] transition-all duration-200"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <FaCamera className="text-xl" />
                      </motion.button>
                      {profileImage && (
                        <motion.button
                          type="button"
                          onClick={handleDeleteImage}
                          className="bg-[#FF6B6B] text-white p-3 rounded-full shadow-lg hover:bg-[#FF4444] transition-all duration-200"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                        >
                          <FaTrash className="text-xl" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </motion.div>
              </div>

              {/* Form Fields with School Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name Field */}
                <motion.div
                  className="bg-[#F7DC6F] p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-[#F7DC6F]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="flex items-center text-base xs:text-lg font-semibold text-[#2B3A67] mb-2 xs:mb-3">
                    <FaUser className="mr-2 xs:mr-3 text-[#2B3A67]" /> My Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-[#F7DC6F] focus:border-[#F2C464] focus:ring focus:ring-[#F7DC6F] text-base xs:text-lg bg-white bg-opacity-70"
                    placeholder="What's your name? 😊"
                  />
                </motion.div>

                {/* Phone Number Field */}
                <motion.div
                  className="bg-[#8BC34A] p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-[#8BC34A]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="flex items-center text-base xs:text-lg font-semibold text-[#2B3A67] mb-2 xs:mb-3">
                    <FaPhone className="mr-2 xs:mr-3 text-[#2B3A67]" /> Phone
                    Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-[#8BC34A] focus:border-[#3E8E41] focus:ring focus:ring-[#8BC34A] text-base xs:text-lg bg-white bg-opacity-70"
                    placeholder="Your phone number 📱"
                  />
                </motion.div>

                {/* Email Address Field */}
                <motion.div
                  className="bg-[#87CEEB] p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-[#87CEEB]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="flex items-center text-base xs:text-lg font-semibold text-[#2B3A67] mb-2 xs:mb-3">
                    <FaEnvelope className="mr-2 xs:mr-3 text-[#2B3A67]" /> Email
                    Address
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-[#87CEEB] focus:border-[#4682B4] focus:ring focus:ring-[#87CEEB] text-base xs:text-lg bg-white bg-opacity-70"
                    placeholder="Your email 📧"
                  />
                </motion.div>

                {/* Username Field */}
                <motion.div
                  className="bg-[#6495ED] p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-[#6495ED]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="flex items-center text-base xs:text-lg font-semibold text-[#2B3A67] mb-2 xs:mb-3">
                    <FaStar className="mr-2 xs:mr-3 text-[#2B3A67]" /> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-[#6495ED] focus:border-[#4682B4] focus:ring focus:ring-[#6495ED] text-base xs:text-lg bg-white bg-opacity-70"
                    placeholder="Your username 🌟"
                  />
                </motion.div>

                {/* Grade Level Field */}
                <motion.div
                  className="bg-[#FFC080] p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-[#FFC080]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="flex items-center text-base xs:text-lg font-semibold text-[#2B3A67] mb-2 xs:mb-3">
                    <FaBook className="mr-2 xs:mr-3 text-[#2B3A67]" /> Grade
                    Level
                  </label>
                  <div className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-[#FFC080] bg-white bg-opacity-70 text-base xs:text-lg">
                    {formData.grade_level || "Not Set Yet 📚"}
                  </div>
                </motion.div>

                {/* Branch Field */}
                <motion.div
                  className="bg-[#F7DC6F] p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-lg border border-[#F7DC6F]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="flex items-center text-base xs:text-lg font-semibold text-[#2B3A67] mb-2 xs:mb-3">
                    <FaTree className="mr-2 xs:mr-3 text-[#2B3A67]" /> Branch
                  </label>
                  <div className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl border-2 border-[#FFC080] bg-white bg-opacity-70 text-base xs:text-lg">
                    {formData.branch_name || "Not Set Yet 📚"}
                  </div>
                </motion.div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-6 xs:mt-8 sm:mt-10 md:mt-12">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 xs:px-8 sm:px-10 md:px-12 py-2 xs:py-3 sm:py-4 bg-[#2B3A67] text-white text-base xs:text-lg sm:text-xl font-bold rounded-full shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? "🔄 Saving..." : "✨ Save Profile ✨"}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentSettings;
