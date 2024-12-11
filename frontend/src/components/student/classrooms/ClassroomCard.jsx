import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faBookOpen,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

const ClassroomCard = ({ classroomData, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(classroomData)}
      className="bg-gradient-to-r from-purple-700 to-purple-400 rounded-2xl p-6 shadow-md cursor-pointer transition-all hover:shadow-xl hover:scale-105 relative overflow-hidden min-w-[280px] w-full max-w-[400px] min-h-[220px] group"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12 transition-transform duration-500 group-hover:scale-110"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-125"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="text-white text-xl"
              />
            </div>
            <h2 className="font-bold text-2xl text-white">
              {classroomData.grade_level}
              <span className="text-white/80 ml-2">•</span>
              <span className="ml-2">{classroomData.class_section}</span>
            </h2>
          </div>
        </div>

        {/* Subject Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <FontAwesomeIcon icon={faBookOpen} className="text-white text-lg" />
          </div>
          <div>
            <p className="text-white/70 text-sm">Subject</p>
            <p className="text-white font-semibold text-lg">
              {classroomData.subject_display}
            </p>
          </div>
        </div>

        {/* Teacher Section */}
        <div className="mt-auto">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FontAwesomeIcon
                icon={faChalkboardTeacher}
                className="text-white text-lg"
              />
            </div>
            <div>
              <p className="text-white/70 text-sm">Teacher</p>
              <p className="text-white font-semibold">
                {classroomData.instructor.full_name}
              </p>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default ClassroomCard;
