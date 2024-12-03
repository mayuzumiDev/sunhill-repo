import React, { useState } from "react";

const QuestionCard = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onNext,
  onPrev,
  onBack,
}) => {
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [answer, setAnswer] = useState("");
  const [booleanAnswer, setBooleanAnswer] = useState(""); // for true/false questions

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
    if (question.question_type === "true_false") {
      return (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setBooleanAnswer("true")}
            className={`text-center text-xl  font-bold p-6 rounded-xl border-2 
              max-w-[300px] w-full mx-auto
              ${
                booleanAnswer === "true"
                  ? "border-purple-500 bg-purple-50"
                  : "border-purple-100 hover:border-purple-500 hover:bg-purple-50"
              } transition-all`}
          >
            True
          </button>
          <button
            onClick={() => setBooleanAnswer("false")}
            className={`text-center text-xl  font-bold p-6 rounded-xl border-2 
              max-w-[300px] w-full mx-auto
              ${
                booleanAnswer === "false"
                  ? "border-purple-500 bg-purple-50"
                  : "border-purple-100 hover:border-purple-500 hover:bg-purple-50"
              } transition-all`}
          >
            False
          </button>
        </div>
      );
    }

    if (question.question_type === "identification") {
      return (
        <div className="flex justify-center items-center w-full">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.toUpperCase())}
            style={{ textTransform: "uppercase" }}
            className="text-xl font-bold w-full p-4 rounded-xl border-2 border-purple-100 max-w-[400px] text-center
                     focus:border-purple-500 focus:outline-none"
            placeholder="TYPE YOUR ANSWER HERE..."
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {question.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoiceClick(choice.id)}
            className={`text-center text-xl  font-bold p-6 rounded-xl border-2 
              max-w-[300px] w-full mx-auto
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
        <h3 className="text-4xl font-extrabold  text-gray-700 mb-6 p-4 bg-purple-50 rounded-lg">
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
            if (currentQuestionIndex === 0) {
              onBack();
            } else {
              setSelectedChoices([]);
              setAnswer("");
              setBooleanAnswer("");
              onPrev();
            }
          }}
          // disabled={currentQuestionIndex === 0}
          className="flex-1 py-3 px-6 rounded-xl border-2 border-purple-600 
                   text-purple-600 font-semibold hover:bg-purple-50 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   min-w-[120px] max-w-[200px] sm:min-w-[150px] sm:max-w-[250px]"
        >
          {currentQuestionIndex === 0 ? "Quiz Menu" : "Previous"}
        </button>
        <button
          onClick={() => {
            const response = {
              questionId: question.id,
              answer:
                question.question_type === "identification"
                  ? answer
                  : question.question_type === "true_false"
                  ? booleanAnswer
                  : selectedChoices,
            };
            onNext(response);
            // Only clear answers if it's not the last question
            if (currentQuestionIndex !== totalQuestions - 1) {
              setSelectedChoices([]);
              setAnswer("");
              setBooleanAnswer("");
            }
          }}
          disabled={
            (question.question_type === "identification" && !answer) ||
            (question.question_type === "true_false" && !booleanAnswer) ||
            (question.question_type !== "identification" &&
              question.question_type !== "true_false" &&
              selectedChoices.length === 0)
          }
          className="flex-1 py-3 px-6 rounded-xl bg-purple-600 text-white 
                   font-semibold hover:bg-purple-700 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed
                   min-w-[120px] max-w-[200px] sm:min-w-[150px] sm:max-w-[250px]"
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
