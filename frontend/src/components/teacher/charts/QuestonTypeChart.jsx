import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { axiosInstance } from "../../../utils/axiosInstance";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faChartBar } from "@fortawesome/free-solid-svg-icons";

const QuestionTypeChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const questionTypeLabels = {
    single: "Single Choice",
    multi: "Multiple Choice",
    identification: "Identification",
    true_false: "True or False",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/user-teacher/analytics/question-type-distribution/"
        );

        // Transform the data with green color palette
        const transformedData = {
          labels: response.data.labels.map(
            (label) => questionTypeLabels[label] || label
          ),
          datasets: [
            {
              ...response.data.datasets[0],
              backgroundColor: [
                "rgb(34, 197, 94)", // green-500
                "rgb(21, 128, 61)", // green-700
                "rgb(74, 222, 128)", // green-400
                "rgb(16, 185, 129)", // green-600
              ],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        };

        setChartData(transformedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching question type distribution:", error);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Question Type Distribution from Quiz/Activity",
    },
    series: [
      {
        name: "Questions",
        data: chartData.labels.map((label, index) => ({
          name: label,
          y: chartData.datasets[0].data[index],
        })),
        colorByPoint: true,
      },
    ],
  };

  const generateInsights = () => {
    setGeneratingInsights(true);
    try {
      const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
      const insights = [];

      // Generate distribution insights
      chartData.labels.forEach((label, index) => {
        const percentage = (
          (chartData.datasets[0].data[index] / total) *
          100
        ).toFixed(1);
        insights.push(`${label}: ${percentage}% of total questions`);
      });

      // Generate recommendations
      const distributions = chartData.datasets[0].data.map((value, index) => ({
        type: chartData.labels[index],
        percentage: (value / total) * 100,
      }));

      // Add balance recommendation if needed
      const maxPercentage = Math.max(...distributions.map((d) => d.percentage));
      const minPercentage = Math.min(...distributions.map((d) => d.percentage));

      if (maxPercentage > 40) {
        insights.push(
          `Consider reducing the number of ${
            distributions.find((d) => d.percentage === maxPercentage).type
          } questions to achieve better balance.`
        );
      }

      if (minPercentage < 10) {
        insights.push(
          `Consider increasing the number of ${
            distributions.find((d) => d.percentage === minPercentage).type
          } questions for better coverage.`
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <DotLoaderSpinner color="rgb(34, 197, 94)" />{" "}
        {/* green-500 to match the chart */}
      </div>
    );
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 flex flex-col"
      style={{ minHeight: "400px", width: "100%", maxWidth: "600px" }}
    >
      <div className="flex-1" style={{ minHeight: "300px" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Loading chart data...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : chartData.labels.length > 0 ? (
          <HighchartsReact highcharts={Highcharts} options={options} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <FontAwesomeIcon
              icon={faChartBar}
              className="text-green-600 text-4xl mb-2"
            />
            <div className="text-green-600 font-medium">No data available</div>
          </div>
        )}
      </div>

      {!loading && !error && chartData.labels.length > 0 && (
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
                  Distribution Analysis
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

export default QuestionTypeChart;
