import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FaChartPie, FaLightbulb } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuizScoreDonutChart = ({ quizScores, darkMode, isLoading }) => {
  const [insights, setInsights] = useState(null);
  const [showInsights, setShowInsights] = useState(false);

  const generateInsights = () => {
    const insights = [];

    // Overall Performance Analysis
    if (averagePercentage >= 80) {
      insights.push("Outstanding quiz/activity performance!");
    } else if (averagePercentage >= 60) {
      insights.push("Good progress, with room for improvement");
    } else {
      insights.push("Additional practice recommended");
    }

    // Score Distribution
    const scorePercentage = (totalScores / totalPossible) * 100;
    insights.push(
      `Achieved ${totalScores} out of ${totalPossible} total possible points`
    );

    // Quiz Participation
    if (quizScores.length >= 10) {
      insights.push(
        "Consistent participation with a good number of quizzes/activities completed"
      );
    } else if (quizScores.length >= 5) {
      insights.push(
        "Regular quiz/activity participation - keep up the good work!"
      );
    } else {
      insights.push(
        "Consider taking more quizzes/activities to improve overall performance"
      );
    }

    // Performance Trend
    if (scorePercentage >= 70) {
      insights.push("Demonstrating strong understanding of the material");
    } else if (scorePercentage >= 50) {
      insights.push("Shows basic understanding with potential for improvement");
    } else {
      insights.push("May benefit from additional study and practice");
    }

    return insights;
  };

  if (isLoading) {
    return (
      <div
        className={`p-4 rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md h-64 flex items-center justify-center`}
      >
        <DotLoaderSpinner color="rgb(255, 159, 64)" />
      </div>
    );
  }

  if (!quizScores || quizScores.length === 0) {
    return (
      <div
        className={`p-4 rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md h-64 flex items-center justify-center`}
      >
        <div className="text-center">
          <FaChartPie
            className={`text-4xl mb-3 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          />
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your child hasn't taken any quizzes/activities yet.
            <br />
            Check back later to view their performance!
          </p>
        </div>
      </div>
    );
  }

  // Calculate average scores
  const totalScores = quizScores.reduce(
    (acc, quiz) => acc + parseFloat(quiz.total_score),
    0
  );
  const totalPossible = quizScores.reduce(
    (acc, quiz) => acc + parseFloat(quiz.total_possible),
    0
  );
  const averagePercentage = ((totalScores / totalPossible) * 100).toFixed(2);

  const data = {
    labels: ["Average Score", "Remaining"],
    datasets: [
      {
        data: [totalScores, totalPossible - totalScores],
        backgroundColor: [
          "rgba(255, 159, 64, 0.8)",
          "rgba(229, 231, 235, 0.5)",
        ],
        borderColor: ["rgb(255, 159, 64)", "rgb(209, 211, 215)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: darkMode ? "#fff" : "#000",
        },
      },
      title: {
        display: true,
        text: "Overall Quiz/Activity Performance",
        color: darkMode ? "#fff" : "#000",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalPossible) * 100).toFixed(1);
            return `${context.label}: ${value}/${totalPossible} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      className={`p-4 rounded-lg ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-md`}
    >
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
      <div
        className={`text-center mt-4 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        <p className="text-lg font-semibold">
          Average Score: {averagePercentage}%
        </p>
        <p className="text-sm opacity-75">
          Total Quiz/Activity: {quizScores.length}
        </p>
      </div>

      {quizScores && quizScores.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="inline-flex items-center px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors"
          >
            <FaLightbulb className="mr-2" />
            {showInsights ? "Hide Insights" : "Show Insights"}
          </button>

          {showInsights && (
            <div className="mt-4 p-4 bg-gradient-to-br from-white to-orange-50 border border-orange-100 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <FaLightbulb className="text-orange-600 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Performance Insights
                </h3>
              </div>
              <ul className="space-y-2">
                {generateInsights().map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 mr-2"></span>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizScoreDonutChart;
