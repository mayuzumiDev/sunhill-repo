import React from "react";

const ClassroomCard = ({ classroomData, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-gradient-to-r from-green-700 to-green-400 rounded-lg p-6 mb-6 shadow-md flex justify-between items-center transition-transform transform hover:scale-105 cursor-pointer hover:shadow-xl"
    >
      <div className="mb-14">
        <h2 className="font-bold text-xl text-white">
          {classroomData.grade_level}
        </h2>
        <h3 className="font-semibold text-lg text-white/90">
          {classroomData.class_section}
        </h3>
        <p className="text-gray-700 text-white/80">
          Subject:{" "}
          <span className="font-bold text-white">
            {classroomData.subject_name_display}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ClassroomCard;
