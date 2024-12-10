import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FaChartLine, FaLightbulb } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const QuizScoreLineChart = ({ quizScores, darkMode, isLoading }) => {
  const [showInsights, setShowInsights] = useState(false);

  const generateInsights = () => {
    const insights = [];

    // Analyze trend
    const scores = monthlyData.map((item) => parseFloat(item.averageScore));
    const latestScore = scores[scores.length - 1];
    const previousScore = scores[scores.length - 2];

    // Overall Progress
    if (scores.length > 1) {
      const trend = latestScore - previousScore;
      if (trend > 0) {
        insights.push(
          `Improving trend with ${trend.toFixed(
            1
          )}% increase in the latest month`
        );
      } else if (trend < 0) {
        insights.push(
          `Showing a ${Math.abs(trend).toFixed(
            1
          )}% decrease in the latest month - extra practice recommended`
        );
      } else {
        insights.push("Maintaining consistent performance");
      }
    }

    // Monthly Performance
    const highestMonth = monthlyData.reduce((max, item) =>
      parseFloat(item.averageScore) > parseFloat(max.averageScore) ? item : max
    );
    insights.push(
      `Best performance in ${highestMonth.monthYear} with ${highestMonth.averageScore}% average`
    );

    // Quiz Frequency
    const totalQuizzes = monthlyData.reduce(
      (sum, item) => sum + item.scores.length,
      0
    );
    const monthlyAverage = (totalQuizzes / monthlyData.length).toFixed(1);
    insights.push(
      `Average of ${monthlyAverage} quizzes/activities taken per month`
    );

    // Recent Performance
    if (latestScore >= 80) {
      insights.push("Currently showing excellent mastery of the material");
    } else if (latestScore >= 60) {
      insights.push(
        "Current performance shows good understanding with room for improvement"
      );
    } else {
      insights.push(
        "Recent scores suggest additional practice would be beneficial"
      );
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
          <FaChartLine
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
            Check back later to view their progress!
          </p>
        </div>
      </div>
    );
  }

  // Group scores by month and calculate average
  const groupedScores = quizScores.reduce((acc, score) => {
    const date = new Date(score.created_at);
    const monthYear = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = {
        totalScore: 0,
        count: 0,
        scores: [],
      };
    }

    acc[monthYear].totalScore += parseFloat(score.percentage_score);
    acc[monthYear].count += 1;
    acc[monthYear].scores.push(score);

    return acc;
  }, {});

  // Convert grouped data to arrays for chart
  const monthlyData = Object.entries(groupedScores).map(
    ([monthYear, data]) => ({
      monthYear,
      averageScore: (data.totalScore / data.count).toFixed(2),
      scores: data.scores,
    })
  );

  // Sort by date
  monthlyData.sort((a, b) => {
    const dateA = new Date(a.scores[0].created_at);
    const dateB = new Date(b.scores[0].created_at);
    return dateA - dateB;
  });

  const data = {
    labels: monthlyData.map((item) => item.monthYear),
    datasets: [
      {
        label: "Average Quiz/Activity Score (%)",
        data: monthlyData.map((item) => item.averageScore),
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        tension: 0.3,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: darkMode ? "#fff" : "#000",
        },
      },
      title: {
        display: true,
        text: "Monthly Quiz/Activity Score Progress",
        color: darkMode ? "#fff" : "#000",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const monthData = monthlyData[context.dataIndex];
            const labels = [
              `Average Score: ${monthData.averageScore}%`,
              `Total Quiz/Activity: ${monthData.scores.length}`,
            ];

            // Add individual quiz scores if there are any
            if (monthData.scores.length > 0) {
              labels.push("");
              labels.push("Individual Scores:");
              monthData.scores.forEach((score) => {
                labels.push(`${score.quiz_title}: ${score.percentage_score}%`);
              });
            }

            return labels;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
        },
      },
      x: {
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
        },
      },
    },
  };

  return (
    <div
      className={`p-4 rounded-lg ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-md`}
    >
      <div className="h-64">
        <Line data={data} options={options} />
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
            <div
              className={`mt-4 p-4 bg-gradient-to-br ${
                darkMode
                  ? "from-gray-800 to-gray-700 border-gray-600"
                  : "from-white to-orange-50 border-orange-100"
              } border rounded-lg shadow-sm`}
            >
              <div className="flex items-center mb-3">
                <FaLightbulb
                  className={`${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  } mr-2`}
                />
                <h3
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Progress Insights
                </h3>
              </div>
              <ul className="space-y-2">
                {generateInsights().map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 mr-2"></span>
                    <span
                      className={darkMode ? "text-gray-200" : "text-gray-700"}
                    >
                      {insight}
                    </span>
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

export default QuizScoreLineChart;
