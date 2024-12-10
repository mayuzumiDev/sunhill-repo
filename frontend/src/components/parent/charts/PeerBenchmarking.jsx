import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { axiosInstance } from "../../../utils/axiosInstance";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PeerBenchmarking = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [insights, setInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    // Fetch the data from the API endpoint
    axiosInstance
      .get("/api/user-parent/analytics/peer-benchmarking/") // Adjust endpoint if necessary
      .then((response) => {
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.error);
        }
      })
      .catch((err) => {
        setError(err.message || "Error fetching data");
      });
  }, []);

  const handleClassroomChange = (e) => {
    const classroomId = e.target.value;
    setSelectedClassroomId(classroomId);
    setSelectedQuizId(""); // Reset quiz selection
  };

  const handleQuizChange = (e) => {
    setSelectedQuizId(e.target.value);
  };

  const generateInsights = () => {
    setGeneratingInsights(true);
    try {
      const insights = [];
      const selectedClassroom = data[selectedClassroomId];
      const selectedQuiz = selectedClassroom?.quizzes[selectedQuizId];

      if (selectedQuiz) {
        const studentScore = selectedQuiz.student_score;
        const classStats = selectedQuiz.class_statistics;

        // Performance insight
        if (studentScore >= classStats.q3) {
          insights.push(
            "Your child is performing excellently, ranking among the top students!"
          );
        } else if (studentScore >= classStats.median) {
          insights.push(
            "Your child is doing well, performing better than half of the class."
          );
        } else if (studentScore >= classStats.q1) {
          insights.push(
            "Your child is in the lower half of the class. More practice and support may help."
          );
        } else {
          insights.push(
            "Your child’s performance is below the expected range. Extra help may be needed."
          );
        }

        // Percentile insight
        if (selectedQuiz.student_percentile !== null) {
          const percentile = selectedQuiz.student_percentile;
          if (percentile >= 90) {
            insights.push(
              "Your child is in the top 10% of the class—excellent work!"
            );
          } else if (percentile >= 75) {
            insights.push("Your child is in the top 25%. Great progress!");
          } else if (percentile >= 50) {
            insights.push(
              "Your child is in the middle. Encourage more consistency."
            );
          } else {
            insights.push(
              "Your child is in the lower half. Consider extra support to improve performance."
            );
          }
        }

        // Class performance spread
        const scoreGap = classStats.q3 - classStats.q1;
        if (scoreGap > 20) {
          insights.push(
            "There is a wide range in the class’s performance. Focused support might help those struggling."
          );
        } else if (scoreGap > 10) {
          insights.push(
            "The class has a moderate performance spread. Targeted help could improve middle performers."
          );
        } else {
          insights.push(
            "Class performance is balanced. Overall, good progress is being made."
          );
        }

        // Max-min score gap insight
        if (classStats.max - classStats.min > 40) {
          insights.push(
            "There’s a large gap between the highest and lowest scores. It may be helpful to provide additional support to students in need."
          );
        } else if (classStats.max - classStats.min < 10) {
          insights.push(
            "Scores are tightly grouped, indicating that most students grasped the material well."
          );
        }

        // Class average insight
        const classAverage =
          (classStats.min +
            classStats.q1 +
            classStats.median +
            classStats.q3 +
            classStats.max) /
          5;
        if (classAverage < 60) {
          insights.push(
            "The class average is low. Encouraging review of key concepts can help improve overall performance."
          );
        } else if (classAverage < 75) {
          insights.push(
            "The class is improving, but there’s still room for growth. Reinforcing learning would be beneficial."
          );
        } else {
          insights.push(
            "The class is performing well. Continued support will help maintain and build on this success."
          );
        }
      }

      setInsights(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights(["Unable to generate insights at this time."]);
    } finally {
      setGeneratingInsights(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <DotLoaderSpinner color="rgb(255, 159, 64)" />
      </div>
    );
  }

  const classrooms = Object.keys(data);
  const selectedClassroom = data[selectedClassroomId];
  const selectedQuiz = selectedClassroom?.quizzes[selectedQuizId];

  const quizChartData = selectedQuiz
    ? {
        labels: ["Min", "Q1", "Median", "Q3", "Max"],
        datasets: [
          {
            label: "Score Distribution",
            data: [
              selectedQuiz.class_statistics.min,
              selectedQuiz.class_statistics.q1,
              selectedQuiz.class_statistics.median,
              selectedQuiz.class_statistics.q3,
              selectedQuiz.class_statistics.max,
            ],
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 3,
            fill: true,
            pointBackgroundColor: "rgba(255, 159, 64, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 159, 64, 1)",
          },
        ],
      }
    : null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Peer Benchmarking</h2>

      {/* Classroom Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="classroom-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Classroom
        </label>
        <select
          id="classroom-select"
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedClassroomId}
          onChange={handleClassroomChange}
        >
          <option value="">Select a classroom</option>
          {classrooms.map((id) => (
            <option key={id} value={id}>
              {data[id].classroom_name} ({data[id].subject})
            </option>
          ))}
        </select>
      </div>

      {/* Quiz Dropdown */}
      {selectedClassroom && (
        <div className="mb-4">
          <label
            htmlFor="quiz-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Quiz/Activity
          </label>
          <select
            id="quiz-select"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedQuizId}
            onChange={handleQuizChange}
          >
            <option value="">Select a quiz</option>
            {Object.keys(selectedClassroom.quizzes).map((quizId) => (
              <option key={quizId} value={quizId}>
                {selectedClassroom.quizzes[quizId].quiz_title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Chart and Quiz Details */}
      {selectedQuiz ? (
        <div>
          <h4 className="text-xl font-semibold mb-2">
            {selectedQuiz.quiz_title}
          </h4>
          <Bar data={quizChartData} />

          <div className="mt-4">
            <p>
              <strong>Student Score:</strong>{" "}
              {selectedQuiz.student_score || "Not Attempted"}
            </p>
            <p>
              <strong>Percentile:</strong>{" "}
              {selectedQuiz.student_percentile !== null
                ? `${selectedQuiz.student_percentile.toFixed(2)}%`
                : "Not Available"}
            </p>
            <p>
              <strong>Total Students:</strong> {selectedQuiz.total_students}
            </p>

            {/* Toggle Insights Button */}
            <div className="mt-4">
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

              {/* Show Insights */}
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
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 mr-3"></span>
                        <p className="text-sm text-gray-700">{insight}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-6 text-orange-500 text-center">
          Please select a quiz/activity to view performance details.
        </div>
      )}
    </div>
  );
};

export default PeerBenchmarking;
