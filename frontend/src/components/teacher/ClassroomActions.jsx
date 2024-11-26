import React, { useState } from "react";
import {
  HiUserGroup,
  HiAcademicCap,
  HiClipboardList,
  HiCollection,
} from "react-icons/hi";
import ClassroomDetailsModal from "./classroom/ClassroomDetailsModal";

const ClassroomActions = ({ onClose, classroomData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const actions = [
    {
      title: "Students List",
      icon: <HiUserGroup className="w-8 h-8" />,
      onClick: () => setIsModalOpen(true),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      title: "Scores",
      icon: <HiAcademicCap className="w-8 h-8" />,
      onClick: () => console.log("Scores clicked"),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      title: "Quizzes",
      icon: <HiClipboardList className="w-8 h-8" />,
      onClick: () => console.log("Quizzes clicked"),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      title: "Materials",
      icon: <HiCollection className="w-8 h-8" />,
      onClick: () => console.log("Materials clicked"),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 sm:mb-10 md:mb-16 lg:mb-20 xl:mb-24">
        <h2 className="text-2xl font-bold text-gray-700">
          {classroomData.grade_level} - {classroomData.class_section}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Classrooms
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 w-full max-w-4xl mx-auto place-content-center">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.bgColor} ${action.hoverColor} text-white p-6 rounded-lg 
              transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg
              flex items-center justify-center space-x-3 w-full`}
          >
            {action.icon}
            <span className="font-semibold text-lg">{action.title}</span>
          </button>
        ))}
      </div>

      <ClassroomDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classroom={classroomData}
      />
    </div>
  );
};

export default ClassroomActions;
