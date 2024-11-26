import React from "react";
import {
  AiOutlineEdit,
  AiOutlineUsergroupAdd,
  AiOutlineDelete,
  AiOutlineEye,
} from "react-icons/ai";

const ClassroomCard = ({
  classroomData,
  onEdit,
  onDelete,
  addStudent,
  onView,
}) => {
  return (
    <div className="bg-gradient-to-r from-green-700 to-green-400 rounded-lg p-6 mb-6 shadow-md flex justify-between items-center transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="mb-14">
        <h2 className="font-bold text-xl text-white">
          {classroomData.grade_level}
        </h2>
        <h3 className="font-semibold text-lg text-white/90">
          {classroomData.class_section}
        </h3>
        <p className="text-white/80">
          Subject:{" "}
          <span className="font-bold text-white">
            {classroomData.subject_name_display}
          </span>
        </p>
      </div>
      <div className="flex space-x-3 absolute bottom-4 right-4">
        <button
          onClick={onView}
          title="View Classroom"
          aria-label="View Classroom"
          className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <AiOutlineEye size={20} />
        </button>
        <button
          onClick={onEdit}
          title="Edit Classroom"
          aria-label="Edit Classroom"
          className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <AiOutlineEdit size={20} />
        </button>
        <button
          onClick={addStudent}
          title="Add Students"
          aria-label="Add Students"
          className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <AiOutlineUsergroupAdd size={20} />
        </button>
        <button
          onClick={onDelete}
          title="Delete Classroom"
          aria-label="Delete Classroom"
          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <AiOutlineDelete size={20} />
        </button>
      </div>
    </div>
  );
};

export default ClassroomCard;
