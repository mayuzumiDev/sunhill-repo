import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { axiosInstance } from "../../../utils/axiosInstance";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faChartBar } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuizStatisticsChart = () => {
  const [quizStats, setQuizStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  useEffect(() => {
    fetchQuizStatistics();
  }, []);

  const fetchQuizStatistics = async () => {
    try {
      const response = await axiosInstance.get(
        "/user-teacher/analytics/quiz-statistics/"
      );
      // Get only the 5 most recent quizzes
      const recentQuizzes = Array.isArray(response.data)
        ? response.data.slice(-5)
        : [];
      setQuizStats(recentQuizzes);
      setError(null);
    } catch (error) {
      console.error("Error fetching quiz statistics:", error);
      setError("Failed to load quiz statistics");
      setQuizStats([]);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = () => {
    setGeneratingInsights(true);
    try {
      const insights = [];

      // Calculate total quizzes
      const totalQuizzes = quizStats.length;
      insights.push(`Total Quizzes Analyzed: ${totalQuizzes}`);

      // Calculate overall pass rate
      const totalPassed = quizStats.reduce(
        (sum, quiz) => sum + quiz.total_passed,
        0
      );
      const totalStudents = quizStats.reduce(
        (sum, quiz) => sum + quiz.total_passed + quiz.total_failed,
        0
      );
      const overallPassRate =
        totalStudents > 0
          ? ((totalPassed / totalStudents) * 100).toFixed(1)
          : 0;
      insights.push(`Overall Pass Rate: ${overallPassRate}%`);

      // Find best and worst performing quizzes
      if (quizStats.length > 0) {
        const quizPassRates = quizStats.map((quiz) => ({
          title: quiz.quiz_title,
          passRate: (
            (quiz.total_passed / (quiz.total_passed + quiz.total_failed)) *
            100
          ).toFixed(1),
        }));

        const bestQuiz = quizPassRates.reduce((prev, current) =>
          parseFloat(current.passRate) > parseFloat(prev.passRate)
            ? current
            : prev
        );

        const worstQuiz = quizPassRates.reduce((prev, current) =>
          parseFloat(current.passRate) < parseFloat(prev.passRate)
            ? current
            : prev
        );

        insights.push(
          `Best Performing Quiz: ${bestQuiz.title} (${bestQuiz.passRate}% pass rate)`
        );
        insights.push(
          `Lowest Performing Quiz: ${worstQuiz.title} (${worstQuiz.passRate}% pass rate)`
        );
      }

      setInsights(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights(["Unable to generate insights at this time."]);
    } finally {
      setGeneratingInsights(false);
    }
  };

  const chartData = {
    labels: quizStats.map((stat) => stat.quiz_title),
    datasets: [
      {
        label: "Passed",
        data: quizStats.map((stat) => stat.total_passed),
        backgroundColor: "rgb(34, 197, 94)", // green-500
        stack: "Stack 0",
      },
      {
        label: "Failed",
        data: quizStats.map((stat) => stat.total_failed),
        backgroundColor: "rgb(239, 68, 68)", // red-500
        stack: "Stack 0",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Recent Quiz Pass/Fail Distribution",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} students`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          precision: 0, // Show whole numbers but don't force them
          callback: function (value) {
            return value + " students"; // Add 'students' label to y-axis
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <DotLoaderSpinner color="rgb(34, 197, 94)" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex-1" style={{ minHeight: "300px" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Loading chart data...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : quizStats.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <FontAwesomeIcon
              icon={faChartBar}
              className="text-green-600 text-4xl mb-2"
            />
            <div className="text-green-600 font-medium">
              No quiz data available
            </div>
          </div>
        )}
      </div>

      {!loading && !error && quizStats.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <button
            onClick={generateInsights}
            disabled={generatingInsights}
            className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:bg-green-400"
          >
            <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
            {generatingInsights ? "Analyzing..." : "Show Insights"}
          </button>

          {insights && (
            <div className="mt-4 p-4 bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon
                  icon={faLightbulb}
                  className="text-green-600 mr-2"
                />
                <h3 className="font-semibold text-gray-800">
                  Performance Analysis
                </h3>
              </div>
              <ul className="space-y-2">
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mt-2 mr-2"></span>
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

export default QuizStatisticsChart;
