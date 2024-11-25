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
import {
  FaBook,
  FaUserGraduate,
  FaClipboardCheck,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

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
          "Let’s make today a stepping stone to greatness. Happy Tuesday!",
        ],
        3: [
          "It’s midweek Wednesday! Push through, success is near!",
          "Keep going, the weekend is getting closer!",
          "Happy Wednesday! You're halfway there to a fantastic week!",
        ],
        4: [
          "Thursday’s here, the weekend is just around the corner!",
          "Almost there! Finish strong, it’s Thursday!",
          "Stay focused, Friday is almost here! Happy Thursday!",
        ],
        5: [
          "It’s Friday! Finish strong and enjoy the weekend ahead!",
          "The weekend is so close, let’s wrap up the week with success!",
          "Happy Friday! A great week deserves a relaxing weekend!",
        ],
        6: [
          "Happy Saturday! Time to relax, reflect, and recharge!",
          "Enjoy your Saturday to the fullest, you’ve earned it!",
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
      try {
        // Fetch classrooms
        const classroomsResponse = await axiosInstance.get('/user-teacher/classroom/list/');
        const classrooms = classroomsResponse.data.classroom_list;
        
        // Fetch materials
        const materialsResponse = await axiosInstance.get('/user-teacher/materials/list/');
        const materials = materialsResponse.data.materials_list;

        // Calculate metrics
        const totalStudents = classrooms.reduce((acc, classroom) => 
          acc + (classroom.student_count || 0), 0);

        setClassroomData({
          totalClassrooms: classrooms.length,
          totalStudents: totalStudents,
          totalMaterials: materials.length,
          upcomingQuizzes: 0 // You can add quiz counting logic here
        });
      } catch (error) {
        console.error("Error fetching classroom metrics:", error);
      }
    };

    fetchClassroomMetrics();
  }, []);

  // Add new useEffect to fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch assignments data
        const assignmentsResponse = await axiosInstance.get('/user-teacher/assignments/analytics/');
        const assignmentsData = assignmentsResponse.data;

        // Fetch performance data
        const performanceResponse = await axiosInstance.get('/user-teacher/performance/analytics/');
        const performanceData = performanceResponse.data;

        // Process assignments data
        setAssignmentData({
          labels: assignmentsData.map(item => item.week),
          values: assignmentsData.map(item => item.completed_count)
        });

        // Process performance data
        setPerformanceData({
          labels: performanceData.map(item => item.week),
          values: performanceData.map(item => item.average_score)
        });

      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
    // Set up periodic refresh (every 5 minutes)
    const intervalId = setInterval(fetchChartData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  // Update metrics array to use real data
  const metrics = [
    { 
      title: "Total Classrooms", 
      value: classroomData.totalClassrooms, 
      color: "bg-blue-600" 
    },
    { 
      title: "Total Students", 
      value: classroomData.totalStudents, 
      color: "bg-green-600" 
    },
    { 
      title: "Learning Materials", 
      value: classroomData.totalMaterials, 
      color: "bg-yellow-400" 
    },
    { 
      title: "Upcoming Quizzes", 
      value: classroomData.upcomingQuizzes, 
      color: "bg-red-600" 
    }
  ];

  const quickLinks = [
    {
      title: "Create Lesson",
      icon: <FaBook />,
      action: () => alert("Navigating to Lesson Creation"),
    },
    {
      title: "Manage Students",
      icon: <FaUserGraduate />,
      action: () => alert("Navigating to Student Management"),
    },
    {
      title: "Grading",
      icon: <FaClipboardCheck />,
      action: () => alert("Navigating to Grading"),
    },
    {
      title: "Teacher Resources",
      icon: <FaChalkboardTeacher />,
      action: () => alert("Navigating to Teacher Resources"),
    },
    {
      title: "Class Schedule",
      icon: <FaCalendarAlt />,
      action: () => alert("Navigating to Class Schedule"),
    },
    {
      title: "Progress Reports",
      icon: <FaChartLine />,
      action: () => alert("Navigating to Progress Reports"),
    },
  ];

  // Update Highcharts configurations to use real data
  const barChartOptions = {
    chart: {
      type: 'column',
      backgroundColor: darkMode ? '#1f2937' : '#ffffff'
    },
    title: {
      text: 'Assignments Completed',
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
        text: 'Number of Assignments',
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        }
      },
      labels: {
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        }
      }
    },
    series: [{
      name: 'Assignments Completed',
      data: assignmentData.values,
      color: 'rgba(75, 192, 192, 0.6)'
    }],
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return `<b>Week ${this.x}</b><br/>
                Completed Assignments: ${this.y}`;
      }
    }
  };

  const lineChartOptions = {
    chart: {
      type: 'line',
      backgroundColor: darkMode ? '#1f2937' : '#ffffff'
    },
    title: {
      text: 'Student Performance',
      style: {
        color: darkMode ? '#ffffff' : '#000000'
      }
    },
    xAxis: {
      categories: performanceData.labels,
      labels: {
        style: {
          color: darkMode ? '#ffffff' : '#000000'
        }
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
      name: 'Class Average',
      data: performanceData.values,
      color: 'rgba(255, 99, 132, 1)'
    }],
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return `<b>Week ${this.x}</b><br/>
                Average Score: ${this.y}%`;
      }
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

  return (
    <div className=" mt-8 sm:mt-0 sm:p-3 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Dashboard Content */}
        <div className="col-span-3">
          <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

          {/* Greeting Section */}

          <div
            className={`mb-8 p-4 rounded-lg shadow-lg flex flex-col lg:flex-row items-center justify-between ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-green-700"
            }`}
          >
            <div className="flex-1 mb-4 lg:mb-0">
              {teacherData && (
                <p className="font-bold text-2xl mb-1 bg-gradient-to-r from-orange-600 via-green-700  to-purple-900 text-transparent bg-clip-text">
                  {greeting.split(",")[0]}, Teacher {teacherData.first_name}!
                </p>
              )}
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-2`}
              >
                {greeting.split(",").slice(1).join(",").trim()}
              </p>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {formattedDate}
              </p>
            </div>
            <div className="flex-shrink-0 w-32 h-40 lg:w-48 lg:h-48">
              <img
                src={illustrations}
                alt="Teacher Illustration"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Metrics and Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric) => (
              <div
                key={metric.title}
                className={`p-4 rounded-lg shadow-lg ${metric.color} text-white`}
              >
                <h2 className="text-sm font-semibold">{metric.title}</h2>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`rounded-lg shadow-lg p-4 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-md font-semibold mb-4">
                Assignments Completion Over Time
              </h2>
              <HighchartsReact
                highcharts={Highcharts}
                options={barChartOptions}
              />
            </div>
            <div
              className={`rounded-lg shadow-lg p-4 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-md font-semibold mb-4">
                Student Performance Over Time
              </h2>
              <HighchartsReact
                highcharts={Highcharts}
                options={lineChartOptions}
              />
            </div>
          </div>

          {/* Top Performing Students */}
          <div
            className={`mt-8 rounded-lg shadow-lg p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-md font-semibold mb-4">
              Top Performing Students
            </h2>
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
                  <span>
                    {student.name} (Rank: {student.rank})
                  </span>
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

        {/* Right Sidebar: Calendar and Quick Links */}
        <div className="sm:col-span-1 col-span-3 space-y-6 mt-0 lg:mt-11 py-3">
          {/* Calendar Component */}
          <div
            className={`rounded-lg shadow-lg p-3 py-5 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 ml-1">Calendar</h2>
            <Calendar
              onChange={setDate}
              value={date}
              className={`${darkMode ? "bg-gray-800" : "bg-white"}`}
            />
          </div>

          {/* Quick Links */}
          <div
            className={`rounded-lg shadow-lg p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-200 rounded"
                >
                  <span className="text-xl mr-3">{link.icon}</span>
                  <span onClick={link.action} className="hover:underline">
                    {link.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
