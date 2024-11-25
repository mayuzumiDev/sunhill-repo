import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import teachingIllusMon from "../../assets/img/home/illustrationMon.png";
import teachingIllusTue from "../../assets/img/home/illustrationTue.png";
import teachingIllusWed from "../../assets/img/home/illustrationWed.png";
import teachingIllusThu from "../../assets/img/home/illustrationThu.png";
import teachingIllusFri from "../../assets/img/home/illustrationFri.png";
import teachingIllusSat from "../../assets/img/home/illustrationSat.png";
import teachingIllusSun from "../../assets/img/home/illustrationSun.png";
import { axiosInstance } from "../../utils/axiosInstance";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { motion } from 'framer-motion';
import { IoStatsChart, IoTrendingUp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";

const TeacherDashboard = ({ darkMode, userName = "Teacher" }) => {
  const [greeting, setGreeting] = useState("");
  const [date, setDate] = useState(new Date());
  const [illustrations, setIllustration] = useState(teachingIllusMon);
  const [filter, setFilter] = useState("");
  const [teacherData, setTeacherData] = useState(null);
  const [classroomData, setClassroomData] = useState({
    totalClassrooms: 0,
    totalStudents: 0,
    totalMaterials: 0,
    upcomingQuizzes: 0
  });
  const [assignmentData, setAssignmentData] = useState({
    labels: [],
    values: []
  });
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    values: []
  });
  const [chartsLoading, setChartsLoading] = useState(false);
  const navigate = useNavigate();
  const [teacherInsights, setTeacherInsights] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Setting greeting message and daily illustration
  useEffect(() => {
    const getGreetingAndIllustration = () => {
      const currentHour = new Date().getHours();
      const dayOfWeek = new Date().getDay();
      let greetingMessage = "";

      if (currentHour < 12) {
        greetingMessage = "Good Morning";
      } else if (currentHour < 18) {  
        greetingMessage = "Good Afternoon";
      } else {
        greetingMessage = "Good Evening";
      }

      const dayMessages = {
        0: [
          "Relax and recharge, it's Sunday!",
          "Sundays are for self-care, enjoy your day!",
          "A perfect day for some well-deserved rest. Happy Sunday!",
        ],
        1: [
          "Let's make this Monday count! You're unstoppable!",
          "Rise and conquer, it's Monday! A new week to shine!",
          "Embrace the week ahead with energy and passion. Happy Monday!",
        ],
        2: [
          "Happy Teaching Tuesday! Inspire young minds today!",
          "Tuesday is for progress, keep going strong!",
          "Let's make today a stepping stone to greatness. Happy Tuesday!",
        ],
        3: [
          "It's midweek Wednesday! Push through, success is near!",
          "Keep going, the weekend is getting closer!",
          "Happy Wednesday! You're halfway there to a fantastic week!",
        ],
        4: [
          "Thursday's here, the weekend is just around the corner!",
          "Almost there! Finish strong, it's Thursday!",
          "Stay focused, Friday is almost here! Happy Thursday!",
        ],
        5: [
          "It's Friday! Finish strong and enjoy the weekend ahead!",
          "The weekend is so close, let's wrap up the week with success!",
          "Happy Friday! A great week deserves a relaxing weekend!",
        ],
        6: [
          "Happy Saturday! Time to relax, reflect, and recharge!",
          "Enjoy your Saturday to the fullest, you've earned it!",
          "Saturday is here! Relax and do what makes you happy!",
        ],
      };

      const dayMessageOptions = dayMessages[dayOfWeek];
      const randomMessage =
        dayMessageOptions[Math.floor(Math.random() * dayMessageOptions.length)];
      greetingMessage += `, ${randomMessage}`;

      setGreeting(greetingMessage);

      const illustrations = [
        teachingIllusSun,
        teachingIllusMon,
        teachingIllusTue,
        teachingIllusWed,
        teachingIllusThu,
        teachingIllusFri,
        teachingIllusSat,
      ];

      setIllustration(illustrations[dayOfWeek]);
    };

    getGreetingAndIllustration();
  }, [userName]);

  // Add new useEffect to fetch classroom metrics
  useEffect(() => {
    const fetchClassroomMetrics = async () => {
      setMetricsLoading(true);
      try {
        // Fetch classrooms
        const classroomsResponse = await axiosInstance.get('/user-teacher/classroom/list/');
        const classrooms = classroomsResponse.data.classroom_list;
        
        // Initialize counters
        let totalStudents = 0;
        let totalMaterials = 0;
        let totalQuizzes = 0;

        // Fetch student count, materials, and quizzes for each classroom
        for (const classroom of classrooms) {
          // Get students
          const studentsResponse = await axiosInstance.get('/user-teacher/classroom/list-student/', {
            params: { classroom_id: classroom.id }
          });
          totalStudents += studentsResponse.data.classroom_student_list.length;

          // Get materials
          const materialsResponse = await axiosInstance.get('/user-teacher/materials/list/', {
            params: { classroom: classroom.id }
          });
          totalMaterials += materialsResponse.data.materials_list.length;

          // Get quizzes
          const quizzesResponse = await axiosInstance.get(`/user-teacher/quiz/list/?classroom_id=${classroom.id}`);
          totalQuizzes += quizzesResponse.data.quizzes.length;
        }

        setClassroomData({
          totalClassrooms: classrooms.length,
          totalStudents: totalStudents,
          totalMaterials: totalMaterials,
          upcomingQuizzes: totalQuizzes
        });
      } catch (error) {
        console.error("Error fetching classroom metrics:", error);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchClassroomMetrics();
  }, []);

  // Update chart data fetch to include quiz insights
  useEffect(() => {
    const fetchChartData = async () => {
      setChartsLoading(true);
      try {
        // Fetch all classrooms first
        const classroomsResponse = await axiosInstance.get('/user-teacher/classroom/list/');
        const classrooms = classroomsResponse.data.classroom_list;

        let allQuizScores = [];
        let studentScores = {};

        // For each classroom, fetch quizzes and their scores
        for (const classroom of classrooms) {
          // Get quizzes for this classroom
          const quizzesResponse = await axiosInstance.get(
            `/user-teacher/quiz/list/?classroom_id=${classroom.id}`
          );
          const quizzes = quizzesResponse.data.quizzes;

          // For each quiz, get scores
          for (const quiz of quizzes) {
            const scoresResponse = await axiosInstance.get(
              '/user-teacher/quiz-scores/list/',
              {
                params: {
                  classroom: classroom.id,
                  quiz: quiz.id,
                },
              }
            );

            const scores = scoresResponse.data.quiz_scores;
            
            // Track individual student performance
            scores.forEach(score => {
              if (!studentScores[score.student_name]) {
                studentScores[score.student_name] = {
                  totalScore: 0,
                  quizCount: 0,
                  scores: []
                };
              }
              if (score.total_score !== null) {
                studentScores[score.student_name].totalScore += score.total_score;
                studentScores[score.student_name].quizCount += 1;
                studentScores[score.student_name].scores.push(score.total_score);
              }
            });

            // Calculate quiz completion data
            const totalStudents = scores.length;
            const submittedCount = scores.filter(score => score.total_score !== null).length;
            const totalScore = scores.reduce((sum, score) => sum + (score.total_score || 0), 0);
            const averageScore = submittedCount > 0 ? totalScore / submittedCount : 0;

            allQuizScores.push({
              quiz_id: quiz.id,
              quiz_title: quiz.title,
              date_created: quiz.date_created,
              total_students: totalStudents,
              submitted_count: submittedCount,
              average_score: averageScore,
            });
          }
        }

        if (allQuizScores.length === 0) {
          setAssignmentData({
            labels: ['No Data Available'],
            values: [0]
          });
          setPerformanceData({
            labels: ['No Data Available'],
            values: [0]
          });
          return;
        }

        // Sort by date and take last 5 quizzes for completion rates
        allQuizScores.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
        const recentQuizzes = allQuizScores.slice(-5);

        // Process data for bar chart (completion rates)
        setAssignmentData({
          labels: recentQuizzes.map(item => item.quiz_title || `Quiz ${item.quiz_id}`),
          values: recentQuizzes.map(item => {
            const completionRate = (item.submitted_count / item.total_students) * 100;
            return Math.round(completionRate);
          })
        });

        // Process top 5 students by average score for line chart
        const studentAverages = Object.entries(studentScores)
          .map(([name, data]) => ({
            name,
            averageScore: data.quizCount > 0 ? data.totalScore / data.quizCount : 0
          }))
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 5);

        // Set performance data for top students
        setPerformanceData({
          labels: studentAverages.map(student => student.name),
          values: studentAverages.map(student => Math.round(student.averageScore))
        });

      } catch (error) {
        console.error("Error fetching chart data:", error);
        setAssignmentData({
          labels: ['Error Loading Data'],
          values: [0]
        });
        setPerformanceData({
          labels: ['Error Loading Data'],
          values: [0]
        });
      } finally {
        setChartsLoading(false);
      }
    };

    // Initial fetch
    fetchChartData();
    
    // Optional: If you need periodic updates, use a longer interval
    // const intervalId = setInterval(fetchChartData, 300000); // 5 minutes
    // return () => clearInterval(intervalId);
    
  }, []); // Empty dependency array for single execution

  // Add new useEffect for generating insights
  useEffect(() => {
    const generateInsights = () => {
      const insights = [];

      // Student Engagement Insight (based on quiz completion rates)
      if (assignmentData.values.length > 0) {
        const averageCompletion = assignmentData.values.reduce((a, b) => a + b, 0) / assignmentData.values.length;
        insights.push({
          title: "Student Engagement",
          metric: `${Math.round(averageCompletion)}%`,
          trend: averageCompletion > 75 ? "up" : averageCompletion > 50 ? "warning" : "down",
          recommendation: averageCompletion < 75 
            ? "Consider interactive activities to boost quiz completion rates"
            : "Maintain current engagement strategies",
          
          icon: <IoTrendingUp className={`${averageCompletion > 75 ? "text-green-500" : "text-yellow-500"}`} />,
          priority: averageCompletion < 50 ? "high" : averageCompletion < 75 ? "medium" : "low"
        });
      }

      // // Learning Gaps Insight (based on performance data)
      // if (performanceData.values.length > 0) {
      //   const averageScore = performanceData.values.reduce((a, b) => a + b, 0) / performanceData.values.length;
      //   const lowPerformingCount = performanceData.values.filter(score => score < 60).length;
        
      //   insights.push({
      //     title: "Learning Gaps",
      //     metric: `${lowPerformingCount} subjects`,
      //     trend: lowPerformingCount > 2 ? "down" : "up",
      //     recommendation: lowPerformingCount > 0 
      //       ? `Review needed in ${lowPerformingCount} subjects with scores below 60%`
      //       : "All subjects performing well",
          
      //     icon: <FaBook className={`${lowPerformingCount > 2 ? "text-red-500" : "text-green-500"}`} />,
      //     priority: lowPerformingCount > 2 ? "high" : lowPerformingCount > 0 ? "medium" : "low"
      //   });
      // }

      // // At-Risk Students Insight
      // if (performanceData.values.length > 0) {
      //   const atRiskCount = performanceData.values.filter(score => score < 50).length;
      //   insights.push({
      //     title: "At-Risk Students",
      //     metric: `${atRiskCount} students`,
      //     trend: atRiskCount > 0 ? "down" : "up",
      //     recommendation: atRiskCount > 0
      //       ? `Schedule support sessions for ${atRiskCount} students below 50%`
      //       : "No students currently at risk",
       
      //     icon: <FaUserGraduate className={`${atRiskCount > 0 ? "text-red-500" : "text-green-500"}`} />,
      //     priority: atRiskCount > 2 ? "high" : atRiskCount > 0 ? "medium" : "low"
      //   });
      // }

      // Class Progress Insight (based on materials and quizzes)
      const materialsPerStudent = classroomData.totalStudents > 0 
        ? classroomData.totalMaterials / classroomData.totalStudents 
        : 0;
      insights.push({
        title: "Class Progress",
        metric: `${Math.round(materialsPerStudent * 10) / 10} materials/student`,
        trend: materialsPerStudent > 2 ? "up" : "warning",
        recommendation: materialsPerStudent < 2 
          ? "Consider adding more learning materials"
          : "Good material distribution",
        
        icon: <IoStatsChart className={`${materialsPerStudent > 2 ? "text-blue-500" : "text-yellow-500"}`} />,
        priority: materialsPerStudent < 1 ? "high" : materialsPerStudent < 2 ? "medium" : "low"
      });

      setTeacherInsights(insights);
    };

    generateInsights();
  }, [assignmentData, performanceData, classroomData, navigate]);

  // Remove individual loading states from metrics array
  const metrics = [
    { 
      title: "Total Classrooms", 
      value: classroomData.totalClassrooms || 0, 
      color: "bg-blue-600"
    },
    { 
      title: "Total Students", 
      value: classroomData.totalStudents || 0, 
      color: "bg-green-600"
    },
    { 
      title: "Learning Materials", 
      value: classroomData.totalMaterials || 0, 
      color: "bg-yellow-400"
    },
    { 
      title: "Total Quizzes", 
      value: classroomData.upcomingQuizzes || 0, 
      color: "bg-red-600"
    }
  ];

  // Update Highcharts configurations
  const barChartOptions = {
    chart: {
      type: 'column',
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      style: {
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      height: '300',
      spacing: [10, 10, 15, 10] // Adjust spacing for mobile
    },
    title: {
      text: 'Recent Quiz Completion Rates',
      align: 'left',
      style: {
        color: darkMode ? '#ffffff' : '#000000'
      }
    },
    xAxis: {
      categories: assignmentData.labels,
      labels: {
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Completion Rate (%)',
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        }
      },
      labels: {
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        }
      },
      min: 0,
      max: 100
    },
    series: [{
      name: 'Completion Rate',
      data: assignmentData.values,
      color: 'rgba(75, 192, 192, 0.6)'
    }],
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>
                Completion Rate: ${this.y.toFixed(1)}%<br/>`;
      }
    },
    plotOptions: {
      column: {
        borderRadius: 5
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            enabled: false
          },
          xAxis: {
            labels: {
              rotation: -45,
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      }]
    }
  };

  const lineChartOptions = {
    chart: {
      type: 'line',
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      height: '300',
      spacing: [10, 10, 15, 10] // Adjust spacing for mobile
    },
    title: {
      text: 'Top 5 Students by Average Score',
      align: 'left',
      style: {
        color: darkMode ? '#ffffff' : '#000000'
      }
    },
    xAxis: {
      categories: performanceData.labels,
      labels: {
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        },
        rotation: -45 // Angle the student names for better readability
      }
    },
    yAxis: {
      title: {
        text: 'Average Score (%)',
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        }
      },
      labels: {
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        }
      },
      min: 0,
      max: 100
    },
    series: [{
      name: 'Average Score',
      data: performanceData.values,
      color: 'rgba(255, 99, 132, 1)'
    }],
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>
                Average Score: ${this.y.toFixed(1)}%<br/>`;
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true
        }
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            enabled: false
          },
          xAxis: {
            labels: {
              rotation: -45,
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      }]
    }
  };

  const topStudents = [
    { name: "Alice", score: 90, rank: 1 },
    { name: "John", score: 85, rank: 2 },
    { name: "Eve", score: 88, rank: 3 },
    { name: "Bob", score: 78, rank: 4 },
  ];

  const filteredStudents = topStudents.filter((student) =>
    student.name.toLowerCase().includes(filter.toLowerCase())
  );

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const viewReports = (studentName) => {
    alert(`Viewing reports for ${studentName}`);
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axiosInstance.get(
          "/user-teacher/current-teacher/"
        );
        if (response.status === 200) {
          const current_teacher = response.data.teacher_profile;
          setTeacherData(current_teacher);
        }
      } catch (error) {
        console.error("An error occurred while fetching the data:", error);
      }
    };

    fetchTeacherData();
  }, []);

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Loading placeholder component
  const NameLoadingPlaceholder = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-64"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>
  );

  // Add this to your CSS or style block
  const shimmerStyle = {
    background: `
      linear-gradient(
        90deg,
        ${darkMode ? '#1f2937' : '#f3f4f6'} 0%,
        ${darkMode ? '#374151' : '#e5e7eb'} 50%,
        ${darkMode ? '#1f2937' : '#f3f4f6'} 100%
      )
    `,
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };

  // Add this to your CSS
  `
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
  `;

  // Single metric placeholder component
  const MetricPlaceholder = () => (
    <div className={`p-6 rounded-xl shadow-lg bg-gray-800 bg-opacity-50`}>
      <div className="flex flex-col space-y-3">
        <div className="animate-pulse h-4 bg-gray-700 rounded w-20"></div>
        <div className="animate-pulse h-8 bg-gray-700 rounded w-16"></div>
        <div className="flex items-center space-x-2">
          <div className="animate-pulse h-3 w-3 bg-gray-700 rounded"></div>
          <div className="animate-pulse h-3 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 min-h-screen">
      {/* Main Grid Container - adjust gap for mobile */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-8">
          {/* Header Section - improve mobile layout */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-lg p-4 sm:p-6 ${
              darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex-1 space-y-2 sm:space-y-4 text-center sm:text-left">
                {teacherData ? (
                  <>
                    <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                      {greeting.split(",")[0]}, Teacher {teacherData.first_name}!
                    </h1>
                    <p className={`text-base sm:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {greeting.split(",").slice(1).join(",").trim()}
                    </p>
                    <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {formattedDate}
                    </p>
                  </>
                ) : (
                  <NameLoadingPlaceholder />
                )}
              </div>
              {/* Adjust illustration size for mobile */}
              <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 p-2 sm:p-4">
                <img
                  src={illustrations}
                  alt="Teacher Illustration"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Metrics Grid - adjust for mobile */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {/* Classrooms Metric */}
            {metricsLoading ? (
              <MetricPlaceholder />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl shadow-lg bg-blue-600 bg-opacity-90 backdrop-blur-lg"
              >
                <div className="flex flex-col space-y-2">
                  <h2 className="text-white text-sm font-medium">Total Classrooms</h2>
                  <p className="text-white text-3xl font-bold">{classroomData.totalClassrooms || 0}</p>
                  <div className="flex items-center text-white text-xs">
                    <IoTrendingUp className="mr-1" />
                    <span>+{classroomData.totalClassrooms || 0}% this period</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Students Metric */}
            {metricsLoading ? (
              <MetricPlaceholder />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl shadow-lg bg-green-600 bg-opacity-90 backdrop-blur-lg"
              >
                <div className="flex flex-col space-y-2">
                  <h2 className="text-white text-sm font-medium">Total Students</h2>
                  <p className="text-white text-3xl font-bold">{classroomData.totalStudents || 0}</p>
                  <div className="flex items-center text-white text-xs">
                    <IoTrendingUp className="mr-1" />
                    <span>+{classroomData.totalStudents || 0}% this period</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Materials Metric */}
            {metricsLoading ? (
              <MetricPlaceholder />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl shadow-lg bg-yellow-400 bg-opacity-90 backdrop-blur-lg"
              >
                <div className="flex flex-col space-y-2">
                  <h2 className="text-white text-sm font-medium">Learning Materials</h2>
                  <p className="text-white text-3xl font-bold">{classroomData.totalMaterials || 0}</p>
                  <div className="flex items-center text-white text-xs">
                    <IoTrendingUp className="mr-1" />
                    <span>+{classroomData.totalMaterials || 0}% this period</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quizzes Metric */}
            {metricsLoading ? (
              <MetricPlaceholder />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl shadow-lg bg-red-600 bg-opacity-90 backdrop-blur-lg"
              >
                <div className="flex flex-col space-y-2">
                  <h2 className="text-white text-sm font-medium">Total Quizzes</h2>
                  <p className="text-white text-3xl font-bold">{classroomData.upcomingQuizzes || 0}</p>
                  <div className="flex items-center text-white text-xs">
                    <IoTrendingUp className="mr-1" />
                    <span>+{classroomData.upcomingQuizzes || 0}% this period</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Charts Section - stack on mobile */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {/* Adjust chart containers for mobile */}
            <div className={`rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col ${
              darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
            }`}>
              <div className="flex-1 min-h-0">
                {chartsLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <DotLoaderSpinner color="#4ade80" />
                  </div>
                ) : (
                  <HighchartsReact 
                    highcharts={Highcharts} 
                    options={barChartOptions}
                    containerProps={{ className: 'h-full' }}
                  />
                )}
              </div>
            </div>
            
            {/* Performance Trends Chart */}
            <div className={`rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col ${
              darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
            }`}>
              <div className="flex-1 min-h-0">
                {chartsLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <DotLoaderSpinner color="#4ade80" />
                  </div>
                ) : (
                  <HighchartsReact 
                    highcharts={Highcharts} 
                    options={lineChartOptions}
                    containerProps={{ className: 'h-full' }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Top Students Section - adjust padding and spacing */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-lg p-4 sm:p-6 ${
              darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold">Top Performing Students</h2>
              <input
                type="text"
                placeholder="Search students..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-4">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 ? "bg-yellow-400" :
                      index === 1 ? "bg-gray-300" :
                      index === 2 ? "bg-orange-400" :
                      "bg-blue-400"
                    } text-white font-bold`}>
                      {student.rank}
                    </div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-500">Score: {student.score}%</p>
                    </div>
                  </div>
                  <button
                    onClick={() => viewReports(student.name)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    View Report
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar - full width on mobile */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-1 space-y-4 sm:space-y-6"
        >
          {/* Calendar Card */}
          <div className={`rounded-xl shadow-lg p-4 sm:p-6 ${
            darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
          }`}>
            <h2 className="text-xl font-semibold mb-4">Calendar</h2>
            <Calendar
              onChange={setDate}
              value={date}
              className={`w-full rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
            />
          </div>

          {/* Teaching Insights Card */}
          <div className={`rounded-xl shadow-lg p-4 sm:p-6 ${
            darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
          }`}>
            <h2 className="text-xl font-semibold mb-4">Teaching Insights</h2>
            <div className="space-y-4">
              {teacherInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } cursor-pointer`}
                  onClick={insight.action}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{insight.icon}</span>
                        <h3 className="font-semibold">{insight.title}</h3>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{insight.metric}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            insight.priority === 'high' ? 'bg-red-100 text-red-600' :
                            insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {insight.priority} priority
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;