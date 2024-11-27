import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const QuizScoreLineChart = ({ quizScores, darkMode }) => {
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
        label: "Average Quiz Score (%)",
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
        text: "Monthly Quiz Score Progress",
        color: darkMode ? "#fff" : "#000",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const monthData = monthlyData[context.dataIndex];
            const labels = [
              `Average Score: ${monthData.averageScore}%`,
              `Total Quizzes: ${monthData.scores.length}`,
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
    </div>
  );
};

export default QuizScoreLineChart;
