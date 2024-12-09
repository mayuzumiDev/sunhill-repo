// // QuizTimeAnalytics.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import { axiosInstance } from "../../../utils/axiosInstance";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const QuizTimeAnalytics = ({ quizId }) => {
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(
//           `/user-teacher/analytics/quiz-time/?quiz_id=${quizId}`
//         );
//         const { quiz_title, due_date, submissions } = response.data;

//         if (!submissions || submissions.length === 0) {
//           setChartData({
//             labels: [],
//             datasets: [
//               {
//                 label: "No submissions yet",
//                 data: [],
//                 borderColor: "rgb(75, 192, 192)",
//                 tension: 0.1,
//               },
//             ],
//           });
//           return;
//         }

//         const data = {
//           labels: submissions.map((item) =>
//             new Date(item.submission_date).toLocaleDateString()
//           ),
//           datasets: [
//             {
//               label: "Submissions per Day",
//               data: submissions.map((item) => item.submission_count),
//               borderColor: "rgb(75, 192, 192)",
//               tension: 0.1,
//               fill: false,
//             },
//           ],
//         };

//         // Add due date line if it exists
//         if (due_date) {
//           data.datasets.push({
//             label: "Due Date",
//             data: new Array(submissions.length).fill(null),
//             borderColor: "rgb(255, 99, 132)",
//             borderDash: [5, 5],
//             pointStyle: "dash",
//           });
//         }

//         setChartData(data);
//       } catch (error) {
//         setError("Error loading quiz analytics");
//         console.error("Error fetching quiz analytics:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (quizId) {
//       fetchData();
//     }
//   }, [quizId]);

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Quiz Submission Patterns",
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Number of Submissions",
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Date",
//         },
//       },
//     },
//   };

//   if (loading) return <div>Loading quiz analytics...</div>;
//   if (error) return <div>{error}</div>;
//   if (!chartData) return <div>No data available</div>;

//   return (
//     <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
//       <Line options={options} data={chartData} />
//     </div>
//   );
// };

// export default QuizTimeAnalytics;

import React, { useEffect, useState } from "react";
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
import { axiosInstance } from "../../../utils/axiosInstance";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faChartLine } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Test data generator
const generateTestData = () => {
  const today = new Date();

  // Generate multiple quizzes
  const quizzes = [
    { id: 1, title: "Mathematics Quiz" },
    { id: 2, title: "Science Quiz" },
    { id: 3, title: "History Quiz" },
    { id: 4, title: "English Quiz" },
  ];

  // Generate submission data for each quiz
  return quizzes.map((quiz) => ({
    id: quiz.id,
    quiz_title: quiz.title,
    due_date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    submissions: Array.from({ length: 10 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (9 - i));
      return {
        submission_date: date.toISOString().split("T")[0],
        submission_count: Math.floor(Math.random() * 8) + 1,
      };
    }),
  }));
};

