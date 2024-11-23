import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import ClassroomCard from "../../components/teacher/quizzes/ClassroomCard";
import CreateQuiz from "../../components/teacher/quizzes/CreateQuiz";
import QuizCard from "../../components/teacher/quizzes/QuizCard";
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";
import CustomAlert from "../../components/alert/teacher/CustomAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const ManageAssignments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const [classrooms, setClassrooms] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

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

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/user-teacher/quiz/list/");

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

  const handleQuizCreated = (newQuiz) => {
    setQuizzes((prev) => [...prev, newQuiz]);
    setShowCreateQuiz(false);
  };

  const handleEditQuiz = async () => {};

  const handleDeleteQuiz = async () => {};

  return (
    <div className="p-6">
      {!selectedClassroom ? (
        <>
          <h1 className="text-2xl font-bold mb-12">Manage Quizzes</h1>

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
              {!showCreateQuiz && (
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
                  onCancel={() => setShowCreateQuiz(false)}
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
                      onEdit={handleEditQuiz}
                      onDelete={handleDeleteQuiz}
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
