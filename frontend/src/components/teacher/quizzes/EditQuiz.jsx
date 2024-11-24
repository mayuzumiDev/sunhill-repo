import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";

const EditQuiz = ({
  quizId,
  classroomId,
  onQuizUpdated,
  onError,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionTypes = [
    { value: "single", label: "Single Choice" },
    { value: "multi", label: "Multiple Choice" },
    { value: "identification", label: "Identification" },
  ];

  // Fetch existing quiz data and its questions
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Fetch quiz data from list endpoint
        const quizResponse = await axiosInstance.get(
          `/user-teacher/quiz/list/?classroom_id=${classroomId}`
        );
        const quizData = quizResponse.data.quizzes.find(
          (q) => q.id === parseInt(quizId)
        );

        if (!quizData) {
          throw new Error("Quiz not found");
        }

        setFormData({
          title: quizData.title,
          description: quizData.description,
          dueDate: quizData.due_date || "",
        });

        // Fetch questions for this quiz
        const questionsResponse = await axiosInstance.get(
          "/user-teacher/questions/list/",
          {
            params: { quiz: quizId },
          }
        );

        // Format questions data
        const formattedQuestions = questionsResponse.data.questions.map(
          (q) => ({
            id: q.id,
            text: q.text,
            question_type: q.question_type,
            options: q.choices.map((c) => c.text),
            correct_answer:
              q.question_type === "identification"
                ? q.choices.find((c) => c.is_correct)?.text || ""
                : q.question_type === "multi"
                ? q.choices
                    .map((c, idx) => (c.is_correct ? idx.toString() : null))
                    .filter((idx) => idx !== null)
                : q.choices.findIndex((c) => c.is_correct).toString(),
          })
        );

        setQuestions(formattedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        onError(error);
      }
    };

    fetchQuizData();
  }, [quizId, classroomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        question_type: "single",
        options: [""],
        correct_answer: "0",
      },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleAddOption = (questionIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleDeleteQuestion = async (questionIndex) => {
    const question = questions[questionIndex];
    if (question.id) {
      try {
        // Delete existing question using the detail endpoint
        await axiosInstance.delete(`/user-teacher/questions/${question.id}/`);
        setQuestions((prevQuestions) =>
          prevQuestions.filter((_, index) => index !== questionIndex)
        );
      } catch (error) {
        console.error("Error deleting question:", error);
        onError(error);
      }
    } else {
      // Remove new question from state
      setQuestions((prevQuestions) =>
        prevQuestions.filter((_, index) => index !== questionIndex)
      );
    }
  };

  const updateQuestion = async (questionId, questionData) => {
    try {
      const choices =
        questionData.question_type === "identification"
          ? [{ text: questionData.options[0], is_correct: true }]
          : questionData.options.map((text, index) => ({
              text,
              is_correct:
                questionData.question_type === "multi"
                  ? questionData.correct_answer.includes(index.toString())
                  : index.toString() === questionData.correct_answer,
            }));

      // Use the detail endpoint for updating
      const response = await axiosInstance.put(
        `/user-teacher/questions/${questionId}/`,
        {
          quiz: quizId,
          text: questionData.text,
          question_type: questionData.question_type,
          choices: choices,
        }
      );

      if (response.status === 200) {
        return response.data.question;
      }
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  };

  const createQuestion = async (questionData) => {
    try {
      const choices =
        questionData.question_type === "identification"
          ? [{ text: questionData.correct_answer, is_correct: true }]
          : questionData.options.map((text, index) => ({
              text,
              is_correct:
                questionData.question_type === "multi"
                  ? questionData.correct_answer.includes(index.toString())
                  : index.toString() === questionData.correct_answer,
            }));

      const response = await axiosInstance.post(
        "/user-teacher/questions/create/",
        {
          quiz: quizId,
          text: questionData.text,
          question_type: questionData.question_type,
          choices: choices,
        }
      );

      if (response.status === 201) {
        return response.data.question;
      }
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Update the quiz details
      const quizResponse = await axiosInstance.put(
        `/user-teacher/quiz/update/${quizId}/`,
        {
          ...formData,
          classroom: classroomId,
        }
      );

      if (quizResponse.status === 200) {
        const quizData = quizResponse.data;

        // Handle questions updates
        for (const question of questions) {
          const questionData = {
            text: question.text,
            question_type: question.question_type,
            options: question.options.filter((opt) => opt.trim() !== ""),
            correct_answer: question.correct_answer,
          };

          if (question.id) {
            // Update existing question
            await updateQuestion(question.id, questionData);
          } else {
            // Create new question
            await createQuestion(questionData);
          }
        }

        const updatedQuizResponse = await axiosInstance.get(
          `/user-teacher/quiz/list/?classroom_id=${classroomId}`
        );

        if (updatedQuizResponse.status === 200) {
          const updatedQuiz = updatedQuizResponse.data.quizzes.find(
            (q) => q.id === parseInt(quizId)
          );
          if (updatedQuiz) {
            onQuizUpdated(updatedQuiz, "Quiz updated successfully!");
          }
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <DotLoaderSpinner color="#4ade80" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              placeholder="Select a due date (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Question {questionIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        "text",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Enter your question"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Question Type
                  </label>
                  <select
                    value={question.question_type}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        "question_type",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  >
                    {questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Options for multiple choice or single choice questions */}
                {(question.question_type === "single" ||
                  question.question_type === "multi") && (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Options
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type={
                            question.question_type === "single"
                              ? "radio"
                              : "checkbox"
                          }
                          name={`question-${questionIndex}-correct`}
                          checked={
                            question.question_type === "single"
                              ? question.correct_answer ===
                                optionIndex.toString()
                              : Array.isArray(question.correct_answer) &&
                                question.correct_answer.includes(
                                  optionIndex.toString()
                                )
                          }
                          onChange={() => {
                            const newCorrectAnswer =
                              question.question_type === "single"
                                ? optionIndex.toString()
                                : Array.isArray(question.correct_answer)
                                ? question.correct_answer.includes(
                                    optionIndex.toString()
                                  )
                                  ? question.correct_answer.filter(
                                      (ans) => ans !== optionIndex.toString()
                                    )
                                  : [
                                      ...question.correct_answer,
                                      optionIndex.toString(),
                                    ]
                                : [optionIndex.toString()];
                            handleQuestionChange(
                              questionIndex,
                              "correct_answer",
                              newCorrectAnswer
                            );
                          }}
                          className="h-4 w-4"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-2">
                      <button
                        type="button"
                        onClick={() => handleAddOption(questionIndex)}
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 border border-transparent hover:border-blue-200 transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Option
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(questionIndex)}
                        className="inline-flex items-center px-4 py-2 ml-3 text-sm font-bold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 border border-transparent hover:border-red-200 transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete Question
                      </button>
                    </div>
                  </div>
                )}

                {/* Correct answer for identification questions */}
                {question.question_type === "identification" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={question.correct_answer}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "correct_answer",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Enter the correct answer"
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Question
            </button>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-bold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isSubmitting
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating Quiz...
                </span>
              ) : (
                "Update Quiz"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditQuiz;
