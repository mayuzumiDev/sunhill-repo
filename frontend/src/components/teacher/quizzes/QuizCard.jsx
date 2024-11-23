import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const QuizCard = ({ quiz, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {quiz.title}
          </h3>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            {/* <span>Questions: {quiz.question_count || 0}</span>
            <span>•</span>
            <span>Duration: {quiz.duration || "No time limit"}</span> */}
          </div>
        </div>
        <div className="flex gap-2">
          {/* <button
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => onEdit(quiz.id)}
          >
            Edit
          </button> */}
          <button
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            onClick={() => onDelete(quiz.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
