import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import ClassroomCard from "../../components/teacher/quizzes/ClassroomCard";
import CreateQuiz from "../../components/teacher/quizzes/CreateQuiz";
import EditQuiz from "../../components/teacher/quizzes/EditQuiz";
import QuizCard from "../../components/teacher/quizzes/QuizCard";
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";
import CustomAlert from "../../components/alert/teacher/CustomAlert";
import ConfirmDeleteModal from "../../components/modal/teacher/ConfirmDeleteModal";
import HideScrollBar from "../../components/misc/HideScrollBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const ManageAssignments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showEditQuiz, setShowEditQuiz] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const [classrooms, setClassrooms] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchClassroom();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetchQuizzes(selectedClassroom.id);
    }
  }, [selectedClassroom]);

  const fetchClassroom = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get("/user-teacher/classroom/list/");

      if (response.status === 200) {
        const classroomList = response.data.classroom_list;
        setClassrooms(classroomList);
      }
    } catch (error) {
      console.error("An error occured fetching the classroom list.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuizzes = async (classroomId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/user-teacher/quiz/list/?classroom_id=${classroomId}`
      );

      if (response.status === 200) {
        const quiz_list = response.data.quizzes;
        setQuizzes(quiz_list);
      }
    } catch (error) {
      console.error("An error occurred fetching the quiz list.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    setShowCreateQuiz(true);
  };

  const handleQuizCreated = (newQuiz, message) => {
    setQuizzes((prev) => [...prev, newQuiz]);
    setShowCreateQuiz(false);

    setAlertType("success");
    setAlertMessage(message || "Quiz created successfully!");
    setShowAlert(true);
  };

  const handleCreateQuizError = (error) => {
    setAlertType("error");
    setAlertMessage(error.response?.data?.message || "Failed to create quiz");
    setShowAlert(true);
  };

  // const handleEditQuiz = (quizId) => {
  //   const quiz = quizzes.find((q) => q.id === quizId);
  //   setSelectedQuiz(quiz);
  //   setShowEditQuiz(true);
  // };

  const handleQuizUpdated = (updatedQuiz, message) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) =>
        quiz.id === updatedQuiz.id ? updatedQuiz : quiz
      )
    );
    setShowEditQuiz(false);
    setSelectedQuiz(null);
    setAlertType("success");
    setAlertMessage(message || "Quiz updated successfully!");
    setShowAlert(true);

    // await fetchQuizzes();
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const response = await axiosInstance.delete(
        `/user-teacher/quiz/delete/${quizId}/`
      );

      if (response.status === 200) {
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz.id !== quizId)
        );

        setAlertType("success");
        setAlertMessage("Quiz deleted successfully");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Failed to delete quiz");
      setShowAlert(true);
    }
  };

  return (
    <div className="p-6">
      <HideScrollBar />
      <CustomAlert
        message={alertMessage}
        type={alertType}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <ConfirmDeleteModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => handleDeleteQuiz(selectedQuiz)}
        message={`Are you sure you want to delete this quiz? This action cannot be undone.`}
      />

      {!selectedClassroom ? (
        <>
          <h1 className="text-2xl font-bold mb-12 text-gray-500">
            Manage Quizzes
          </h1>

          {/* Grid List for classroom */}
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <DotLoaderSpinner color="#4ade80" />
            </div>
          ) : classrooms.length === 0 ? (
            <p className="text-gray-600">
              No classroom available. Please create a classroom.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom, index) => (
                <ClassroomCard
                  key={classroom.id || index}
                  classroomData={classroom}
                  onSelect={() => setSelectedClassroom(classroom)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="flex items-center mb-8">
            <button
              onClick={() => setSelectedClassroom(null)}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">
              {selectedClassroom.grade_level} -{" "}
              {selectedClassroom.class_section}
            </h1>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">
                  Subject:{" "}
                  <span className="font-semibold">
                    {selectedClassroom.subject_name_display}
                  </span>
                </p>
              </div>
              {/* Button for Create Quiz */}
              {!showCreateQuiz && !showEditQuiz && (
                <button
                  onClick={handleCreateQuiz}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-bold"
                >
                  Create Quiz
                </button>
              )}
            </div>

            {/* Materials Grid List */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-600">
                Quizzes
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <DotLoaderSpinner color="#4ade80" />
                </div>
              ) : showCreateQuiz ? (
                <CreateQuiz
                  classroomId={selectedClassroom.id}
                  onQuizCreated={handleQuizCreated}
                  onError={handleCreateQuizError}
                  onCancel={() => setShowCreateQuiz(false)}
                />
              ) : showEditQuiz && selectedQuiz ? (
                <EditQuiz
                  quizId={selectedQuiz.id}
                  classroomId={selectedClassroom.id}
                  onQuizUpdated={handleQuizUpdated}
                  onError={handleCreateQuizError}
                  onCancel={() => {
                    setShowEditQuiz(false);
                    setSelectedQuiz(null);
                  }}
                />
              ) : quizzes.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No quizzes created yet.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {quizzes.map((quiz, index) => (
                    <QuizCard
                      key={quiz.id || index}
                      quiz={quiz}
                      onEdit={() => {
                        setShowEditQuiz(true);
                        setSelectedQuiz(quiz);
                      }}
                      onDelete={() => {
                        setShowConfirmDelete(true);
                        setSelectedQuiz(quiz.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAssignments;
