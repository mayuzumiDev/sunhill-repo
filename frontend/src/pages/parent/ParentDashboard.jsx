import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaChartLine,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaBookReader,
} from "react-icons/fa";
import { IoTrendingUp } from "react-icons/io5";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import parentIllusMon from "../../assets/img/home/illustrationMon.png";
import { axiosInstance } from "../../utils/axiosInstance";
import HideScrollbar from "../../components/misc/HideScrollBar";
import QuizScoreDonutChart from "../../components/parent/charts/QuizScoreDonutChart";
import QuizScoreLineChart from "../../components/parent/charts/QuizScoreLineChart";
import ParentStudentProgressChart from "../../components/parent/charts/ParentStudentProgressChart";
import PeerBenchmarking from "../../components/parent/charts/PeerBenchmarking";
// ... import other daily illustrations similarly

// Add this new component at the top of the file
const DailyIllustration = ({ day, darkMode }) => {
  const illustrations = {
    0: {
      // Sunday
      color: "from-purple-400 to-pink-500",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <circle
            cx="100"
            cy="100"
            r="80"
            className="fill-current text-purple-200 dark:text-purple-900"
          />
          <path
            d="M100 50v100M50 100h100"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx="100"
            cy="100"
            r="20"
            className="fill-current text-purple-500"
          />
        </svg>
      ),
    },
    1: {
      // Monday
      color: "from-blue-400 to-indigo-500",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <rect
            x="40"
            y="40"
            width="120"
            height="120"
            rx="10"
            className="fill-current text-blue-200 dark:text-blue-900"
          />
          <path
            d="M70 100h60M100 70v60"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    2: {
      // Tuesday
      color: "from-green-400 to-emerald-500",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <polygon
            points="100,20 180,180 20,180"
            className="fill-current text-green-200 dark:text-green-900"
          />
          <circle
            cx="100"
            cy="100"
            r="30"
            className="fill-current text-green-500"
          />
        </svg>
      ),
    },
    3: {
      // Wednesday
      color: "from-yellow-400 to-orange-500",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <path
            d="M100 20C140 20 180 60 180 100C180 140 140 180 100 180C60 180 20 140 20 100C20 60 60 20 100 20Z"
            className="fill-current text-yellow-200 dark:text-yellow-900"
          />
          <path
            d="M100 60v80M60 100h80"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    4: {
      // Thursday
      color: "from-red-400 to-rose-500",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <rect
            x="30"
            y="30"
            width="140"
            height="140"
            className="fill-current text-red-200 dark:text-red-900"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            className="fill-current text-red-500"
          />
        </svg>
      ),
    },
    5: {
      // Friday
      color: "from-pink-400 to-fuchsia-500",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <path
            d="M20,100 A80,80 0 1,1 180,100 A80,80 0 1,1 20,100"
            className="fill-current text-pink-200 dark:text-pink-900"
          />
          <circle
            cx="100"
            cy="100"
            r="30"
            className="fill-current text-pink-500"
          />
        </svg>
      ),
    },
    6: {
      // Saturday
      color: "from-violet-400 to-purple-500",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <path
            d="M100,20 L180,180 H20 Z"
            className="fill-current text-violet-200 dark:text-violet-900"
          />
          <circle
            cx="100"
            cy="100"
            r="25"
            className="fill-current text-violet-500"
          />
        </svg>
      ),
    },
  };

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden
      bg-gradient-to-br ${illustrations[day].color}
      ${darkMode ? "opacity-80" : "opacity-90"}
      transition-all duration-300 ease-in-out
      hover:scale-105 hover:opacity-100`}
    >
      {illustrations[day].icon}
    </div>
  );
};

// Add these chart configurations after imports
const createGradeChartOptions = (studentData, darkMode) => ({
  chart: {
    type: "line",
    backgroundColor: "transparent",
    style: { fontFamily: "Inter, sans-serif" },
    height: "300px",
  },
  title: {
    text: "Academic Performance",
    align: "left",
    style: {
      fontSize: "16px",
      fontWeight: "600",
      color: darkMode ? "#fff" : "#000",
    },
  },
  xAxis: {
    categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    labels: {
      style: { color: darkMode ? "#cbd5e1" : "#475569" },
    },
    gridLineWidth: 0,
  },
  yAxis: {
    title: { text: null },
    labels: {
      style: { color: darkMode ? "#cbd5e1" : "#475569" },
    },
    gridLineColor: darkMode ? "#374151" : "#e5e7eb",
    min: 0,
    max: 100,
  },
  series: studentData.map((student) => ({
    name: student.name,
    data: [
      parseFloat(student.grade_average) || 75,
      parseFloat(student.grade_average) + Math.random() * 5 || 78,
      parseFloat(student.grade_average) - Math.random() * 3 || 82,
      parseFloat(student.grade_average) + Math.random() * 4 || 85,
    ],
    marker: { symbol: "circle" },
  })),
  legend: {
    align: "right",
    verticalAlign: "top",
    itemStyle: { color: darkMode ? "#cbd5e1" : "#475569" },
  },
  credits: { enabled: false },
  plotOptions: {
    line: {
      lineWidth: 3,
      states: {
        hover: { lineWidth: 4 },
      },
    },
  },
});

const createAttendanceChartOptions = (studentData, darkMode) => ({
  chart: {
    type: "column",
    backgroundColor: "transparent",
    style: { fontFamily: "Inter, sans-serif" },
    height: "300px",
  },
  title: {
    text: "Monthly Attendance",
    align: "left",
    style: {
      fontSize: "16px",
      fontWeight: "600",
      color: darkMode ? "#fff" : "#000",
    },
  },
  xAxis: {
    categories: studentData.map((student) => student.name),
    labels: {
      style: { color: darkMode ? "#cbd5e1" : "#475569" },
    },
    gridLineWidth: 0,
  },
  yAxis: {
    title: { text: null },
    labels: {
      format: "{value}%",
      style: { color: darkMode ? "#cbd5e1" : "#475569" },
    },
    gridLineColor: darkMode ? "#374151" : "#e5e7eb",
    min: 0,
    max: 100,
  },
  series: [
    {
      name: "Attendance Rate",
      data: studentData.map((student) => ({
        y: student.attendance_rate || 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      })),
      borderRadius: 5,
    },
  ],
  legend: { enabled: false },
  credits: { enabled: false },
  plotOptions: {
    column: {
      minPointLength: 3,
    },
  },
});

const ParentDashboard = ({ darkMode }) => {
  const [quizScores, setQuizScores] = useState([]);
  const [isQuizScoresLoading, setIsQuizScoresLoading] = useState(true);

  const [quizActivtyMetrics, setQuizActivityMetrics] = useState({
    totalAssignments: 0,
    upcomingTests: 0,
  });

  useEffect(() => {
    console.log("Fetching metrics data...");
    axiosInstance
      .get("/api/user-parent/metrics/")
      .then((response) => {
        console.log("Metrics API Response:", response);
        if (response.data) {
          console.log("Metrics Data:", response.data);
          setQuizActivityMetrics((prevMetrics) => ({
            ...prevMetrics,
            totalAssignments: response.data.totalAssignments || 0,
            upcomingTests: response.data.upcomingTests || 0,
            studentName: response.data.studentName || "",
          }));
        } else {
          console.warn("No data in metrics response");
        }
      })
      .catch((error) => {
        console.error("Metrics API Error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      });
  }, []);

  const fetchQuizScores = async () => {
    try {
      setIsQuizScoresLoading(true);
      const response = await axiosInstance.get(
        "/api/user-parent/students/scores/"
      );

      if (response.status === 200 && response.data) {
        const scores = response.data.quiz_scores.student_scores;
        console.log(scores);
        setQuizScores(scores || []);
      }
    } catch (error) {
      console.error("Error fetching quiz scores:", error);
    } finally {
      setIsQuizScoresLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizScores();
  }, []);

  const [date, setDate] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [currentDay] = useState(new Date().getDay());
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    upcomingTests: 0,
    averageGrade: 0,
    attendanceRate: 0,
    nextAssignment: null,
    recentGrades: [],
  });
  const [parentName, setParentName] = useState("");
  const [studentMetrics, setStudentMetrics] = useState([]);

  // Update the fetchParentData useEffect
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/user-parent/current-parent/"
        );
        if (response.data.status === "success") {
          const profile = response.data.data;
          setParentName(profile.first_name || "");

          // Fetch detailed metrics for each student
          if (profile.student_info?.length) {
            const studentsData = await Promise.all(
              profile.student_info.map(async (student) => {
                try {
                  const metricsResponse = await axiosInstance.get(
                    `/api/students/${student.id}/metrics`
                  );
                  return {
                    id: student.id,
                    name: `${student.first_name} ${student.last_name}`,
                    grade: student.grade_level,
                    email: student.email,
                    profile_image: student.user_info?.profile_image,
                    ...metricsResponse.data,
                  };
                } catch (error) {
                  console.error(
                    `Error fetching metrics for student ${student.id}:`,
                    error
                  );
                  return {
                    id: student.id,
                    name: `${student.first_name} ${student.last_name}`,
                    grade: student.grade_level,
                    email: student.email,
                    profile_image: student.user_info?.profile_image,
                    error: true,
                  };
                }
              })
            );
            setStudentMetrics(studentsData);

            // Update overall metrics
            const totalAssignments = studentsData.reduce(
              (sum, student) => sum + (student.assignments?.length || 0),
              0
            );
            const totalTests = studentsData.reduce(
              (sum, student) => sum + (student.upcoming_tests?.length || 0),
              0
            );
            const avgAttendance =
              studentsData.reduce(
                (sum, student) => sum + (student.attendance_rate || 0),
                0
              ) / studentsData.length;

            setMetrics((prevMetrics) => ({
              ...prevMetrics,
              totalStudents: profile.student_info.length,
              totalAssignments,
              upcomingTests: totalTests,
              attendanceRate: Math.round(avgAttendance || 0),
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };

    fetchParentData();
  }, []);

  // Update the greeting useEffect
  useEffect(() => {
    const getGreetingAndIllustration = () => {
      const currentHour = new Date().getHours();
      const dayOfWeek = new Date().getDay();
      let greetingMessage = "";

      if (currentHour < 12) greetingMessage = "Good Morning";
      else if (currentHour < 18) greetingMessage = "Good Afternoon";
      else greetingMessage = "Good Evening";

      // Add parent name if available
      if (parentName) {
        greetingMessage += `, ${parentName}`;
      }

      const dayMessages = {
        0: ["Happy Sunday! Time to review the week's progress."],
        1: ["Welcome to a new week of learning!"],
        2: ["Keep track of your child's progress today."],
        3: ["Midweek check-in on your child's activities."],
        4: ["Almost there! Review upcoming assignments."],
        5: ["End the week strong! Check weekend homework."],
        6: ["Weekend learning begins! Plan study sessions."],
      };

      const randomMessage = dayMessages[dayOfWeek][0];
      greetingMessage += `. ${randomMessage}`;
      setGreeting(greetingMessage);
    };

    getGreetingAndIllustration();
  }, [parentName]); // Add parentName as a dependency

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="p-3 sm:p-6 min-h-screen">
      <HideScrollbar />
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-8">
          {/* Banner Section */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl shadow-lg overflow-hidden ${
              darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
            }`}
          >
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 10 0 L 0 0 0 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Left Side - Text Content */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-4xl font-bold">
                      <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-transparent bg-clip-text">
                        {greeting}
                      </span>
                    </h1>
                    <p
                      className={`text-sm sm:text-base ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Right Side - Illustration */}
                  <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
                    <div className="relative w-full h-full">
                      <DailyIllustration day={currentDay} darkMode={darkMode} />
                      {/* Decorative Elements */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-75" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Updated Metrics Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Children Count */}
            <div
              className={`flex flex-col justify-center rounded-xl p-4 ${
                darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
              } shadow-lg`}
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaUserGraduate className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    My Children
                  </p>
                  <h3 className="text-xl font-semibold">
                    {metrics.totalStudents}
                  </h3>
                </div>
              </div>
            </div>

            {/* Total Assignments */}
            <div
              className={`flex flex-col justify-center rounded-xl p-4 ${
                darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
              } shadow-lg`}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FaClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pending Quiz/Activity
                  </p>
                  <h3 className="text-xl font-semibold">
                    {quizActivtyMetrics.totalAssignments}
                  </h3>
                </div>
              </div>
            </div>

            {/* Upcoming Tests */}
            <div
              className={`flex flex-col justify-center rounded-xl p-4 ${
                darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
              } shadow-lg`}
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <FaBookReader className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed Quiz/Activity
                  </p>
                  <h3 className="text-xl font-semibold">
                    {quizActivtyMetrics.upcomingTests}
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Student Details Section */}

          {/* Charts Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row gap-4"
          >
            {quizScores.length > 0 && (
              <>
                <motion.div variants={itemVariants} className="w-full lg:w-1/2">
                  <QuizScoreDonutChart
                    quizScores={quizScores}
                    darkMode={darkMode}
                    isLoading={isQuizScoresLoading}
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="w-full lg:w-1/2">
                  <QuizScoreLineChart
                    quizScores={quizScores}
                    darkMode={darkMode}
                    isLoading={isQuizScoresLoading}
                  />
                </motion.div>
              </>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full"
          >
            <motion.div variants={itemVariants} className="w-full h-full">
              <PeerBenchmarking />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full h-full">
              <ParentStudentProgressChart />
            </motion.div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
          {/* Calendar Card */}
          <div
            className={`rounded-xl shadow-lg p-4 sm:p-6 ${
              darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Calendar</h2>
            <Calendar
              onChange={setDate}
              value={date}
              className={`w-full rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            />
          </div>

          {/* Insights Card */}
          {/* <div
            className={`rounded-xl shadow-lg p-4 sm:p-6 ${
              darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Student Insights</h2>
            Add your insights components here
          </div> */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ParentDashboard;
