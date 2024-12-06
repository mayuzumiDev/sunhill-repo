import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const QuizCard = ({ quizData, onSelect }) => {
  const handleClick = () => {
    if (
      !quizData.has_submitted &&
      Date.parse(quizData.due_date) >= Date.now()
    ) {
      onSelect(quizData);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl p-4 md:p-6 shadow-md cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] relative overflow-hidden mx-2 md:mx-4 mb-4 flex flex-col md:flex-row items-center ${
        !quizData.has_submitted && Date.parse(quizData.due_date) >= Date.now()
          ? ""
          : "opacity-80 cursor-not-allowed hover:scale-100"
      }`}
    >
      {/* Background shapes with reduced opacity */}
      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full -mr-8 -mt-8 md:-mr-12 md:-mt-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full -ml-8 -mb-8 md:-ml-12 md:-mb-12"></div>

      <div className="relative z-10 flex flex-col md:flex-row w-full items-center space-y-4 md:space-y-0">
        {/* Title and Description Section */}
        <div className="flex-grow min-w-0">
        <h2 className="font-bold text-xl md:text-2xl text-white mb-2 break-words">
          {quizData.title}
        </h2>

          {quizData.description && (
            <p className="text-white/90 text-sm md:text-base mb-2 line-clamp-1">
              {quizData.description}
            </p>
          )}
        </div>

        {/* Quiz Details Section */}
        <div className="flex flex-row md:space-x-6 items-center shrink-0">
          <div className="flex items-center px-2 md:px-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center mr-2 md:mr-3">
              <FontAwesomeIcon icon={faBook} className="text-white text-sm md:text-lg" />
            </div>
            <p className="text-white/90 text-sm md:text-base max-w-[90px] md:max-w-[120px] truncate">
              <span className="font-bold truncate block">
                {quizData.subject_display}
              </span>
            </p>
          </div>

          {/* Status indicator */}
          {Date.parse(quizData.due_date) < Date.now() &&
          !quizData.has_submitted ? (
            <div className="flex items-center px-2 md:px-4 border-l border-white/20">
              <span className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-red-500 mr-2 md:mr-3"></span>
              <span className="text-white/90 text-sm md:text-base font-medium">
                Quiz past due date!
              </span>
            </div>
          ) : quizData.has_submitted ? (
            <div className="flex items-center px-2 md:px-4 border-l border-white/20">
              <span className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-300 mr-2 md:mr-3"></span>
              <span className="text-white/90 text-sm md:text-base font-medium">
                Great job! Quiz completed!
              </span>
            </div>
          ) : (
            <div className="flex items-center px-2 md:px-4 border-l border-white/20">
              <span className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-yellow-300 animate-pulse mr-2 md:mr-3"></span>
              <span className="text-white/90 text-sm md:text-base font-medium">
                Ready to start! Let's go!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
