import React, { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import StudentAlert from "../../alert/student/StudentAlert";
import { axiosInstance } from "../../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

const QuizDetailCard = ({
  quizData,
  onStartQuiz,
  onBack,
  isQuizStarted,
  setIsQuizStarted,
  onQuizComplete,
  onQuizScoreChange,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [responses, setResponses] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [shouldSubmit, setShouldSubmit] = useState(false);

  useEffect(() => {
    if (isQuizStarted && !questions) {
      fetchQuizQuestions();
    }
  }, [isQuizStarted]);

  useEffect(() => {
    if (shouldSubmit) {
      submitQuizResponses();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, responses]);

  useEffect(() => {
    if (alertMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const fetchQuizQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/api/user-student/quiz/${quizData.id}/questions/`
      );

      if (response.status === 200) {
        const question_list = response.data.questions;
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

      const unansweredQuestions = questions.filter((q) => !responses[q.id]);
      if (unansweredQuestions.length > 0) {
        setAlertMessage("Don't forget to answer all the questions!");
        setIsSubmitting(false);
        return;
      }

      // Log the original responses and questions
      console.log("Original Responses:", responses);
      console.log("Questions:", questions);

      const formattedResponses = Object.entries(responses).reduce(
        (acc, [questionId, response]) => {
          const answer = response.answer;
          const questionType = questions?.find(
            (q) => q.id.toString() === questionId
          )?.question_type;

          // Log each question and its answer being processed
          console.log("Processing Question:", {
            questionId,
            questionType: questions?.question_type,
            originalAnswer: answer,
          });

          // Format answer based on question type
          if (questionType === "multi") {
            // For multiple choice, ensure it's an array
            acc[questionId] = Array.isArray(answer) ? answer : [answer];
          } else {
            // For single choice and identification, keep as single value
            acc[questionId] = Array.isArray(answer) ? answer[0] : answer;
          }

          console.log(
            "Formatted answer for question",
            questionId,
            ":",
            acc[questionId]
          );
          return acc;
        },
        {}
      );

      console.log("Final Formatted Responses:", formattedResponses);

      const response = await axiosInstance.post(
        "/user-teacher/quiz-responses/create/",
        {
          quiz: quizData.id,
          classroom: quizData.classroom_details.id,
          responses: formattedResponses,
        }
      );

      if (response.status === 201) {
        // Get score data from the response
        const { data } = response.data;
        setQuizScore({
          totalScore: data.total_score,
          totalPossible: data.total_possible,
          percentageScore: data.percentage_score,
          status: data.status,
        });

        onQuizScoreChange?.(true);

        console.log("Server Response:", {
          data,
          formattedResponses,
          questions: questions.map((q) => ({
            id: q.id,
            type: q.question_type,
            correctChoices: q.choices?.filter((c) => c.is_correct),
          })),
        });

        onQuizComplete?.(true);
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

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      // If this is the last question, trigger submission
      setShouldSubmit(true);
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
          <DotLoaderSpinner color="#6B21A8" />
          {isSubmitting && (
            <p className="ml-3 text-purple-600">Submitting your answers...</p>
          )}
        </div>
      );
    }

    if (quizScore) {
      const getEncouragingMessage = (status, score, total) => {
        if (status === "passed") {
          if (score === total) {
            return "Perfect Score! You're Amazing!";
          }
          return "Great Job! Keep up the good work! ";
        }
        return "Don't worry! You can try again!";
      };

      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-100 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-200 rounded-full opacity-20 transform -translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-20 transform rotate-45"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-purple-800 mb-8 text-center">
              Results
            </h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl shadow-md">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-purple-800">
                    You got{" "}
                    <span className="text-4xl text-purple-600">
                      {quizScore.totalScore}
                    </span>{" "}
                    out of {quizScore.totalPossible}!
                  </p>
                </div>

                <p className="text-2xl text-center font-medium text-purple-700 mt-4">
                  {getEncouragingMessage(
                    quizScore.status,
                    quizScore.totalScore,
                    quizScore.totalPossible
                  )}
                </p>

                <div className="text-center mt-6">
                  <span
                    className={`inline-block px-6 py-2 rounded-full text-xl font-bold ${
                      quizScore.status === "passed"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {quizScore.status === "passed"
                      ? "You Passed!"
                      : "Try Again!"}
                  </span>
                </div>
              </div>

              <button
                onClick={onBack}
                className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 
                         transition-all transform hover:scale-[1.02] text-xl font-bold shadow-lg"
              >
                Back to More Fun Quizzes/Activities!
              </button>
            </div>
          </div>
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
              onBack={onBack}
            />
          </div>
        );
      }

      return console.log(questions[currentQuestionIndex]);
    }
  }

  return (
    <div className="space-y-6">
      <StudentAlert message={alertMessage} isVisible={showAlert} />
      <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border-2 border-purple-100 relative">
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
          Start Your Challenge!
        </button>

        <button
          onClick={onBack}
          className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl
                   hover:bg-purple-50 transition-all font-semibold"
        >
          Want to see other quizzes and activities? Let's go back!
        </button>
      </div>
    </div>
  );
};

export default QuizDetailCard;
