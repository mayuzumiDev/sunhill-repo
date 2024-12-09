import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { axiosInstance } from "../../../utils/axiosInstance";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faChartLine } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const generateTestData = () => {
  // Generate test data for knowledge gaps
  return Array.from({ length: 4 }, (_, quizIndex) => ({
    id: quizIndex + 1,
    title: `Quiz ${quizIndex + 1}`,
    classroom_name: `Class ${quizIndex + 1}`,
    quiz_title: `Quiz ${quizIndex + 1}`,
    question_stats: Array.from({ length: 10 }, (_, i) => ({
      question_text: `Question ${i + 1}`,
      success_rate: Math.random() * 100,
      total_attempts: Math.floor(Math.random() * 50) + 10,
    })),
  }));
};

const KnowledgeGapHeatmap = ({ isTestMode = false }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [insights, setInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // Fetch quizzes list
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (isTestMode) {
          const testQuizzes = generateTestData();
          setQuizzes(testQuizzes);
          setSelectedQuizId(testQuizzes[0].id);
        } else {
          const response = await axiosInstance.get("/user-teacher/quiz/list/");
          const quizList = response.data.quizzes || [];
          setQuizzes(quizList);
          setSelectedQuizId(quizList[0]?.id);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Error loading quizzes");
      }
    };

    fetchQuizzes();
  }, [isTestMode]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedQuizId) return;

      try {
        setLoading(true);
        setError(null);

        let quizData;
        if (isTestMode) {
          const testData = generateTestData();
          quizData = testData.find((quiz) => quiz.id === selectedQuizId);
        } else {
          const response = await axiosInstance.get(
            `/user-teacher/analytics/knowledge-gap/?quiz_id=${selectedQuizId}`
          );
          quizData = response.data;
        }

        if (!quizData || !quizData.question_stats) {
          setError("No data available for this quiz/activity");
          return;
        }

        const data = {
          datasets: [
            {
              label: "Success Rate",
              data: quizData.question_stats.map((stat, index) => ({
                x: index,
                y: stat.success_rate,
                questionText: stat.question_text,
                totalAttempts: stat.total_attempts,
              })),
              backgroundColor: quizData.question_stats.map(
                (stat) =>
                  `rgba(${255 - stat.success_rate * 2.55}, ${
                    stat.success_rate * 2.55
                  }, 0, 0.6)`
              ),
              pointRadius: 15,
            },
          ],
        };

        setChartData(data);
      } catch (error) {
        setError("Error loading knowledge gap analytics");
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedQuizId, isTestMode]);

  const generateInsights = () => {
    setGeneratingInsights(true);
    try {
      const insights = [];
      if (chartData && chartData.datasets[0].data.length > 0) {
        const questionData = chartData.datasets[0].data;

        // Overall Performance Analysis
        const avgSuccessRate = (
          questionData.reduce((sum, point) => sum + point.y, 0) /
          questionData.length
        ).toFixed(1);
        insights.push(`Average Success Rate: ${avgSuccessRate}%`);

        // Identify Strongest and Weakest Areas
        const sortedQuestions = [...questionData].sort((a, b) => b.y - a.y);
        const bestQuestion = sortedQuestions[0];
        const worstQuestion = sortedQuestions[sortedQuestions.length - 1];

        insights.push(
          `Strongest Area: ${
            bestQuestion.questionText
          } (${bestQuestion.y.toFixed(1)}% success rate)`
        );
        insights.push(
          `Area Needing Attention: ${
            worstQuestion.questionText
          } (${worstQuestion.y.toFixed(1)}% success rate)`
        );

        // Performance Distribution Analysis
        const lowPerformingQuestions = questionData.filter(
          (point) => point.y < 60
        ).length;
        if (lowPerformingQuestions > 0) {
          insights.push(
            `${lowPerformingQuestions} questions have success rates below 60% - consider reviewing these topics`
          );
        }

        // Participation Analysis
        const totalAttempts = questionData.reduce(
          (sum, point) => sum + point.totalAttempts,
          0
        );
        const avgAttempts = (totalAttempts / questionData.length).toFixed(1);
        insights.push(`Average attempts per question: ${avgAttempts}`);

        // Performance Gap Analysis
        const performanceGap = bestQuestion.y - worstQuestion.y;
        if (performanceGap > 40) {
          insights.push(
            "Large performance gap detected - consider additional support for challenging topics"
          );
        }
      }

      setInsights(insights);
      setShowInsights(true);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights(["Unable to generate insights at this time."]);
    } finally {
      setGeneratingInsights(false);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Knowledge Gap Analysis",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return [
              `Question: ${point.questionText}`,
              `Success Rate: ${point.y.toFixed(1)}%`,
              `Total Attempts: ${point.totalAttempts}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Success Rate (%)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          stepSize: 25,
          callback: (value) => `${value}%`,
        },
      },
      x: {
        title: {
          display: true,
          text: "Questions",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          stepSize: 1,
          callback: (value) => `Q${Math.floor(value + 1)}`,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading && !chartData) {
    return (
      <div className="flex items-center justify-center h-full">
        <DotLoaderSpinner color="rgb(34, 197, 94)" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <label
          htmlFor="quiz-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Quiz/Activities
        </label>
        <select
          id="quiz-select"
          className="block w-full px-3 py-2 bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedQuizId || ""}
          onChange={(e) => setSelectedQuizId(Number(e.target.value))}
        >
          <option value="">Select a quiz/activity</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title} - {quiz.classroom_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1" style={{ minHeight: "300px" }}>
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : !selectedQuizId ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-green-600 text-4xl mb-2"
            />
            <div className="text-green-600 font-medium">
              Select a quiz/activity to view knowledge gaps
            </div>
          </div>
        ) : (
          chartData && <Scatter options={options} data={chartData} />
        )}
      </div>

      {!loading && !error && chartData && (
        <div className="mt-4 border-t pt-4">
          <button
            onClick={() => {
              generateInsights();
              setShowInsights(!showInsights);
            }}
            disabled={generatingInsights}
            className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:bg-green-400"
          >
            <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
            {generatingInsights
              ? "Analyzing..."
              : showInsights
              ? "Hide Insights"
              : "Show Insights"}
          </button>

          {showInsights && insights && (
            <div className="mt-4 p-4 bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon
                  icon={faLightbulb}
                  className="text-green-600 mr-2"
                />
                <h3 className="font-semibold text-gray-800">
                  Knowledge Insights
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

export default KnowledgeGapHeatmap;