const QuizTimeAnalytics = ({ quizId, isTestMode = false }) => {
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
          console.log("Making API call to fetch quizzes...");
          const response = await axiosInstance.get("/user-teacher/quiz/list/");
          console.log("API Response:", response.data);

          // Extract quizzes array from the response
          const quizList = response.data.quizzes || [];
          console.log("Extracted quiz list:", quizList);

          setQuizzes(quizList);
          const firstQuizId = quizList[0]?.id;
          console.log("Setting initial quiz ID to:", firstQuizId);
          setSelectedQuizId(firstQuizId);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Error loading quizzes");
      }
    };

    fetchQuizzes();
  }, [isTestMode]);

  // Fetch quiz data when selected quiz changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedQuizId) {
        console.log("No quiz selected, skipping fetch");
        return;
      }

      try {
        console.log("Fetching data for quiz ID:", selectedQuizId);
        setLoading(true);
        setError(null);

        let quizData;
        if (isTestMode) {
          console.log("Test mode: Getting test data");
          const testData = generateTestData();
          quizData = testData.find((quiz) => quiz.id === selectedQuizId);
          console.log("Found test quiz data:", quizData);
        } else {
          console.log("Production mode: Fetching from API");
          const response = await axiosInstance.get(
            `/user-teacher/analytics/quiz-time/?quiz_id=${selectedQuizId}`
          );
          quizData = response.data;
          console.log("Received quiz data from API:", quizData);
        }

        if (!quizData) {
          console.error("No quiz data found for ID:", selectedQuizId);
          setError("Quiz data not found");
          setLoading(false);
          return;
        }

        const { quiz_title, due_date, submissions } = quizData;
        console.log("Processing quiz data:", {
          quiz_title,
          due_date,
          submissions,
        });

        if (!submissions || submissions.length === 0) {
          console.log("No submissions found, setting empty chart");
          setChartData({
            labels: [],
            datasets: [
              {
                label: "No submissions yet",
                data: [],
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          });
          setLoading(false);
          return;
        }

        // Create chart data
        const data = {
          labels: submissions.map((item) =>
            new Date(item.submission_date).toLocaleDateString()
          ),
          datasets: [
            {
              label: "Submissions per Day",
              data: submissions.map((item) => item.submission_count),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.3,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        };

        if (due_date) {
          const maxSubmissions = Math.max(
            ...submissions.map((item) => item.submission_count)
          );

          // Create a continuous line at 75% of the maximum height
          const dueDateLineHeight = Math.floor(maxSubmissions * 0.75);

          data.datasets.push({
            label: "Due Date",
            data: new Array(submissions.length).fill(dueDateLineHeight),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 1, // Make sure due date line appears behind the submissions line
          });
        }

        console.log("Setting chart data:", data);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError("Error loading quiz analytics");
      } finally {
        console.log("Fetch complete, setting loading to false");
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
        const submissionData = chartData.datasets[0].data;
        const labels = chartData.labels;

        // Total and Average Submissions
        const totalSubmissions = submissionData.reduce((a, b) => a + b, 0);
        const avgSubmissions = (totalSubmissions / labels.length).toFixed(1);
        insights.push(`Total Submissions: ${totalSubmissions} submissions`);
        insights.push(`Average: ${avgSubmissions} submissions per day`);

        // Submission Pattern Analysis
        const firstHalf = submissionData.slice(
          0,
          Math.floor(submissionData.length / 2)
        );
        const secondHalf = submissionData.slice(
          Math.floor(submissionData.length / 2)
        );
        const firstHalfAvg =
          firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondHalfAvg =
          secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        if (secondHalfAvg > firstHalfAvg * 1.5) {
          insights.push(
            "High procrastination detected: Most submissions are in the latter half"
          );
        } else if (firstHalfAvg > secondHalfAvg * 1.5) {
          insights.push(
            "Proactive submission pattern: Students are submitting early"
          );
        }

        // Peak Submission Analysis
        const maxSubmissions = Math.max(...submissionData);
        const peakDay = labels[submissionData.indexOf(maxSubmissions)];
        insights.push(
          `Peak Activity: ${maxSubmissions} submissions on ${peakDay}`
        );

        // Submission Consistency
        const submissionVariance =
          submissionData.reduce(
            (variance, value) => variance + Math.pow(value - avgSubmissions, 2),
            0
          ) / submissionData.length;
        const isConsistent = submissionVariance < 5;

        insights.push(
          isConsistent
            ? "Consistent submission pattern throughout the period"
            : "Submission pattern shows significant variations - consider encouraging more consistent submission habits"
        );

        // Recent Trend Analysis
        const lastThreeDays = submissionData.slice(-3);
        const lastThreeAvg = lastThreeDays.reduce((a, b) => a + b, 0) / 3;
        const overallAvg = totalSubmissions / labels.length;

        if (lastThreeAvg > overallAvg * 1.5) {
          insights.push(
            "Strong finish: Submission rate has increased significantly in recent days"
          );
        } else if (lastThreeAvg < overallAvg * 0.5) {
          insights.push(
            "Submission rate has decreased recently - might need attention"
          );
        }

        // Zero Submission Days Analysis
        const zeroDays = submissionData.filter((count) => count === 0).length;
        if (zeroDays > 0) {
          insights.push(
            `Found ${zeroDays} days with no submissions - consider investigating these gaps`
          );
        }

        // Due Date Proximity Analysis
        if (chartData.datasets[1]) {
          // If due date line exists
          const remainingDays =
            labels.length - labels.indexOf(labels[labels.length - 1]);
          if (remainingDays > 0) {
            insights.push(
              remainingDays <= 2
                ? `Urgent: ${remainingDays} days remaining until due date`
                : `${remainingDays} days remaining until due date`
            );
          }
        }

        // Submission Rate Recommendation
        const recommendedDailyRate = Math.ceil(
          totalSubmissions / labels.length
        );
        insights.push(
          `Recommended steady submission rate: ${recommendedDailyRate} submissions per day`
        );
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
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Quiz/Activity Submission Patterns",
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
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Submissions",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          stepSize: 5,
          precision: 0,
          callback: function (value) {
            return value;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
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
          Select Quiz/Activity
        </label>
        <select
          id="quiz-select"
          className="block w-full px-3 py-2 bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedQuizId || ""}
          onChange={(e) => {
            const newId = Number(e.target.value);
            console.log("Select changed to:", newId);
            setSelectedQuizId(newId);
          }}
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
              Select a quiz/activity to view submission patterns
            </div>
          </div>
        ) : (
          chartData && <Line options={options} data={chartData} />
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
                  Submission Analysis
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

export default QuizTimeAnalytics;
