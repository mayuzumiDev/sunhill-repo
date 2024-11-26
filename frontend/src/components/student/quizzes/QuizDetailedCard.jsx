import React, { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { axiosInstance } from "../../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faBookOpen,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const QuizDetailCard = ({ quizData, onStartQuiz, onBack, isQuizStarted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isQuizStarted && !questions) {
      fetchQuizQuestions();
    }
  }, [isQuizStarted]);

  const fetchQuizQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/api/user-student/quiz/${quizData.id}/questions/`
      );

      if (response.status === 200) {
        const question_list = response.data.questions;
        console.log("Questions and Choices: ", question_list);
        setQuestions(question_list);
      }
    } catch (error) {
      console.error("An error occured fetching the quiz questions.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuizResponses = async () => {
    try {
      setIsSubmitting(true);

      const formattedResponses = Object.entries(responses).reduce(
        (acc, [questionId, response]) => {
          // For single choice questions, take the first (and only) item from the array
          const answer = response.answer;
          acc[questionId] =
            Array.isArray(answer) && answer.length === 1
              ? answer[0] // Single choice - take the single value
              : answer; // Multiple choice or identification - keep as is
          return acc;
        },
        {}
      );

      const response = await axiosInstance.post(
        "/user-teacher/quiz-responses/create/",
        {
          quiz: quizData.id,
          classroom: quizData.classroom_details.id,
          responses: formattedResponses,
        }
      );

      if (response.status === 201) {
        // Handle successful submission
        const { score } = response.data;
        // You can add a success message or redirect here
        onBack(); // Or handle completion differently
      }
    } catch (error) {
      console.error("Error submitting quiz responses:", error);
      // Handle error - show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = (response) => {
    // Save the response
    setResponses((prev) => ({
      ...prev,
      [response.questionId]: response,
    }));

    if (currentQuestionIndex === questions.length - 1) {
      // If this is the last question, submit the quiz
      submitQuizResponses();
    } else {
      // Otherwise, move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (questions && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (isQuizStarted) {
    if (isLoading || isSubmitting) {
      return (
        <div className="flex justify-center items-center h-64">
          <DotLoaderSpinner />
          {isSubmitting && (
            <p className="ml-3 text-purple-600">Submitting your quiz...</p>
          )}
        </div>
      );
    }

    if (questions) {
      if (questions && questions.length > 0) {
        return (
          <div className="space-y-6">
            <QuestionCard
              question={questions[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        );
      }

      return console.log(questions[currentQuestionIndex]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border-2 border-purple-100 relative">
        {/* Fun decorative elements */}
        <div className="absolute top-4 right-4">
          <FontAwesomeIcon
            icon={faStar}
            className="text-yellow-400 text-2xl animate-pulse"
          />
        </div>

        {/* Quiz Description */}
        <div className="mb-8">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {quizData.description}
          </p>

          {/* Quiz Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="text-purple-600 text-xl"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-semibold text-purple-800">
                  {quizData.subject_display}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <FontAwesomeIcon
                  icon={faChalkboardTeacher}
                  className="text-purple-600 text-xl"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Class Details</p>
                <p className="font-semibold text-purple-800">
                  {quizData.classroom_details.instructor || "Teacher"} •{" "}
                  {quizData.classroom_details.section || "N/A"}
                </p>
                <p className="text-sm text-purple-600">
                  Grade {quizData.classroom_details.grade_level || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 px-4">
        <button
          onClick={onStartQuiz}
          className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 
                   transition-all transform hover:scale-[1.02] font-bold text-lg shadow-lg
                   hover:shadow-xl active:scale-[0.98]"
        >
          Start Your Quiz!
        </button>

        <button
          onClick={onBack}
          className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl
                   hover:bg-purple-50 transition-all font-semibold"
        >
          Want to see other quizzes? Let's go back!
        </button>
      </div>
    </div>
  );
};

export default QuizDetailCard;
