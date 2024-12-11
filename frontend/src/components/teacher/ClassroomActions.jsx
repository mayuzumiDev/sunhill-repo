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
import ClassroomMaterials from "./materials/ClassroomMaterials";
import QuizList from "./quizzes/QuizList";
import ConfirmDeleteModal from "../modal/teacher/ConfirmDeleteModal";

const ClassroomActions = ({ onClose, classroomData }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [quizResponses, setQuizResponses] = useState([]);

  const [quizzes, setQuizzes] = useState([]);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showEditQuiz, setShowEditQuiz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("quizzes");

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      // console.log("Fetching quizzes for classroom:", classroomData?.id);

      const response = await axiosInstance.get("/user-teacher/quiz/list/", {
        params: { classroom_id: classroomData?.id },
      });

      if (response.status === 200) {
        console.log("Received quizzes:", response.data.quizzes);
        const quizList = response.data.quizzes;
        console.log(quizList);
        setQuizzes(response.data.quizzes);
      }
    } catch (error) {
      console.error("An error occurred fetching the quizzes.", error);
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizCreated = (newQuiz) => {
    if (!newQuiz) return;
    setQuizzes((prev) =>
      Array.isArray(prev) ? [...prev, newQuiz] : [newQuiz]
    );
    setShowCreateQuiz(false);
  };

  const handleQuizUpdated = (updatedQuiz) => {
    if (!updatedQuiz) return;
    setQuizzes((prev) =>
      Array.isArray(prev)
        ? prev.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz))
        : [updatedQuiz]
    );
    setShowEditQuiz(false);
    setSelectedQuiz(null);
  };

  const handleCreateQuizError = (error) => {
    console.error("Error creating/updating quiz:", error);
    // Add error handling logic here
  };

  const handleDeleteQuiz = async () => {
    try {
      const response = await axiosInstance.delete(
        `/user-teacher/quiz/delete/${quizToDelete}/`
      );

      if (response.status === 200) {
        await fetchQuizzes();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

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
    if (!classroomData?.id || !selectedAction) return;

    if (selectedAction === "scores") {
      fetchQuizScores();
    } else if (selectedAction === "quizzes") {
      fetchQuizzes();
    }
  }, [selectedAction, classroomData?.id]);

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
      onClick: () => {
        setSelectedAction("scores");
        fetchQuizScores();
      },
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      id: "quizzes",
      title: "Quiz/Activity",
      icon: <HiClipboardList className="w-8 h-8" />,
      onClick: () => {
        // console.log("Quiz action clicked. Classroom:", classroomData);
        setSelectedAction("quizzes");
        setQuizzes([]);
        fetchQuizzes();
      },
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
          <div className="mt-6 w-full bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Students Lists
              </h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Close
              </button>
            </div>
            <ClassroomDetailsTable classroom={classroomData} />
          </div>
        );

      case "scores":
        return (
          <div className="mt-6 w-full bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Quiz/Activity Scores
              </h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
          <div className="mt-6 w-full bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Quizzes/Activities
              </h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Close
              </button>
            </div>
            {activeTab === "quizzes" && (
              <QuizList
                isLoading={isLoading}
                showCreateQuiz={showCreateQuiz}
                showEditQuiz={showEditQuiz}
                selectedQuiz={selectedQuiz}
                quizzes={quizzes}
                selectedClassroom={classroomData}
                onQuizCreated={handleQuizCreated}
                onQuizUpdated={handleQuizUpdated}
                onCreateQuizError={handleCreateQuizError}
                onSetShowCreateQuiz={setShowCreateQuiz}
                onSetShowEditQuiz={setShowEditQuiz}
                onSetSelectedQuiz={(quiz) => {
                  if (typeof quiz === "number") {
                    setQuizToDelete(quiz);
                  } else {
                    setSelectedQuiz(quiz);
                  }
                }}
                onSetShowConfirmDelete={setShowConfirmDelete}
              />
            )}
          </div>
        );
      case "materials":
        return (
          <div className="mt-6 w-full bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Materials</h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Close
              </button>
            </div>
            <ClassroomMaterials classroomId={classroomData.id} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
        <h2 className="text-2xl font-bold text-gray-700">
          <span className="text-green-600">
            {classroomData.subject_name_display}
          </span>
          <span className="mx-3 text-gray-600">|</span>
          <span className="text-gray-600">
            {classroomData.grade_level} - {classroomData.class_section}
          </span>
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

        <ConfirmDeleteModal
          isOpen={showConfirmDelete}
          onClose={() => {
            setShowConfirmDelete(false);
            setQuizToDelete(null);
          }}
          onConfirm={handleDeleteQuiz}
          title="Delete Quiz/Activity"
          message="Are you sure you want to delete this quiz/activity? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default ClassroomActions;
