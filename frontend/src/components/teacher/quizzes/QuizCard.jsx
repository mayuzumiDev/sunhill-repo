import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineMenu } from "react-icons/ai";

const QuizCard = ({ quiz, onEdit, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = (e) => {
    // Prevent edit when interacting with dropdown
    if (e.target.closest(".dropdown-menu")) return;
    onEdit(quiz);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(quiz.id);
    setDropdownOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {quiz.title}
          </h3>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              quiz.type_of === "quiz"
                ? "bg-green-200 text-green-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {quiz.type_of?.charAt(0).toUpperCase() + quiz.type_of?.slice(1)}
          </span>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
        </div>
        <div className="relative">
          <button
            className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={toggleDropdown}
          >
            <AiOutlineMenu size={20} />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
