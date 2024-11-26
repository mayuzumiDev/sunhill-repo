import React, { useState, useEffect } from "react";
import {
  HiUserGroup,
  HiAcademicCap,
  HiClipboardList,
  HiCollection,
  HiArrowLeft,
} from "react-icons/hi";
import { axiosInstance } from "../../utils/axiosInstance";
import ClassroomDetailsTable from "./classroom/ClassroomDetailsTable";
import QuizResponseTable from "./scores/QuizResponseTable";

const ClassroomActions = ({ onClose, classroomData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [quizResponses, setQuizResponses] = useState([]);

  const fetchQuizScores = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/user-teacher/quiz-scores/list/",
        {
          params: {
            classroom: classroomData.id,
          },
        }
      );

      if (response.status === 200) {
        const quiz_scores = response.data.quiz_scores;
        setQuizResponses(quiz_scores);
      }
    } catch (error) {
      console.error("An error occurred fetching the quiz scores.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAction === "scores") {
      fetchQuizScores();
    }
  }, [selectedAction]);

  const actions = [
    {
      id: "students",
      title: "Students List",
      icon: <HiUserGroup className="w-8 h-8" />,
      onClick: () => setSelectedAction("students"),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      id: "scores",
      title: "Scores",
      icon: <HiAcademicCap className="w-8 h-8" />,
      onClick: () => setSelectedAction("scores"),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      id: "quizzes",
      title: "Quizzes",
      icon: <HiClipboardList className="w-8 h-8" />,
      onClick: () => setSelectedAction("quizzes"),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      id: "materials",
      title: "Materials",
      icon: <HiCollection className="w-8 h-8" />,
      onClick: () => setSelectedAction("materials"),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
  ];

  const renderContent = () => {
    switch (selectedAction) {
      case "students":
        return (
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Students Lists
              </h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <ClassroomDetailsTable classroom={classroomData} />
          </div>
        );

      case "scores":
        return (
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Quiz Scores
              </h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <QuizResponseTable
              responses={quizResponses}
              isLoading={isLoading}
            />
          </div>
        );
      case "quizzes":
        return (
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Quizzes</h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="text-gray-600">Quizzes content will go here</div>
          </div>
        );
      case "materials":
        return (
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Materials</h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="text-gray-600">Materials content will go here</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          {classroomData.grade_level} - {classroomData.class_section}
        </h2>
        <button
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 group"
        >
          <HiArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
          Back to Classrooms
        </button>
      </div>

      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              className={`${action.bgColor} ${action.hoverColor} text-white p-4 rounded-lg shadow-md transition-colors duration-200 flex flex-col items-center justify-center space-y-2`}
              onClick={action.onClick}
            >
              {action.icon}
              <span className="text-sm font-medium">{action.title}</span>
            </button>
          ))}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default ClassroomActions;
