import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaUsers, FaChalkboardTeacher } from "react-icons/fa";

const BranchCard = ({
  branchName,
  imageUrl,
  branchAddress,
  branchCounts,
  onClick,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading first
    setLoading(true);
    
    // Then instantly show the result
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  const studentCount = branchCounts?.data?.student_count ?? 0;
  const teacherCount = branchCounts?.data?.teacher_count ?? 0;

  const LoadingPlaceholder = () => (
    <div className="inline-block h-4 w-16 bg-gray-400/30 animate-pulse rounded"></div>
  );

  return (
    <div
      className="relative group cursor-pointer rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105"
      onClick={() => onClick()}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
      <div className="relative p-6 flex flex-col h-[200px] justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{branchName}</h2>
          <p className="text-gray-200 text-sm">
            <FaMapMarkerAlt className="inline mr-1" /> {branchAddress}
          </p>
        </div>
        <div className="text-white text-sm space-y-1">
          <p>
            <FaUsers className="inline mr-1" />
            {loading ? (
              <LoadingPlaceholder />
            ) : (
              <span>{studentCount} Students</span>
            )}
          </p>
          <p>
            <FaChalkboardTeacher className="inline mr-1" />
            {loading ? (
              <LoadingPlaceholder />
            ) : (
              <span>{teacherCount} Teachers</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;
