import React, { useState, useEffect } from 'react';
import { FaUser, FaBook, FaCalendarAlt, FaBell, FaBullhorn, FaChartLine, FaGraduationCap, FaClock, FaUserGraduate, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ParentDashboard = ({ darkMode }) => {
  const [students, setStudents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [progressData, setProgressData] = useState({
    labels: [],
    datasets: []
  });
  const [attendanceData, setAttendanceData] = useState({});
  const [gradeDistribution, setGradeDistribution] = useState({});
  const [studyTimeData, setStudyTimeData] = useState({});
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    averageGrade: 0,
    completedAssignments: 0,
    upcomingTests: 0
  });

  useEffect(() => {
    // Fetch data from API or context
    // This is a placeholder. Replace with actual API calls.
    setStudents([
      { id: 1, name: 'John Doe', grade: '10th' },
      { id: 2, name: 'Jane Doe', grade: '8th' },
    ]);
    setUpcomingEvents([
      { id: 1, title: 'Parent-Teacher Meeting', date: '2023-06-15' },
      { id: 2, title: 'School Sports Day', date: '2023-06-20' },
    ]);
    setRecentAssignments([
      { id: 1, title: 'Math Homework', dueDate: '2023-06-10', status: 'Completed' },
      { id: 2, title: 'Science Project', dueDate: '2023-06-18', status: 'Pending' },
    ]);
    setNotifications([
      { id: 1, message: 'John Doe has a new grade posted', date: '2023-06-05' },
      { id: 2, message: 'Jane Doe has an upcoming test', date: '2023-06-07' },
    ]);
    setAnnouncements([
      { id: 1, title: 'School Closure', content: 'School will be closed on June 21st for maintenance.', date: '2023-06-01' },
      { id: 2, title: 'New Curriculum', content: 'New math curriculum to be implemented next semester.', date: '2023-06-03' },
    ]);
    setProgressData({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'John Doe',
          data: [65, 70, 68, 72, 75, 80],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Jane Doe',
          data: [70, 72, 75, 78, 82, 85],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    });
    setAttendanceData({
      labels: ['Present', 'Absent', 'Late'],
      datasets: [
        {
          data: [90, 5, 5],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
        },
      ],
    });
    setGradeDistribution({
      labels: ['A', 'B', 'C', 'D', 'F'],
      datasets: [
        {
          label: 'Grade Distribution',
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
        },
      ],
    });
    setStudyTimeData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Study Hours',
          data: [2, 3, 2.5, 4, 3, 1, 0.5],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    });
    setMetrics({
      totalStudents: 2,
      averageGrade: 85,
      completedAssignments: 15,
      upcomingTests: 3
    });
  }, []);

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance Overview',
      },
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Student Progress',
      },
    },
  };

  const gradeDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Grade Distribution',
      },
    },
  };

  const studyTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Study Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
      },
    },
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard icon={FaUserGraduate} title="Total Students" value={metrics.totalStudents} darkMode={darkMode} />
        <MetricCard icon={FaChartLine} title="Average Grade" value={`${metrics.averageGrade}%`} darkMode={darkMode} />
        <MetricCard icon={FaClipboardCheck} title="Completed Assignments" value={metrics.completedAssignments} darkMode={darkMode} />
        <MetricCard icon={FaExclamationTriangle} title="Upcoming Tests" value={metrics.upcomingTests} darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard icon={FaUser} title="Your Children" darkMode={darkMode}>
          {students.map(student => (
            <div key={student.id} className="flex justify-between items-center mb-2 p-2 bg-opacity-50 bg-orange-200 rounded">
              <span>{student.name}</span>
              <span className="font-semibold">{student.grade}</span>
            </div>
          ))}
        </DashboardCard>

        <DashboardCard icon={FaCalendarAlt} title="Upcoming School Events" darkMode={darkMode}>
          {upcomingEvents.map(event => (
            <div key={event.id} className="mb-2 p-2 bg-opacity-50 bg-orange-200 rounded">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm">Date: {event.date}</p>
            </div>
          ))}
        </DashboardCard>

        <DashboardCard icon={FaBook} title="Recent Assignments" darkMode={darkMode}>
          {recentAssignments.map(assignment => (
            <div key={assignment.id} className="mb-2 p-2 bg-opacity-50 bg-orange-200 rounded">
              <p className="font-semibold">{assignment.title}</p>
              <p className="text-sm">Due: {assignment.dueDate}</p>
              <p className={`text-sm ${assignment.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                Status: {assignment.status}
              </p>
            </div>
          ))}
        </DashboardCard>

        <DashboardCard icon={FaBell} title="Important Notifications" darkMode={darkMode}>
          {notifications.map(notification => (
            <div key={notification.id} className="mb-2 p-2 bg-opacity-50 bg-orange-200 rounded">
              <p>{notification.message}</p>
              <p className="text-sm text-gray-600">{notification.date}</p>
            </div>
          ))}
        </DashboardCard>

        <DashboardCard icon={FaBullhorn} title="School Announcements" darkMode={darkMode}>
          {announcements.map(announcement => (
            <div key={announcement.id} className="mb-4 p-2 bg-opacity-50 bg-orange-200 rounded">
              <h3 className="font-semibold">{announcement.title}</h3>
              <p className="text-sm mt-1">{announcement.content}</p>
              <p className="text-xs mt-1 text-gray-600">{announcement.date}</p>
            </div>
          ))}
        </DashboardCard>

        <DashboardCard icon={FaChartLine} title="Your Child's Progress" darkMode={darkMode}>
          <div className="h-64">
            {progressData.datasets.length > 0 ? (
              <Line options={chartOptions} data={progressData} />
            ) : (
              <p>Loading progress data...</p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard icon={FaChartLine} title="Attendance Summary" darkMode={darkMode}>
          <div className="h-64">
            {attendanceData.datasets && attendanceData.datasets.length > 0 ? (
              <Doughnut options={doughnutChartOptions} data={attendanceData} />
            ) : (
              <p>Loading attendance data...</p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard icon={FaGraduationCap} title="Grade Distribution" darkMode={darkMode}>
          <div className="h-64">
            {gradeDistribution.datasets && gradeDistribution.datasets.length > 0 ? (
              <Bar options={gradeDistributionOptions} data={gradeDistribution} />
            ) : (
              <p>Loading grade distribution data...</p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard icon={FaClock} title="Weekly Study Time" darkMode={darkMode}>
          <div className="h-64">
            {studyTimeData.datasets && studyTimeData.datasets.length > 0 ? (
              <Bar options={studyTimeOptions} data={studyTimeData} />
            ) : (
              <p>Loading study time data...</p>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon: Icon, title, children, darkMode }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-orange-100'}`}>
      <div className="flex items-center mb-4">
        <Icon className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} size={24} />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, title, value, darkMode }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-orange-100'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} size={24} />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  );
};

export default ParentDashboard;
