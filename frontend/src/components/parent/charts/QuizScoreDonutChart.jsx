import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FaChartPie } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuizScoreDonutChart = ({ quizScores, darkMode, isLoading }) => {
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
            className={`text-4xl mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          />
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Your child hasn't taken any quizzes yet.
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
        text: "Overall Quiz Performance",
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
        <p className="text-sm opacity-75">Total Quizzes: {quizScores.length}</p>
      </div>
    </div>
  );
};

export default QuizScoreDonutChart;
