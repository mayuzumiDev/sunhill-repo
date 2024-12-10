import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { axiosInstance } from "../../../utils/axiosInstance";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faUserGraduate } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ParentStudentProgressChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [insights, setInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/api/user-parent/analytics/student-progress/"
        );
        console.log("API Response:", response);

        // Check if we're getting HTML instead of JSON
        if (response.headers["content-type"].includes("text/html")) {
          console.error("Received HTML instead of JSON response");
          setError("Session expired. Please refresh the page or log in again.");
          return;
        }

        if (response.data?.success && response.data?.data) {
          const studentData = response.data.data;

          if (Object.keys(studentData).length > 0) {
            setStudentData(studentData);
            const firstStudentId = Object.keys(studentData)[0];
            setSelectedStudentId(firstStudentId);
          } else {
            setError("No student data available");
          }
        } else {
          console.error("API Error: Unexpected data format", response.data);
          setError(response.data?.error || "No quiz data available");
        }
      } catch (error) {
        console.error("Request Error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        if (error.response?.status === 401 || error.response?.status === 403) {
          setError("Session expired. Please log in again.");
        } else {
          setError(
            error.response?.data?.error ||
              error.message ||
              "An error occurred while fetching data"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateInsights = () => {
    setGeneratingInsights(true);
    try {
      const insights = [];
      if (studentData && selectedStudentId) {
        const student = studentData[selectedStudentId];
        const questionTypes = [
          "single",
          "multi",
          "identification",
          "true_false",
        ];

        // Calculate performance metrics
        const performances = questionTypes.map((type) => ({
          type: type,
          score: student[type],
        }));

        const avgPerformance = (
          questionTypes.reduce((sum, type) => sum + student[type], 0) / 4
        ).toFixed(1);

        const bestPerformance = performances.reduce((max, p) =>
          p.score > max.score ? p : max
        );
        const worstPerformance = performances.reduce((min, p) =>
          p.score < min.score ? p : min
        );

        const formatQuestionType = (type) => {
          switch (type) {
            case "single":
              return "Single Choice";
            case "multi":
              return "Multiple Choice";
            case "identification":
              return "Identification";
            case "true_false":
              return "True/False";
            default:
              return type;
          }
        };

        // Overall Performance Summary
        if (avgPerformance >= 80) {
          insights.push("Outstanding overall performance!");
        } else if (avgPerformance >= 60) {
          insights.push("Good progress, with room for improvement");
        } else {
          insights.push("Additional practice recommended");
        }

        // Strength Analysis
        insights.push(
          `Strongest in ${formatQuestionType(
            bestPerformance.type
          )} questions (${bestPerformance.score.toFixed(1)}%)`
        );

        // Improvement Areas
        if (worstPerformance.score < 60) {
          insights.push(
            `Focus needed on ${formatQuestionType(
              worstPerformance.type
            )} questions (${worstPerformance.score.toFixed(1)}%)`
          );
        }

        // Performance Balance Check
        const performanceGap = bestPerformance.score - worstPerformance.score;
        if (performanceGap > 30) {
          insights.push(
            "\nConsider balanced practice across all question types to improve overall performance"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <DotLoaderSpinner color="rgb(255, 159, 64)" />
      </div>
    );
  }

  const selectedStudentData = selectedStudentId
    ? {
        labels: [
          "Single Choice",
          "Multiple Choice",
          "Identification",
          "True/False",
        ],
        datasets: [
          {
            label: studentData[selectedStudentId].name,
            data: [
              studentData[selectedStudentId].single,
              studentData[selectedStudentId].multi,
              studentData[selectedStudentId].identification,
              studentData[selectedStudentId].true_false,
            ],
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 3,
            pointBackgroundColor: "rgba(255, 159, 64, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 159, 64, 1)",
            fill: true,
          },
        ],
      }
    : null;

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 20,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <label
          htmlFor="student-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Your Child
        </label>
        <select
          id="student-select"
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedStudentId || ""}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">Select your child</option>
          {studentData &&
            Object.entries(studentData).map(([id, data]) => (
              <option key={id} value={id}>
                {data.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex-1" style={{ minHeight: "300px" }}>
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : !selectedStudentId ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <FontAwesomeIcon
              icon={faUserGraduate}
              className="text-orange-600 text-4xl mb-2"
            />
            <div className="text-orange-600 font-medium">
              Select your child to view progress
            </div>
          </div>
        ) : (
          selectedStudentData && (
            <Radar options={options} data={selectedStudentData} />
          )
        )}
      </div>

      {!loading && !error && selectedStudentData && (
        <div className="mt-4 border-t pt-4">
          <button
            onClick={() => {
              generateInsights();
              setShowInsights(!showInsights);
            }}
            disabled={generatingInsights}
            className="inline-flex items-center px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors disabled:bg-orange-400"
          >
            <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
            {generatingInsights
              ? "Analyzing..."
              : showInsights
              ? "Hide Insights"
              : "Show Insights"}
          </button>

          {showInsights && insights && (
            <div className="mt-4 p-4 bg-gradient-to-br from-white to-orange-50 border border-orange-100 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon
                  icon={faLightbulb}
                  className="text-orange-600 mr-2"
                />
                <h3 className="font-semibold text-gray-800">
                  Progress Insights
                </h3>
              </div>
              <ul className="space-y-2">
                {insights.map((insight, index) => (
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

export default ParentStudentProgressChart;
