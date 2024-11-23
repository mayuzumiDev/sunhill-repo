import React, { useState } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";

const CreateQuiz = ({ classroomId, onQuizCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const questionTypes = [
    { value: "single", label: "Single Choice" },
    { value: "multi", label: "Multiple Choice" },
    { value: "identification", label: "Identification" },
  ];

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
        question_text: "",
        question_type: "single",
        options: [""],
        correct_answer: "",
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

  const formatQuestionData = (questions) => {
    return questions.map((question) => {
      const formattedQuestion = {
        question_text: question.question_text,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user-teacher/quiz/create/", {
        ...formData,
        classroom: classroomId,
      });

      if (response.status === 201) {
        const quizData = response.data.quiz;
        console.log("Quiz Data: ", quizData);
        onQuizCreated(quizData);
      }
    } catch (error) {
      console.error("An error occured saving the quiz.", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question {questionIndex + 1}
                </label>
                <input
                  type="text"
                  value={question.question_text}
                  onChange={(e) =>
                    handleQuestionChange(
                      questionIndex,
                      "question_text",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter your question"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700">
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
                            ? question.correct_answer === option
                            : question.correct_answer?.includes(option)
                        }
                        onChange={() =>
                          handleQuestionChange(
                            questionIndex,
                            "correct_answer",
                            question.question_type === "single"
                              ? option
                              : question.correct_answer?.includes(option)
                              ? question.correct_answer.filter(
                                  (ans) => ans !== option
                                )
                              : [...(question.correct_answer || []), option]
                          )
                        }
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
                  <button
                    type="button"
                    onClick={() => handleAddOption(questionIndex)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {/* Correct answer for identification questions */}
              {question.question_type === "identification" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
