import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const QuizCard = ({ quizData, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(quizData)}
      className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl p-6 shadow-md cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] relative overflow-hidden mx-4 mb-4 flex flex-col md:flex-row items-center"
    >
      {/* Background shapes with reduced opacity */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10 flex flex-col md:flex-row w-full items-center space-y-4 md:space-y-0">
        {/* Title and Description Section */}
        <div className="flex-grow min-w-0">
          <h2 className="font-bold text-2xl text-white mb-2 truncate">
            {quizData.title}
          </h2>
          {quizData.description && (
            <p className="text-white/90 text-base mb-2 line-clamp-1">
              {quizData.description}
            </p>
          )}
        </div>

        {/* Quiz Details Section */}
        <div className="flex flex-row md:space-x-6 items-center shrink-0">
          <div className="flex items-center px-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faBook} className="text-white text-lg" />
            </div>
            <p className="text-white/90 text-base max-w-[120px]">
              <span className="font-bold truncate block">
                {quizData.subject_display}
              </span>
            </p>
          </div>

          {/* Status indicator */}
          {quizData.has_submitted ? (
            <div className="flex items-center px-4 border-l border-white/20">
              <span className="h-4 w-4 rounded-full bg-green-400 mr-3"></span>
              <span className="text-white/90 text-base font-medium">
                Submitted
              </span>
            </div>
          ) : (
            <div className="flex items-center px-4 border-l border-white/20">
              <span className="h-4 w-4 rounded-full bg-yellow-400 animate-pulse mr-3"></span>
              <span className="text-white/90 text-base font-medium">
                Pending
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
