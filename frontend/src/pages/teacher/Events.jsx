import React from 'react';
import { useTeacherData } from '../../hooks/useTeacherData';
import Events from '../../components/common/Events';
import SatyamLoader from '../../components/loaders/SatyamLoader';

const TeacherEvents = () => {
  const { teacherData, isLoading, error } = useTeacherData();

  if (isLoading) {
    return <SatyamLoader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading teacher data: {error}</div>;
  }

  return (
    <div className="p-6">
      <Events 
        userRole={teacherData?.role || 'teacher'} 
        userBranch={teacherData?.branch}
      />
    </div>
  );
};

export default TeacherEvents;
