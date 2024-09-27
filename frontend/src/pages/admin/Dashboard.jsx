import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaSchool } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Data for the line chart
  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Students",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
      {
        label: "Teachers",
        data: [35, 49, 60, 71, 66, 75, 70],
        fill: false,
        borderColor: "rgba(192,75,192,1)",
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "School Metrics Overview",
      },
    },
  };

  // Data for the pie chart
  const pieData = {
    labels: ["Students", "Teachers", "Parents", "Public"],
    datasets: [
      {
        data: [200, 30, 150, 50],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  // Metrics data
  const metrics = [
    { id: 1, label: "Students", value: 200, icon: <FaUserGraduate size={30} className="text-blue-500" /> },
    { id: 2, label: "Teachers", value: 30, icon: <FaChalkboardTeacher size={30} className="text-green-500" /> },
    { id: 3, label: "Parents", value: 150, icon: <FaUsers size={30} className="text-yellow-500" /> },
    { id: 4, label: "Classes", value: 20, icon: <FaSchool size={30} className="text-red-500" /> },
  ];

  return (
    <div className="p-6 space-y-8 overflow-hidden bg-lightblue-800">
      <h1 className="text-4xl text-gray-700 font-bold mb-8">Dashboard</h1>

      {/* Metrics Section with Hover Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white p-6 rounded-lg shadow-lg flex items-center hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div className="mr-4">{metric.icon}</div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-700">{metric.value}</h3>
              <p className="text-sm md:text-base text-gray-500">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4">School Data Over Time</h2>
          <div style={{ height: "300px" }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Pie Chart - Responsive */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4">School Demographics</h2>
          <div className="w-full h-full lg:h-96 lg:w-96 mx-auto">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Styles to hide scrollbar */}
      <style jsx>{`
        /* Hide scrollbar in all browsers */
        ::-webkit-scrollbar {
          display: none;
        }
        body {
          overflow: hidden; /* Prevent scrolling on the body */
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
