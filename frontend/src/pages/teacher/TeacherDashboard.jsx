import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FaBook,
  FaUserGraduate,
  FaClipboardCheck,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaChartLine,
} from 'react-icons/fa';

// Registering chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const TeacherDashboard = ({ darkMode }) => {
  const metrics = [
    { title: 'Class Progress', value: '75%', color: 'bg-blue-600' },
    { title: 'Student Activity', value: '85%', color: 'bg-green-600' },
    { title: 'Upcoming Lessons', value: '3', color: 'bg-yellow-400' },
    { title: 'Assignments Due', value: '2', color: 'bg-red-600' },
  ];

  const quickLinks = [
    { title: 'Create Lesson', icon: <FaBook />, action: () => alert('Navigating to Lesson Creation') },
    { title: 'Manage Students', icon: <FaUserGraduate />, action: () => alert('Navigating to Student Management') },
    { title: 'Grading', icon: <FaClipboardCheck />, action: () => alert('Navigating to Grading') },
    { title: 'Teacher Resources', icon: <FaChalkboardTeacher />, action: () => alert('Navigating to Teacher Resources') },
    { title: 'Class Schedule', icon: <FaCalendarAlt />, action: () => alert('Navigating to Class Schedule') },
    { title: 'Progress Reports', icon: <FaChartLine />, action: () => alert('Navigating to Progress Reports') },
  ];

  // Sample data for the charts
  const barChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Assignments Completed',
        data: [10, 15, 12, 20],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Student Performance',
        data: [65, 70, 75, 80],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Sample data for top-performing students
  const topStudents = [
    { name: 'Alice', score: 90, rank: 1 },
    { name: 'John', score: 85, rank: 2 },
    { name: 'Eve', score: 88, rank: 3 },
    { name: 'Bob', score: 78, rank: 4 },
  ];

  // State for filtering students
  const [filter, setFilter] = useState('');

  const filteredStudents = topStudents.filter(student =>
    student.name.toLowerCase().includes(filter.toLowerCase())
  );

  const viewReports = (studentName) => {
    alert(`Viewing reports for ${studentName}`);
  };

  return (
    <div className={`p-6 min-h-screen grid grid-cols-1 lg:grid-cols-4 gap-6`}>
      {/* Main Dashboard Section */}
      <div className="col-span-3">
        <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className={`p-4 rounded-lg shadow-lg flex flex-col justify-between ${metric.color} text-white transition-transform transform hover:scale-105`}
            >
              <div>
                <h2 className="text-sm font-semibold">{metric.title}</h2>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section with only two charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className={`rounded-lg shadow-lg p-4 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-md font-semibold mb-4">Assignments Completion Over Time</h2>
            <Bar data={barChartData} options={chartOptions} />
          </div>
          <div className={`rounded-lg shadow-lg p-4 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-md font-semibold mb-4">Student Performance Over Time</h2>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Top Performing Students Section */}
        <div className={`mt-8 rounded-lg shadow-lg p-6 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-md font-semibold mb-4">Top Performing Students</h2>

          {/* Filter Section */}
          <input
            type="text"
            placeholder="Filter students by name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-4 w-full"
          />

          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((student, index) => (
              <div key={index} className="flex justify-between p-2 border-b">
                <span>{student.name} (Rank: {student.rank})</span>
                <span>{student.score}%</span>
                <button
                  onClick={() => viewReports(student.name)}
                  className="text-blue-600 hover:underline"
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className={`col-span-1 mt-14 rounded-lg shadow-lg p-6 h-fit ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <ul className="space-y-4">
          {quickLinks.map((link, index) => (
            <li key={index} className="flex items-center p-2 cursor-pointer hover:bg-gray-200 rounded transition-colors">
              <span className="text-xl mr-3">{link.icon}</span>
              <span onClick={link.action}>{link.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboard;
