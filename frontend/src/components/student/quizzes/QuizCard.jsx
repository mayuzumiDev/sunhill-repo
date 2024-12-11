import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCheckCircle,
  faHourglassHalf,
  faPlayCircle,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

const QuizCard = ({ quizData, onSelect }) => {
  const handleClick = () => {
    if (
      !quizData.has_submitted &&
      Date.parse(quizData.due_date) >= Date.now()
    ) {
      onSelect(quizData);
    }
  };

  const getStatusColor = () => {
    if (Date.parse(quizData.due_date) < Date.now() && !quizData.has_submitted) {
      return "from-purple-800 to-purple-600";
    }
    if (quizData.has_submitted) {
      return "from-purple-700 to-purple-500";
    }
    return "from-purple-600 to-purple-400";
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-gradient-to-r ${getStatusColor()} rounded-xl p-4 md:p-6 shadow-md cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] relative overflow-hidden mx-2 md:mx-4 mb-4 flex flex-col md:flex-row items-center ${
        !quizData.has_submitted && Date.parse(quizData.due_date) >= Date.now()
          ? ""
          : "opacity-90 cursor-not-allowed hover:scale-100"
      }`}
    >
      {/* Background shapes with reduced opacity */}
      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full -mr-8 -mt-8 md:-mr-12 md:-mt-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full -ml-8 -mb-8 md:-ml-12 md:-mb-12"></div>

      <div className="relative z-10 flex flex-col md:flex-row w-full items-center space-y-4 md:space-y-0">
        {/* Title and Description Section */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <FontAwesomeIcon
                icon={faBook}
                className="text-white text-sm md:text-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-xl md:text-2xl text-white break-words">
                  {quizData.title}
                </h2>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-white/90 text-xs font-medium">
                  {quizData.type_of === "quiz" ? "Quiz" : "Activity"}
                </span>
              </div>
              <span className="text-white/80 text-sm font-medium">
                {quizData.subject_display}
              </span>
            </div>
          </div>

          {quizData.description && (
            <p className="text-white/90 text-sm md:text-base ml-11 line-clamp-1">
              {quizData.description}
            </p>
          )}
        </div>

        {/* Quiz Status Section */}
        <div className="flex flex-col md:items-end space-y-2 md:ml-6 shrink-0">
          {/* Status indicator */}
          {Date.parse(quizData.due_date) < Date.now() &&
          !quizData.has_submitted ? (
            <div className="flex items-center px-4 py-2 bg-white/10 rounded-lg">
              <FontAwesomeIcon
                icon={faHourglassHalf}
                className="text-purple-300 mr-2"
              />
              <span className="text-white font-medium">
                {quizData.type_of === "quiz" ? "Quiz" : "Activity"} Past Due!
              </span>
            </div>
          ) : quizData.has_submitted ? (
            <div className="flex flex-col items-center px-4 py-2 bg-white/10 rounded-lg">
              <div className="flex items-center mb-1">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-purple-300 mr-2"
                />
                <span className="text-white font-medium">Completed!</span>
              </div>
              {quizData.score_details && (
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faTrophy}
                    className="text-yellow-300 mr-2"
                  />
                  <div className="flex flex-col">
                    <span className="text-white/90 text-sm font-bold">
                      Score: {quizData.score_details.total_score}/
                      {quizData.score_details.total_possible}
                    </span>
                    <span className="text-white/80 text-xs">
                      ({quizData.score_details.percentage_score}%{" "}
                      {quizData.score_details.status})
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center px-4 py-2 bg-white/10 rounded-lg">
              <FontAwesomeIcon
                icon={faPlayCircle}
                className="text-purple-300 animate-pulse mr-2"
              />
              <span className="text-white font-medium">
                Start {quizData.type_of === "quiz" ? "Quiz" : "Activity"}!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
