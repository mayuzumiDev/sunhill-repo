import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faChartBar } from "@fortawesome/free-solid-svg-icons";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const QuestionTypePerformance = () => {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
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
          "/user-teacher/analytics/question-type-performance/"
        );

        // console.log("Raw API Response:", response.data);
        // console.log("Labels:", response.data.labels);
        // console.log("Datasets:", response.data.datasets);

        // Transform the data for Highcharts
        const transformedData = {
          categories: response.data.labels.map(
            (label) => questionTypeLabels[label] || label
          ),
          series: [
            {
              name: "Performance",
              data: response.data.datasets[0].data,
              color: "rgba(34, 197, 94, 0.8)", // Example color
            },
          ],
        };

        // console.log("Transformed Data:", transformedData);

        setChartData(transformedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      type: "column",
      height: "400px",
    },
    title: {
      text: "Performance by Question Type",
    },
    xAxis: {
      categories: chartData.categories,
      title: {
        text: "Question Type",
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Success Rate (%)",
      },
      tickInterval: 25,
    },
    series: chartData.series,
  };

  const generateInsights = () => {
    setGeneratingInsights(true);
    try {
      const insights = [];
      const performanceData = chartData.series[0].data;
      const labels = chartData.categories;

      // Find best and worst performing types
      const maxPerf = Math.max(...performanceData);
      const minPerf = Math.min(...performanceData);
      const bestType = labels[performanceData.indexOf(maxPerf)];
      const worstType = labels[performanceData.indexOf(minPerf)];

      // Add performance insights
      insights.push(`Best performance: ${bestType} (${maxPerf}% success rate)`);
      insights.push(
        `Lowest performance: ${worstType} (${minPerf}% success rate)`
      );

      // Add recommendations
      if (minPerf < 60) {
        insights.push(
          `Consider reviewing ${worstType} questions as they show lower performance.`
        );
      }
      if (maxPerf - minPerf > 30) {
        insights.push(
          "There's a significant performance gap between question types. Consider balancing difficulty levels."
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
        <DotLoaderSpinner color="rgb(34, 197, 94)" />
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
        ) : chartData.categories.length > 0 ? (
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

      {!loading && !error && chartData.categories.length > 0 && (
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

export default QuestionTypePerformance;
