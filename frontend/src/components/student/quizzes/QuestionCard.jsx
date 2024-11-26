import React, { useState } from "react";

const QuestionCard = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onNext,
  onPrev,
}) => {
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [answer, setAnswer] = useState("");

  const handleChoiceClick = (choiceId) => {
    if (question.question_type === "multi") {
      setSelectedChoices((prev) =>
        prev.includes(choiceId)
          ? prev.filter((id) => id !== choiceId)
          : [...prev, choiceId]
      );
    } else if (question.question_type === "single") {
      setSelectedChoices([choiceId]);
    }
  };

  const renderChoices = () => {
    if (question.question_type === "identification") {
      return (
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-4 rounded-xl border-2 border-purple-100 
                   focus:border-purple-500 focus:outline-none"
          placeholder="Type your answer here..."
        />
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {question.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoiceClick(choice.id)}
            className={`text-left p-6 rounded-xl border-2 
              ${
                selectedChoices.includes(choice.id)
                  ? "border-purple-500 bg-purple-50"
                  : "border-purple-100 hover:border-purple-500 hover:bg-purple-50"
              } transition-all`}
          >
            {choice.text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      {/* Question Progress */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-purple-600 font-semibold">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <div className="h-2 w-48 bg-purple-100 rounded-full">
          <div
            className="h-full bg-purple-600 rounded-full"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-700 mb-6 p-4 bg-purple-50 rounded-lg">
          {question?.text}
        </h3>
        {question?.image && (
          <img
            src={question.image}
            alt="Question"
            className="mb-6 rounded-lg max-w-full h-auto"
          />
        )}
        {renderChoices()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={() => {
            setSelectedChoices([]);
            setAnswer("");
            onPrev();
          }}
          disabled={currentQuestionIndex === 0}
          className="flex-1 py-3 px-6 rounded-xl border-2 border-purple-600 
                   text-purple-600 font-semibold hover:bg-purple-50 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => {
            const response = {
              questionId: question.id,
              answer:
                question.question_type === "identification"
                  ? answer
                  : selectedChoices,
            };
            onNext(response);
            setSelectedChoices([]);
            setAnswer("");
          }}
          disabled={
            (question.question_type === "identification" && !answer) ||
            (question.question_type !== "identification" &&
              selectedChoices.length === 0)
          }
          className="flex-1 py-3 px-6 rounded-xl bg-purple-600 text-white 
                   font-semibold hover:bg-purple-700 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
