import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
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
import QuestionTypeChart from "../../components/teacher/charts/QuestonTypeChart";
import QuizStatisticsChart from "../../components/teacher/charts/QuizStatisticsChart";

import { motion } from "framer-motion";
import { IoStatsChart, IoTrendingUp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";
import QuizTimeAnalytics from "../../components/teacher/charts/QuizTimeChart";
import KnowledgeGapHeatmap from "../../components/teacher/charts/KnowledgeGapHeatmap";
import StudentProgressChart from "../../components/teacher/charts/StudentProgressChart";

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
    upcomingQuizzes: 0,
  });
  const [assignmentData, setAssignmentData] = useState({
    labels: [],
    values: [],
  });
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    values: [],
  });
  const [chartsLoading, setChartsLoading] = useState(false);
  const navigate = useNavigate();
  const [teacherInsights, setTeacherInsights] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [showCompletionRec, setShowCompletionRec] = useState(false);
  const [showPerformanceRec, setShowPerformanceRec] = useState(false);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [improvementSuggestions, setImprovementSuggestions] = useState({});

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

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
        const classroomsResponse = await axiosInstance.get(
          "/user-teacher/classroom/list/"
        );
        const classrooms = classroomsResponse.data.classroom_list;

        // Initialize counters
        let totalStudents = 0;
        let totalMaterials = 0;
        let totalQuizzes = 0;

        // Fetch student count, materials, and quizzes for each classroom
        for (const classroom of classrooms) {
          // Get students
          const studentsResponse = await axiosInstance.get(
            "/user-teacher/classroom/list-student/",
            {
              params: { classroom_id: classroom.id },
            }
          );
          const classroomStudents =
            studentsResponse.data.classroom_student_list.length;
          totalStudents += classroomStudents;
          // console.log(
          //   `Classroom ${classroom.id} - Students:`,
          //   classroomStudents
          // );

          // Get materials
          const materialsResponse = await axiosInstance.get(
            "/user-teacher/materials/list/",
            {
              params: { classroom: classroom.id },
            }
          );
          const classroomMaterials =
            materialsResponse.data.materials_list.length;
          totalMaterials += classroomMaterials;
          // console.log(
          //   `Classroom ${classroom.id} - Materials:`,
          //   classroomMaterials
          // );

          // Get quizzes
          const quizzesResponse = await axiosInstance.get(
            `/user-teacher/quiz/list/?classroom_id=${classroom.id}`
          );
          totalQuizzes += quizzesResponse.data.quizzes.length;
        }

        setClassroomData({
          totalClassrooms: classrooms.length,
          totalStudents: totalStudents,
          totalMaterials: totalMaterials,
          upcomingQuizzes: totalQuizzes,
        });

        // console.log(
        //   "Final counts - Total Students:",
        //   totalStudents,
        //   "Total Materials:",
        //   totalMaterials
        // );
      } catch (error) {
        console.error("Error fetching classroom metrics:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
        });
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchClassroomMetrics();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      setChartsLoading(true);
      try {
        // Fetch all classrooms first
        const classroomsResponse = await axiosInstance.get(
          "/user-teacher/classroom/list/"
        );
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
              "/user-teacher/quiz-scores/list/",
              {
                params: {
                  classroom: classroom.id,
                  quiz: quiz.id,
                },
              }
            );

            const scores = scoresResponse.data.quiz_scores;

            // Track individual student performance
            scores.forEach((score) => {
              if (!studentScores[score.student_name]) {
                studentScores[score.student_name] = {
                  totalScore: 0,
                  quizCount: 0,
                  scores: [],
                };
              }
              if (score.total_score !== null) {
                studentScores[score.student_name].totalScore +=
                  score.total_score;
                studentScores[score.student_name].quizCount += 1;
                studentScores[score.student_name].scores.push(
                  score.total_score
                );
              }
            });

            // Calculate quiz completion data
            const totalStudents = scores.length;
            const submittedCount = scores.filter(
              (score) => score.total_score !== null
            ).length;
            const totalScore = scores.reduce(
              (sum, score) => sum + (score.total_score || 0),
              0
            );
            const averageScore =
              submittedCount > 0 ? totalScore / submittedCount : 0;

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
            labels: ["No Data Available"],
            values: [0],
          });
          setPerformanceData({
            labels: ["No Data Available"],
            values: [0],
          });
          return;
        }

        // Sort by date and take last 5 quizzes for completion rates
        allQuizScores.sort(
          (a, b) => new Date(a.date_created) - new Date(b.date_created)
        );
        const recentQuizzes = allQuizScores.slice(-5);

        // Process data for bar chart (completion rates)
        setAssignmentData({
          labels: recentQuizzes.map(
            (item) => item.quiz_title || `Quiz ${item.quiz_id}`
          ),
          values: recentQuizzes.map((item) => {
            const completionRate =
              (item.submitted_count / item.total_students) * 100;
            return Math.round(completionRate);
          }),
        });

        // Process top 5 students by average score for line chart
        console.log(studentScores); // Log the data for debugging

        const studentAverages = Object.entries(studentScores)
          .map(([name, data]) => {
            // Check if scores are present and non-empty
            if (!data.scores || data.scores.length === 0) {
              console.error(`No scores available for student: ${name}`);
              return {
                name,
                averageScore: 0, // Default score for students with missing scores
              };
            }

            // Calculate the total number of correct answers
            const totalCorrect = data.scores.reduce(
              (sum, score) => sum + score,
              0
            );

            // Calculate the total number of questions across all quizzes
            const totalQuestions = data.quizCount * 5; // Assuming 10 questions per quiz

            // Calculate the average percentage score
            const averagePercentage = (totalCorrect / totalQuestions) * 100;

            return {
              name,
              averageScore: averagePercentage, // Use percentage for average score
            };
          })
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 5);

        // Set performance data for top students
        setPerformanceData({
          labels: studentAverages.map((student) => student.name),
          values: studentAverages.map(
            (student) => Math.round(student.averageScore) // Round the percentage score to nearest integer
          ),
        });

        // Add this function to analyze student performance and generate warnings/suggestions
        analyzeStudentPerformance(studentScores);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setAssignmentData({
          labels: ["Error Loading Data"],
          values: [0],
        });
        setPerformanceData({
          labels: ["Error Loading Data"],
          values: [0],
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
        const averageCompletion =
          assignmentData.values.reduce((a, b) => a + b, 0) /
          assignmentData.values.length;
        insights.push({
          title: "Student Engagement",
          metric: `${Math.round(averageCompletion)}%`,
          trend:
            averageCompletion > 75
              ? "up"
              : averageCompletion > 50
              ? "warning"
              : "down",
          recommendation:
            averageCompletion < 75
              ? "Consider interactive activities to boost quiz/activity completion rates"
              : "Maintain current engagement strategies",

          icon: (
            <IoTrendingUp
              className={`${
                averageCompletion > 75 ? "text-green-500" : "text-yellow-500"
              }`}
            />
          ),
          priority:
            averageCompletion < 50
              ? "high"
              : averageCompletion < 75
              ? "medium"
              : "low",
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
      const materialsPerStudent =
        classroomData.totalStudents > 0
          ? classroomData.totalMaterials / classroomData.totalStudents
          : 0;
      insights.push({
        title: "Class Progress",
        metric: metricsLoading ? (
          <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
        ) : (
          `${Math.round(materialsPerStudent * 100) / 100} materials/student`
        ),
        trend: metricsLoading ? (
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
        ) : materialsPerStudent > 0.05 ? (
          "up"
        ) : (
          "warning"
        ),
        recommendation: metricsLoading ? (
          <div className="animate-pulse h-4 w-48 bg-gray-200 rounded"></div>
        ) : materialsPerStudent < 2 ? (
          "Consider adding more learning materials"
        ) : (
          "Good material distribution"
        ),
        icon: (
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
            <IoStatsChart
              className={`w-6 h-6 sm:w-8 sm:h-8 ${
                metricsLoading
                  ? "text-gray-200"
                  : materialsPerStudent > 2
                  ? "text-blue-500"
                  : "text-yellow-500"
              }`}
            />
          </div>
        ),
        priority: metricsLoading
          ? ""
          : materialsPerStudent < 0.02
          ? "high"
          : materialsPerStudent < 0.05
          ? "medium"
          : "low",
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
      color: "bg-blue-600",
    },
    {
      title: "Total Students",
      value: classroomData.totalStudents || 0,
      color: "bg-green-600",
    },
    {
      title: "Learning Materials",
      value: classroomData.totalMaterials || 0,
      color: "bg-yellow-400",
    },
    {
      title: "Total Quizzes",
      value: classroomData.upcomingQuizzes || 0,
      color: "bg-red-600",
    },
  ];

  // Update the recommendation functions
  const getCompletionRateRecommendation = (values) => {
    if (!values || values.length === 0)
      return {
        title: "No Data Available",
        points: [
          "Start creating quizzes/activities to see completion insights",
        ],
        priority: "medium",
      };

    const averageCompletion = values.reduce((a, b) => a + b, 0) / values.length;
    const lowestCompletion = Math.min(...values);

    if (averageCompletion < 50) {
      return {
        title: "Low Completion Rate",
        points: [
          "Send automated reminders before quiz/activity deadlines",
          `Focus on ${lowestCompletion}% completion areas first`,
          "Consider extending deadlines for complex topics",
          "Implement mobile-friendly quiz/activity formats",
        ],
        priority: "high",
      };
    } else if (averageCompletion < 75) {
      return {
        title: "Moderate Completion Rate",
        points: [
          `Improve from current ${Math.round(averageCompletion)}% average`,
          "Create bite-sized practice quizzes/activities",
          "Enable partial submissions to track progress",
          "Use class announcements to boost participation",
        ],
        priority: "medium",
      };
    } else {
      return {
        title: "Strong Completion Rate",
        points: [
          `Maintain excellent ${Math.round(averageCompletion)}% rate`,
          "Introduce bonus challenges for early completion",
          "Share completion statistics with the class",
          "Consider peer review opportunities",
        ],
        priority: "low",
      };
    }
  };

  const getPerformanceRecommendation = (values) => {
    if (!values || values.length === 0)
      return {
        title: "No Data Available",
        points: ["Start adding student scores to see performance insights"],
        priority: "medium",
      };

    const averageScore = values.reduce((a, b) => a + b, 0) / values.length;
    const lowestScore = Math.min(...values);
    const highestScore = Math.max(...values);
    const scoreSpread = highestScore - lowestScore;

    if (averageScore < 70) {
      return {
        title: "Performance Needs Attention",
        points: [
          `Current average: ${Math.round(averageScore)}%`,
          "Schedule targeted review sessions",
          "Create concept-specific practice materials",
          "Consider prerequisite topic review",
        ],
        priority: "high",
      };
    } else if (scoreSpread > 20) {
      return {
        title: "Wide Performance Gap",
        points: [
          `Score range: ${Math.round(lowestScore)}% - ${Math.round(
            highestScore
          )}%`,
          "Implement differentiated learning paths",
          "Create peer study groups",
          "Provide additional support materials",
        ],
        priority: "medium",
      };
    } else {
      return {
        title: "Consistent Performance",
        points: [
          `Strong average: ${Math.round(averageScore)}%`,
          "Introduce advanced topics",
          "Consider group projects",
          "Share success strategies",
        ],
        priority: "low",
      };
    }
  };

  // Update chart options to better display multi-line recommendations
  const barChartOptions = {
    chart: {
      type: "column",
      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
      style: {
        fontFamily: "Inter, system-ui, sans-serif",
      },
      height: "300",
      spacing: [10, 10, 15, 10], // Adjust spacing for mobile
    },
    title: {
      text: "Recent Quiz/Activity Completion Rates",
      align: "left",
      style: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    xAxis: {
      categories: assignmentData.labels,
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    yAxis: {
      title: {
        text: "Completion Rate (%)",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      min: 0,
      max: 100,
    },
    series: [
      {
        name: "Completion Rate",
        data: assignmentData.values,
        color: "rgba(75, 192, 192, 0.6)",
      },
    ],
    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br/>
                Completion Rate: ${this.y.toFixed(1)}%<br/>`;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 5,
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
            xAxis: {
              labels: {
                rotation: -45,
                style: {
                  fontSize: "10px",
                },
              },
            },
          },
        },
      ],
    },
  };

  const lineChartOptions = {
    chart: {
      type: "line",
      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
      height: "300",
      spacing: [10, 10, 15, 10], // Adjust spacing for mobile
    },
    title: {
      text: "Top 5 Students by Average Score",
      align: "left",
      style: {
        color: darkMode ? "#ffffff" : "#000000",
      },
    },
    xAxis: {
      categories: performanceData.labels,
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
        rotation: -45, // Angle the student names for better readability
      },
    },
    yAxis: {
      title: {
        text: "Average Score (%)",
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      labels: {
        style: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      min: 0,
      max: 100,
    },
    series: [
      {
        name: "Average Score",
        data: performanceData.values,
        color: "rgba(255, 99, 132, 1)",
      },
    ],
    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br/>
                Average Score: ${this.y.toFixed(1)}%<br/>`;
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
            xAxis: {
              labels: {
                rotation: -45,
                style: {
                  fontSize: "10px",
                },
              },
            },
          },
        },
      ],
    },
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        ${darkMode ? "#1f2937" : "#f3f4f6"} 0%,
        ${darkMode ? "#374151" : "#e5e7eb"} 50%,
        ${darkMode ? "#1f2937" : "#f3f4f6"} 100%
      )
    `,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
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

  // Add click handler for recommendation button
  const toggleRecommendation = (type) => {
    if (type === "completion") {
      setShowCompletionRec(!showCompletionRec);
      setShowPerformanceRec(false); // Close other recommendation
    } else {
      setShowPerformanceRec(!showPerformanceRec);
      setShowCompletionRec(false); // Close other recommendation
    }
  };

  // // Add this function to analyze student performance and generate warnings/suggestions
  // const analyzeStudentPerformance = (studentScores) => {
  //   const AT_RISK_THRESHOLD = 60; // Students below 60% are considered at risk
  //   const IMPROVEMENT_THRESHOLD = 75; // Students below 75% need improvement

  //   const atRiskList = [];
  //   const suggestions = {};

  //   Object.entries(studentScores).forEach(([studentName, data]) => {
  //     const averageScore =
  //       data.quizCount > 0 ? data.totalScore / data.quizCount : 0;

  //     const recentScores = data.scores.slice(-3); // Last 3 scores
  //     const recentAverage =
  //       recentScores.length > 0
  //         ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
  //         : 0;

  //     const scoreTrend =
  //       recentScores.length >= 2
  //         ? recentScores[recentScores.length - 1] -
  //           recentScores[recentScores.length - 2]
  //         : 0;

  //     // Generate suggestions based on performance patterns
  //     if (averageScore < AT_RISK_THRESHOLD) {
  //       atRiskList.push({
  //         name: studentName,
  //         average: averageScore,
  //         trend: scoreTrend,
  //         lastScore: recentScores[recentScores.length - 1] || 0,
  //         riskLevel: "high",
  //         warning: `Immediate attention needed - Consistently performing below ${AT_RISK_THRESHOLD}%`,
  //       });
  //     }

  //     if (averageScore < IMPROVEMENT_THRESHOLD) {
  //       suggestions[studentName] = {
  //         currentAverage: averageScore,
  //         trend: scoreTrend,
  //         suggestions: [
  //           {
  //             area: "Performance",
  //             details: `Current average: ${Math.round(averageScore)}%`,
  //             actions: [
  //               scoreTrend < 0
  //                 ? "Schedule immediate review session"
  //                 : "Continue with regular check-ins",
  //               "Create personalized study plan",
  //               "Set up weekly progress tracking",
  //             ],
  //           },
  //           {
  //             area: "Study Habits",
  //             details: `Recent trend: ${
  //               scoreTrend > 0 ? "Improving" : "Declining"
  //             }`,
  //             actions: [
  //               "Implement structured study schedule",
  //               "Use active recall techniques",
  //               "Join study groups for peer support",
  //             ],
  //           },
  //           {
  //             area: "Support Needed",
  //             details: "Additional resources recommended",
  //             actions: [
  //               "Provide supplementary learning materials",
  //               "Consider one-on-one tutoring",
  //               "Regular progress check-ins",
  //             ],
  //           },
  //         ],
  //       };
  //     }
  //   });

  //   setAtRiskStudents(atRiskList);
  //   setImprovementSuggestions(suggestions);
  // };

  // const fetchAndAnalyzeStudentScores = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/scores/");
  //     analyzeStudentPerformance(response.data);
  //   } catch (error) {
  //     console.error("Error fetching student scores:", error);
  //   }
  // };

  // // Call this function when component mounts
  // useEffect(() => {
  //   fetchAndAnalyzeStudentScores();
  // }, []);

  // Enhanced Student Performance Analysis Function
  const analyzeStudentPerformance = (studentScores) => {
    // Base thresholds and minimum quiz requirements
    const BASE_AT_RISK_THRESHOLD = 0.6;
    const BASE_IMPROVEMENT_THRESHOLD = 0.75;
    const MIN_QUIZZES_FOR_BASIC = 3;
    const MIN_QUIZZES_FOR_FULL = 5;

    const atRiskList = [];
    const suggestions = {};

    Object.entries(studentScores).forEach(([studentName, data]) => {
      // Skip analysis if minimum quiz requirement not met
      if (data.quizCount < MIN_QUIZZES_FOR_BASIC) {
        return;
      }

      // Normalize scores to be between 0 and 1
      const normalizeScore = (score) => score / 5;
      const normalizedTotalScore = normalizeScore(data.totalScore);
      const normalizedScores = data.scores.map(normalizeScore);

      // const normalizedTotalScore = data.totalScore;
      // const normalizedScores = data.scores;

      // Calculate weighted average (recent scores have more weight)
      const weights = normalizedScores.map((_, index) =>
        Math.pow(1.2, normalizedScores.length - 1 - index)
      );
      const weightedSum = normalizedScores.reduce(
        (sum, score, index) => sum + score * weights[index],
        0
      );
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      const weightedAverage = weightedSum / totalWeight;

      // Adjust thresholds based on number of quizzes taken
      const quizCountFactor = Math.min(
        data.quizCount / MIN_QUIZZES_FOR_FULL,
        1
      );
      const atRiskThreshold =
        BASE_AT_RISK_THRESHOLD * (0.9 + 0.1 * quizCountFactor);
      const improvementThreshold =
        BASE_IMPROVEMENT_THRESHOLD * (0.9 + 0.1 * quizCountFactor);

      // Get recent scores for trend analysis
      const recentScores = normalizedScores.slice(-Math.min(5, data.quizCount));
      const recentAverage =
        recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

      // Calculate trend using last 3 scores or all if less than 3
      const lastThreeScores = recentScores.slice(-3);
      const scoreTrend =
        lastThreeScores.length >= 2
          ? lastThreeScores[lastThreeScores.length - 1] -
            lastThreeScores[lastThreeScores.length - 2]
          : 0;

      // Calculate performance stability
      const scoreVariance =
        recentScores.reduce(
          (variance, score) => variance + Math.pow(score - recentAverage, 2),
          0
        ) / recentScores.length;
      const scoreStability = Math.sqrt(scoreVariance);

      // Determine analysis level based on quiz count
      const analysisLevel =
        data.quizCount >= MIN_QUIZZES_FOR_FULL ? "full" : "basic";

      // Check if student is at risk
      if (weightedAverage < atRiskThreshold) {
        atRiskList.push({
          name: studentName,
          average: Math.round(weightedAverage * 100),
          trend: Math.round(scoreTrend * 100),
          lastScore: Math.round(recentScores[recentScores.length - 1] * 100),
          stability: Math.round((1 - scoreStability) * 100),
          riskLevel: "high",
          analysisLevel,
          quizzesTaken: data.quizCount,
          warning: `${
            analysisLevel === "basic" ? "Early Warning: " : ""
          }Immediate attention needed - ${
            analysisLevel === "full"
              ? `Consistently performing below ${Math.round(
                  atRiskThreshold * 100
                )}%`
              : `Based on initial ${data.quizCount} quizzes/activities`
          }`,
        });
      }

      // Generate improvement suggestions if needed
      if (weightedAverage < improvementThreshold) {
        const suggestionsList = [
          {
            area: "Performance",
            details: `Weighted average: ${Math.round(
              weightedAverage * 100
            )}% | Stability: ${Math.round((1 - scoreStability) * 100)}%`,
            actions: [
              scoreTrend < 0
                ? "Schedule immediate review session"
                : "Continue with regular check-ins",
              scoreStability > 0.2
                ? "Focus on consistent study habits"
                : "Maintain current study routine",
              data.quizCount < MIN_QUIZZES_FOR_FULL
                ? `Complete ${
                    MIN_QUIZZES_FOR_FULL - data.quizCount
                  } more quizzes/activities for full analysis`
                : "Review comprehensive performance data",
            ],
          },
          {
            area: "Study Habits",
            details: `Recent trend: ${
              scoreTrend > 0 ? "Improving" : "Declining"
            } | Recent average: ${Math.round(recentAverage * 100)}%`,
            actions: [
              "Implement structured study schedule",
              scoreStability > 0.15
                ? "Focus on consistency in study routine"
                : "Maintain current study pattern",
              data.quizCount >= MIN_QUIZZES_FOR_FULL
                ? "Join study groups for peer support"
                : "Build foundational study habits",
            ],
          },
        ];

        // Add detailed support suggestions for full analysis
        if (analysisLevel === "full") {
          suggestionsList.push({
            area: "Support Needed",
            details: "Comprehensive support recommendations",
            actions: [
              "Provide supplementary learning materials",
              "Consider one-on-one tutoring",
              "Regular progress check-ins",
            ],
          });
        }

        suggestions[studentName] = {
          currentAverage: Math.round(weightedAverage * 100),
          trend: Math.round(scoreTrend * 100),
          stability: Math.round((1 - scoreStability) * 100),
          analysisLevel,
          quizzesTaken: data.quizCount,
          suggestions: suggestionsList,
        };
      }
    });

    setAtRiskStudents(atRiskList);
    setImprovementSuggestions(suggestions);
  };

  // Updated AtRiskWarnings Component
  const AtRiskWarnings = () => (
    <motion.div
      variants={itemVariants}
      className={`rounded-xl shadow-lg p-4 sm:p-6 ${
        darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="text-red-500 mr-2">⚠️</span>
        Early Warning Alerts
      </h2>
      <div className="space-y-4">
        {atRiskStudents.length > 0 ? (
          atRiskStudents.map((student, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800`}
            >
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-red-700 dark:text-red-400">
                      {student.name}
                    </h3>
                    <span className="text-sm text-blue-600 dark:text-blue-400 ml-2">
                      {student.analysisLevel === "full"
                        ? "Full Analysis"
                        : "Basic Analysis"}{" "}
                      ({student.quizzesTaken} quizzes/activities)
                    </span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {student.warning}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-sm flex-wrap">
                    <span className="font-medium">
                      Average: {student.average}%
                    </span>
                    <span>Last Score: {student.lastScore}%</span>
                    <span
                      className={
                        student.trend >= 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {student.trend > 0 ? "↑" : "↓"} {Math.abs(student.trend)}%
                    </span>
                    <span className="text-purple-600 dark:text-purple-400">
                      Stability: {student.stability}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No students currently at risk
          </p>
        )}
      </div>
    </motion.div>
  );

  const ImprovementSuggestions = () => (
    <motion.div
      variants={itemVariants}
      className={`rounded-xl shadow-lg p-4 sm:p-6 ${
        darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="text-yellow-500 mr-2">💡</span>
        Improvement Suggestions
      </h2>
      <div className="space-y-4">
        {Object.entries(improvementSuggestions).map(
          ([studentName, data], index) => (
            <motion.div
              key={studentName}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg border border-gray-200 bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-full">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-yellow-500">
                      {studentName}
                    </h3>
                    <span className="text-sm text-gray-700">
                      Average: {Math.round(data.currentAverage)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    {data.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="text-sm">
                        <h4 className="font-medium text-yellow-500">
                          {suggestion.area}
                        </h4>
                        <p className="text-gray-700 mb-1">
                          {suggestion.details}
                        </p>
                        <ul className="list-disc list-inside text-gray-700 pl-2">
                          {suggestion.actions.map((action, actionIdx) => (
                            <li key={actionIdx} className="text-sm">
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );

  return (
    <div className=" min-h-screen">
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
                      {greeting.split(",")[0]}, Teacher {teacherData.first_name}
                      !
                    </h1>
                    <p
                      className={`text-base sm:text-lg ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {greeting.split(",").slice(1).join(",").trim()}
                    </p>
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {formattedDate}
                    </p>
                  </>
                ) : (
                  <NameLoadingPlaceholder />
                )}
              </div>
              {/* Adjust illustration size for mobile */}
              <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 p-2 sm:p-4">
                {/* <img
                  src={illustrations}
                  alt="Teacher Illustration"
                  className="w-full h-full object-contain rounded-lg"
                /> */}
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
                  <h2 className="text-white text-sm font-medium">
                    Total Classrooms
                  </h2>
                  <p className="text-white text-3xl font-bold">
                    {classroomData.totalClassrooms || 0}
                  </p>
                  <div className="flex items-center text-white text-xs">
                    <IoTrendingUp className="mr-1" />
                    <span>
                      +{classroomData.totalClassrooms || 0}% this period
                    </span>
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
                  <h2 className="text-white text-sm font-medium">
                    Total Students
                  </h2>
                  <p className="text-white text-3xl font-bold">
                    {classroomData.totalStudents || 0}
                  </p>
                  <div className="flex items-center text-white text-xs">
                    <IoTrendingUp className="mr-1" />
                    <span>
                      +{classroomData.totalStudents || 0}% this period
                    </span>
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
                  <h2 className="text-white text-sm font-medium">
                    Learning Materials
                  </h2>
                  <p className="text-white text-3xl font-bold">
                    {classroomData.totalMaterials || 0}
                  </p>
                  <div className="flex items-center text-white text-xs">
                    <IoTrendingUp className="mr-1" />
                    <span>
                      +{classroomData.totalMaterials || 0}% this period
                    </span>
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
                  <h2 className="text-white text-sm font-medium">
                    Total Quiz/Activity
                  </h2>
                  <p className="text-white text-3xl font-bold">
                    {classroomData.upcomingQuizzes || 0}
                  </p>
                  <div className="flex items-center text-white text-xs">
                    <IoTrendingUp className="mr-1" />
                    <span>
                      +{classroomData.upcomingQuizzes || 0}% this period
                    </span>
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
            {/* Completion Rates Chart */}
            <div
              className={`rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col relative ${
                darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                {/* <h3 className="text-lg font-semibold">
                  Recent Quiz Completion Rates
                </h3> */}
                <button
                  onClick={() => toggleRecommendation("completion")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    showCompletionRec
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {showCompletionRec ? "Hide Insights" : "View Insights"}
                </button>
              </div>

              <div className="flex-1 min-h-0">
                {chartsLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <DotLoaderSpinner color="#4ade80" />
                  </div>
                ) : (
                  <div className="relative">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={barChartOptions}
                      containerProps={{ className: "h-full" }}
                    />

                    {/* Recommendation Panel - Slides in from right */}
                    <motion.div
                      initial={{ x: "100%", opacity: 0 }}
                      animate={{
                        x: showCompletionRec ? 0 : "100%",
                        opacity: showCompletionRec ? 1 : 0,
                      }}
                      transition={{ type: "spring", damping: 20 }}
                      className={`absolute top-0 right-0 w-full sm:w-80 h-full p-4 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-500 overflow-y-auto`}
                    >
                      {(() => {
                        const rec = getCompletionRateRecommendation(
                          assignmentData.values
                        );
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">
                                {rec.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  rec.priority === "high"
                                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                    : rec.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                }`}
                              >
                                {rec.priority} priority
                              </span>
                            </div>
                            <ul className="space-y-3">
                              {rec.points.map((point, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ x: 50, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span className="text-sm">{point}</span>
                                </motion.li>
                              ))}
                            </ul>
                            <button
                              onClick={() => setShowCompletionRec(false)}
                              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })()}
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Trends Chart */}
            <div
              className={`rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col relative ${
                darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                {/* <h3 className="text-lg font-semibold">
                  Top 5 Students by Average Score
                </h3> */}
                <button
                  onClick={() => toggleRecommendation("performance")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    showPerformanceRec
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {showPerformanceRec ? "Hide Insights" : "View Insights"}
                </button>
              </div>

              <div className="flex-1 min-h-0">
                {chartsLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <DotLoaderSpinner color="#4ade80" />
                  </div>
                ) : (
                  <div className="relative">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={lineChartOptions}
                      containerProps={{ className: "h-full" }}
                    />

                    {/* Performance Recommendation Panel */}
                    <motion.div
                      initial={{ x: "100%", opacity: 0 }}
                      animate={{
                        x: showPerformanceRec ? 0 : "100%",
                        opacity: showPerformanceRec ? 1 : 0,
                      }}
                      transition={{ type: "spring", damping: 20 }}
                      className={`absolute top-0 right-0 w-full sm:w-80 h-full p-4 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-500 overflow-y-auto`}
                    >
                      {(() => {
                        const rec = getPerformanceRecommendation(
                          performanceData.values
                        );
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">
                                {rec.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  rec.priority === "high"
                                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                    : rec.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                }`}
                              >
                                {rec.priority} priority
                              </span>
                            </div>
                            <ul className="space-y-3">
                              {rec.points.map((point, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ x: 50, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span className="text-sm">{point}</span>
                                </motion.li>
                              ))}
                            </ul>
                            <button
                              onClick={() => setShowPerformanceRec(false)}
                              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })()}
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="w-full transition-all duration-300 hover:scale-[1.02]">
                <div className="shadow-lg hover:shadow-xl rounded-lg p-6 bg-white">
                  <QuestionTypeChart />
                </div>
              </div>
              <div className="w-full transition-all duration-300 hover:scale-[1.02]">
                <div className="shadow-lg hover:shadow-xl rounded-lg p-6 bg-white">
                  <StudentProgressChart />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4">
            <div className="w-full transition-all duration-300 hover:scale-[1.02]">
              <div className="shadow-lg hover:shadow-xl rounded-lg p-6 bg-white">
                <KnowledgeGapHeatmap quizId={77} />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4">
            <div className="w-full transition-all duration-300 hover:scale-[1.02]">
              <div className="shadow-lg hover:shadow-xl rounded-lg p-6 bg-white">
                <QuizTimeAnalytics isTestMode={false} />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4">
            <div className="w-full transition-all duration-300 hover:scale-[1.02]">
              <div className="shadow-lg hover:shadow-xl rounded-lg p-6 bg-white">
                <QuizStatisticsChart />
              </div>
            </div>
          </motion.div>

          {/* Add the new components */}
          <AtRiskWarnings />
          <ImprovementSuggestions />
        </div>

        {/* Sidebar - full width on mobile */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 space-y-4 sm:space-y-6"
        >
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

          {/* Teaching Insights Card */}
          <div
            className={`rounded-xl shadow-lg p-3 sm:p-6 ${
              darkMode ? "bg-gray-800 bg-opacity-50" : "bg-white"
            }`}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Teaching Insights
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {teacherInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 sm:p-4 rounded-lg border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } cursor-pointer transition-all duration-200`}
                  onClick={insight.action}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg sm:text-xl flex-shrink-0">
                          {insight.icon}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold truncate">
                          {insight.title}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base sm:text-lg font-bold">
                            {insight.metric}
                          </span>
                          <span
                            className={`text-xs sm:text-sm px-2 py-0.5 sm:py-1 rounded-full ${
                              insight.priority === "high"
                                ? "bg-red-100 text-red-600"
                                : insight.priority === "medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {insight.priority} priority
                          </span>
                        </div>
                        <p
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
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
