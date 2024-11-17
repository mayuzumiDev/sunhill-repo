import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { axiosInstance } from '../utils/axiosInstance';

const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTeacherData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/user-teacher/current-teacher/");
      if (response.status === 200) {
        const current_teacher = response.data.teacher_profile;
        setTeacherData(current_teacher);
        console.log('Teacher data refreshed:', current_teacher);
      }
    } catch (error) {
      console.error("Error refreshing teacher data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshTeacherData();
  }, [refreshTeacherData]);

  const value = {
    teacherData,
    setTeacherData,
    refreshTeacherData,
    isLoading
  };

  return (
    <TeacherContext.Provider value={value}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
};
