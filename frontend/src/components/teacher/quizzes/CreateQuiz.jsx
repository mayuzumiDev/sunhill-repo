import React, { useState } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const CreateQuiz = ({ classroomId, onQuizCreated, onError, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    type_of: "quiz",
  });

  const [dateError, setDateError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionTypes = [
    { value: "single", label: "Single Choice" },
    { value: "multi", label: "Multiple Choice" },
    { value: "identification", label: "Identification" },
    { value: "true_false", label: "True or False" },
  ];

  const validateDueDate = (dateValue) => {
    if (!dateValue) return true; // Optional field

    const selectedDate = new Date(dateValue);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      setDateError("Due date cannot be in the past");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dueDate") {
      if (!validateDueDate(value)) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        question_type: "single",
        options: [""],
        correct_answer: "", // For single choice and identification
        correct_answers: [], // For multiple choice
      },
    ]);
  };

  const handleDeleteQuestion = (questionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, index) => index !== questionIndex)
    );
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i === index) {
          const updatedQuestion = { ...q, [field]: value };
          // Reset correct answers when changing question type
          if (field === "question_type") {
            if (value === "multi") {
              updatedQuestion.correct_answers = [];
              updatedQuestion.correct_answer = "";
            } else {
              updatedQuestion.correct_answer = "";
              updatedQuestion.correct_answers = [];
            }
            if (value === "identification") {
              updatedQuestion.options = [];
            } else if (updatedQuestion.options.length === 0) {
              updatedQuestion.options = [""];
            }
          }
          return updatedQuestion;
        }
        return q;
      })
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

  const formatQuestionData = (questions) => {
    return questions.map((question) => {
      const formattedQuestion = {
        text: question.text,
        question_type: question.question_type,
        correct_answer: question.correct_answer,
      };

      if (
        question.question_type === "single" ||
        question.question_type === "multi"
      ) {
        formattedQuestion.options = question.options.filter(
          (opt) => opt.trim() !== ""
        );
      }

      return formattedQuestion;
    });
  };

  const createQuestion = async (quizId, questionData) => {
    try {
      // Common question data
      const baseQuestionData = {
        quiz: quizId,
        text: questionData.text,
        question_type: questionData.question_type,
      };

      // Handle identification questions
      if (questionData.question_type === "identification") {
        const response = await axiosInstance.post(
          "/user-teacher/questions/create/",
          {
            ...baseQuestionData,
            correct_answer: questionData.correct_answer,
          }
        );

        if (response.status === 201) {
          console.log("Identification question created:", response.data);
          return response.data;
        }
        return null;
      }

      // Handle true/false questions
      if (questionData.question_type === "true_false") {
        const response = await axiosInstance.post(
          "/user-teacher/questions/create/",
          {
            ...baseQuestionData,
            correct_answer: questionData.correct_answer,
          }
        );

        if (response.status === 201) {
          console.log("True/False question created:", response.data);
          return response.data;
        }
        return null;
      }

      // Handle single and multiple choice questions
      if (
        questionData.question_type === "single" ||
        questionData.question_type === "multi"
      ) {
        let choices;

        if (questionData.question_type === "multi") {
          choices = questionData.options.map((text, index) => ({
            text,
            is_correct: (questionData.correct_answers || []).includes(
              index.toString()
            ),
          }));
        } else {
          // single choice
          choices = questionData.options.map((text, index) => ({
            text,
            is_correct: index.toString() === questionData.correct_answer,
          }));
        }

        const response = await axiosInstance.post(
          "/user-teacher/questions/create/",
          {
            ...baseQuestionData,
            choices: choices,
          }
        );

        if (response.status === 201) {
          console.log("Choice question created:", response.data);
          return response.data;
        }
        return null;
      }

      throw new Error(
        `Unsupported question type: ${questionData.question_type}`
      );
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  };

  // const createQuestion = async (quizId, questionData) => {
  //   try {
  //     // Handle true/false and identification questions separately
  //     if (
  //       questionData.question_type === "true_false" ||
  //       questionData.question_type === "identification"
  //     ) {
  //       const response = await axiosInstance.post(
  //         "/user-teacher/questions/create/",
  //         {
  //           quiz: quizId,
  //           text: questionData.text,
  //           question_type: questionData.question_type,
  //           correct_answer: questionData.correct_answer,
  //         }
  //       );
  //       if (response.status === 201) {
  //         console.log(
  //           `${questionData.question_type} question created successfully:`,
  //           response.data
  //         );
  //         return response.data;
  //       }
  //       return null;
  //     }

  //     let choices;

  //     if (questionData.question_type === "identification") {
  //       choices = [{ text: questionData.correct_answer, is_correct: true }];
  //     } else if (questionData.question_type === "multi") {
  //       choices = questionData.options.map((text, index) => ({
  //         text,
  //         is_correct: (questionData.correct_answers || []).includes(
  //           index.toString()
  //         ),
  //       }));
  //     } else {
  //       // single choice
  //       choices = questionData.options.map((text, index) => ({
  //         text,
  //         is_correct: index.toString() === questionData.correct_answer,
  //       }));
  //     }

  //     const response = await axiosInstance.post(
  //       "/user-teacher/questions/create/",
  //       {
  //         quiz: quizId,
  //         text: questionData.text,
  //         question_type: questionData.question_type,
  //         choices: choices,
  //       }
  //     );

  //     if (response.status === 201) {
  //       console.log("Question created successfully:", response.data);
  //       return response.data;
  //     }
  //   } catch (error) {
  //     console.error("Error creating question:", error);
  //     throw error;
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.dueDate && !validateDueDate(formData.dueDate)) {
      onError({ message: "Cannot create quiz/activity with a past due date" });
      return;
    }

    setIsSubmitting(true);
    try {
      // First create the quiz
      const quizResponse = await axiosInstance.post(
        "/user-teacher/quiz/create/",
        {
          title: formData.title,
          description: formData.description,
          type_of: formData.type_of,
          due_date: formData.dueDate
            ? new Date(formData.dueDate).toISOString()
            : null,
          classroom: classroomId,
        }
      );

      if (quizResponse.status === 201) {
        const quizData = quizResponse.data.quiz;
        console.log("Quiz Data: ", quizData);

        // Then create each question for the quiz
        for (const question of questions) {
          const questionData = {
            text: question.text,
            question_type: question.question_type,
            options:
              question.question_type === "identification"
                ? []
                : question.options,
            correct_answer: question.correct_answer,
            correct_answers: question.correct_answers,
          };

          await createQuestion(quizData.id, questionData);
        }

        onQuizCreated(quizData, "Quiz/Activity created successfully!");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create New Quiz/Activity</h2>
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
              pattern="^[a-zA-Z0-9. ]+$"
              onInvalid={(e) => {
                e.target.setCustomValidity(
                  "The title can only contain letters, numbers, spaces, and dots."
                );
              }}
              onInput={(e) => e.target.setCustomValidity("")} // Clears error on input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type_of"
              value={formData.type_of}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            >
              <option value="quiz">Quiz</option>
              <option value="activity">Activity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              pattern="^[a-zA-Z0-9. ]+$"
              onInvalid={(e) => {
                e.target.setCustomValidity(
                  "The description can only contain letters, numbers, spaces, and dots."
                );
              }}
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
              min={new Date().toISOString().slice(0, 16)}
              placeholder="Select a due date (optional)"
              className={`w-full px-3 py-2 border ${
                dateError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 ${
                dateError ? "focus:ring-red-500" : "focus:ring-green-500"
              }`}
            />
            {dateError && (
              <p className="mt-1 text-sm text-red-600">{dateError}</p>
            )}
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
                            question.question_type === "multi"
                              ? (question.correct_answers || []).includes(
                                  optionIndex.toString()
                                )
                              : optionIndex.toString() ===
                                question.correct_answer
                          }
                          onChange={() => {
                            if (question.question_type === "multi") {
                              const currentAnswers =
                                question.correct_answers || [];
                              const newAnswers = currentAnswers.includes(
                                optionIndex.toString()
                              )
                                ? currentAnswers.filter(
                                    (ans) => ans !== optionIndex.toString()
                                  )
                                : [...currentAnswers, optionIndex.toString()];
                              handleQuestionChange(
                                questionIndex,
                                "correct_answers",
                                newAnswers
                              );
                            } else {
                              handleQuestionChange(
                                questionIndex,
                                "correct_answer",
                                optionIndex.toString()
                              );
                            }
                          }}
                          className="h-4 w-4 accent-green-600"
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
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 border border-transparent hover:border-green-200 transition-all duration-200"
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="w-4 h-4 mr-2 text-green-600"
                        />
                        Add Option
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(questionIndex)}
                        className="inline-flex items-center px-4 py-2 ml-3 text-sm font-bold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 border border-transparent hover:border-red-200 transition-all duration-200"
                      >
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="w-4 h-4 mr-2 text-red-600"
                        />
                        Delete Question
                      </button>
                    </div>
                  </div>
                )}

                {question.question_type === "true_false" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`correct_answer_${questionIndex}`}
                          value="true"
                          checked={question.correct_answer === "true"}
                          onChange={(e) =>
                            handleQuestionChange(
                              questionIndex,
                              "correct_answer",
                              e.target.value
                            )
                          }
                          className="form-radio h-4 w-4 accent-green-600"
                        />
                        <span className="ml-2">True</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`correct_answer_${questionIndex}`}
                          value="false"
                          checked={question.correct_answer === "false"}
                          onChange={(e) =>
                            handleQuestionChange(
                              questionIndex,
                              "correct_answer",
                              e.target.value
                            )
                          }
                          className="form-radio h-4 w-4 accent-green-600"
                        />
                        <span className="ml-2">False</span>
                      </label>
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
                          e.target.value.toUpperCase()
                        )
                      }
                      style={{ textTransform: "uppercase" }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="ENTER THE CORRECT ANSWER"
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
              className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
              disabled={
                isSubmitting || questions.length === 0 || !formData.dueDate
              }
              className={`px-4 py-2 text-sm font-bold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isSubmitting || questions.length === 0 || !formData.dueDate
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
                  Creating Quiz/Activity...
                </span>
              ) : (
                "Create Quiz/Activity"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateQuiz;
