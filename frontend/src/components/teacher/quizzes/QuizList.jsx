import React, { useState } from "react";
import QuizCard from "./QuizCard";
import CreateQuiz from "./CreateQuiz";
import EditQuiz from "./EditQuiz";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import CustomAlert from "../../../components/alert/teacher/CustomAlert";

const QuizList = ({
  isLoading,
  showCreateQuiz,
  showEditQuiz,
  selectedQuiz,
  quizzes = [],
  selectedClassroom,
  onQuizCreated,
  onQuizUpdated,
  onCreateQuizError,
  onSetShowCreateQuiz,
  onSetShowEditQuiz,
  onSetSelectedQuiz,
  onSetShowConfirmDelete,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleError = (error) => {
    setAlertMessage(error.message || "An error occurred");
    setAlertType("error");
    setShowAlert(true);
  };

  const handleSuccess = (message) => {
    setAlertMessage(message);
    setAlertType("success");
    setShowAlert(true);
  };

  return (
    <div>
      <CustomAlert
        message={alertMessage}
        type={alertType}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />

      {/* Create Quiz Button */}
      {!showCreateQuiz && !showEditQuiz && (
        <button
          onClick={() => onSetShowCreateQuiz(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-bold mb-6"
        >
          Create
        </button>
      )}

      {/* Quiz List Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <DotLoaderSpinner color="#4ade80" />
        </div>
      ) : showCreateQuiz ? (
        <CreateQuiz
          classroomId={selectedClassroom?.id}
          onQuizCreated={(quiz) => {
            onQuizCreated(quiz);
            handleSuccess("Quiz/Activity created successfully!");
          }}
          onError={(error) => {
            onCreateQuizError(error);
            handleError(error);
          }}
          onCancel={() => onSetShowCreateQuiz(false)}
        />
      ) : showEditQuiz && selectedQuiz ? (
        <EditQuiz
          quizId={selectedQuiz.id}
          classroomId={selectedClassroom?.id}
          onQuizUpdated={(quiz) => {
            onQuizUpdated(quiz);
            handleSuccess("Quiz/Activity updated successfully!");
          }}
          onError={(error) => {
            onCreateQuizError(error);
            handleError(error);
          }}
          onCancel={() => {
            onSetShowEditQuiz(false);
            onSetSelectedQuiz(null);
          }}
        />
      ) : Array.isArray(quizzes) && quizzes.length === 0 ? (
        <p className="text-gray-600 text-center">
          No quizzes/activities created yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {quizzes?.map((quiz, index) => (
            <QuizCard
              quiz={quiz}
              onEdit={() => {
                onSetShowEditQuiz(true);
                onSetSelectedQuiz(quiz);
              }}
              onDelete={(quizId) => {
                onSetShowConfirmDelete(true);
                onSetSelectedQuiz(quizId);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
