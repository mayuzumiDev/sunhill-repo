import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { axiosInstance } from "../../utils/axiosInstance";
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";
import HideScrollbar from "../../components/misc/HideScrollBar";

const ViewQuizScores = ({ darkMode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizScores, setQuizScores] = useState([]);

  useEffect(() => {
    fetchQuizScores();
  }, []);

  const fetchQuizScores = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        "/api/user-parent/students/scores/"
      );

      if (response.status === 200 && response.data) {
        const scores = response.data.quiz_scores.student_scores;
        setQuizScores(scores || []);
      } else {
        setError(response.data.message || "Failed to fetch student scores");
      }
    } catch (err) {
      console.error("Error fetching scores:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching student scores"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-4 md:p-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <HideScrollbar />
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-600">
        Quiz/Activity Scores
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-orange-100 to-orange-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">
                Classroom
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8">
                  <div className="flex justify-center items-center">
                    <DotLoaderSpinner color="#f97316" />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-red-500 font-medium"
                >
                  {error}
                </td>
              </tr>
            ) : quizScores.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No quiz scores available
                </td>
              </tr>
            ) : (
              quizScores.map((score) => (
                <tr
                  key={score.id}
                  className="hover:bg-orange-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {score.quiz_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {score.student_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {score.classroom_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-medium text-gray-900">
                      {score.total_score}/{score.total_possible}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {score.status === "passed" ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1.5 h-4 w-4" />
                          Passed
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <FaExclamationCircle className="mr-1.5 h-4 w-4" />
                          Failed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewQuizScores;
