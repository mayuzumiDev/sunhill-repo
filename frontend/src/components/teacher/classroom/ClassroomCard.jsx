import React, { useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineUsergroupAdd,
  AiOutlineDelete,
} from "react-icons/ai";
import ClassroomDetailsModal from "./ClassroomDetailsModal";

const ClassroomCard = ({ classroomData, onEdit, onDelete, addStudent }) => {
  const [showClassroomDetails, setshowClassroomDetails] = useState(false);

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    setshowClassroomDetails(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 mb-6 shadow-md flex justify-between items-center transition-transform transform hover:scale-100"
      >
        <div className="mb-14">
          <h2 className="font-bold text-xl">{classroomData.grade_level}</h2>
          <h3 className="font-semibold text-lg">
            {classroomData.class_section}
          </h3>
          <p className="text-gray-700">
            Subject:{" "}
            <span className="font-bold">
              {classroomData.subject_name_display}
            </span>
          </p>
        </div>
        <div className="flex space-x-3 absolute bottom-4 right-4">
          <button
            onClick={onEdit}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          >
            <AiOutlineEdit />
          </button>
          <button
            onClick={addStudent}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
          >
            <AiOutlineUsergroupAdd />
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
          >
            <AiOutlineDelete />
          </button>
        </div>
      </div>

      <ClassroomDetailsModal
        isOpen={showClassroomDetails}
        onClose={() => setshowClassroomDetails(false)}
        classroom={classroomData}
      />
    </>
  );
};

export default ClassroomCard;
