import React from "react";

const ClassroomCard = ({ classroomData, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 mb-6 shadow-md flex justify-between items-center transition-transform transform hover:scale-105 cursor-pointer"
    >
      <div className="mb-14">
        <h2 className="font-bold text-xl">{classroomData.grade_level}</h2>
        <h3 className="font-semibold text-lg">{classroomData.class_section}</h3>
        <p className="text-gray-700">
          Subject:{" "}
          <span className="font-bold">
            {classroomData.subject_name_display}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ClassroomCard;
