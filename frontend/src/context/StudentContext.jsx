import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { axiosInstance } from '../utils/axiosInstance';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshStudentData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get("/api/user-student/profile/");
      if (response.status === 200) {
        const current_student = response.data.student_profile;
        setStudentData(current_student);
        console.log('Student data refreshed:', current_student);
      }
    } catch (error) {
      console.error("Error refreshing student data:", error);
      setError(error.response?.data?.message || "Failed to load student data");
      setStudentData(null); // Clear student data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.patch("/api/user-student/profile/update/", profileData);
      if (response.status === 200) {
        await refreshStudentData();
        return { success: true, message: "Profile updated successfully!" };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileImage = async (imageFile) => {
    try {
      setIsLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('profile_image', imageFile);
      
      const response = await axiosInstance.post("/api/user-student/profile/image/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 200) {
        await refreshStudentData();
        return { success: true, message: "Profile image updated successfully!" };
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile image";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfileImage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.delete("/api/user-student/profile/image/");
      if (response.status === 200) {
        await refreshStudentData();
        return { success: true, message: "Profile image deleted successfully!" };
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete profile image";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    refreshStudentData();
  }, [refreshStudentData]);

  const value = {
    studentData,
    setStudentData,
    refreshStudentData,
    updateProfile,
    updateProfileImage,
    deleteProfileImage,
    isLoading,
    error
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export default StudentProvider;
