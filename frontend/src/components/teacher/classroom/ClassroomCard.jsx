import React from "react";
import {
  AiOutlineEdit,
  AiOutlineUsergroupAdd,
  AiOutlineDelete,
} from "react-icons/ai";

const ClassroomCard = ({ classroomData }) => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 mb-6 shadow-md flex justify-between items-center transition-transform transform hover:scale-100">
      <div className="mb-14">
        <h3 className="font-semibold text-xl">
          Grade: {classroomData.grade_level} {classroomData.class_section}
        </h3>
        <p className="text-gray-700">
          Subject:{" "}
          <span className="font-bold">
            {classroomData.subject_name_display}
          </span>
        </p>
        <p className="text-gray-700">
          Instructor: {classroomData.class_instructor.first_name}{" "}
          {classroomData.class_instructor.last_name}
        </p>
      </div>
      <div className="flex space-x-3 absolute bottom-4 right-4">
        <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
          <AiOutlineEdit />
        </button>
        <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition">
          <AiOutlineUsergroupAdd />
        </button>
        <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
          <AiOutlineDelete />
        </button>
      </div>
    </div>
  );
};

export default ClassroomCard;
