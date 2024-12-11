import React from "react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TodoQuizCard = ({ quiz, index, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-purple-100 overflow-hidden relative hover:-translate-y-1 group"
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-100 rounded-full opacity-20" />
      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-pink-100 rounded-full opacity-20" />

      {/* Quiz number bubble */}
      <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-lg">{index + 1}</span>
      </div>

      {/* Content */}
      <div className="ml-8 mt-2">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
          {quiz.title}
        </h3>

        {/* Optional: Add more quiz details here */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="bg-purple-100 px-3 py-1 rounded-full">
            {quiz.type_of === "quiz"
              ? "Quiz"
              : quiz.type_of === "activity"
              ? "Activity"
              : "Quiz / Activity"}
          </span>
          {quiz.estimatedTime && (
            <span className="bg-pink-100 px-3 py-1 rounded-full">
              {quiz.estimatedTime} mins
            </span>
          )}
        </div>
      </div>

      {/* Start button */}
      <div className="mt-4 flex justify-end">
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
          Start →
        </button>
      </div>
    </div>
  );
};

const EmptyTodoCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 overflow-hidden relative min-h-[200px]">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-100 rounded-full opacity-20" />
      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-pink-100 rounded-full opacity-20" />

      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-3xl text-purple-500"
        />
        <p className="text-gray-600 text-xl text-center font-semibold">
          All Done!
        </p>
        <p className="text-gray-400 text-base text-center">
          Your to-do list is empty for now
        </p>
      </div>
    </div>
  );
};

export { TodoQuizCard, EmptyTodoCard };
export default TodoQuizCard;
