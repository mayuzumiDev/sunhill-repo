import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaSchool,
  FaDownload,
  FaTable,
  FaChartBar,
} from "react-icons/fa";

// Import Highcharts modules
import HC_exporting from "highcharts/modules/exporting";
import HC_exportData from "highcharts/modules/export-data";
import HC_accessibility from "highcharts/modules/accessibility";

// Initialize Highcharts modules
HC_exporting(Highcharts);
HC_exportData(Highcharts);
HC_accessibility(Highcharts);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    studentCount: 0,
    teacherCount: 0,
    parentCount: 0,
    publicUserCount: 0,
    totalUsers: 0,
    classCount: 0,
    monthlyRegistrations: [],
    classesData: [],
  });
  const [viewMode, setViewMode] = useState("charts"); // 'charts' or 'table'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          "/user-admin/dashboard/metrics/"
        );
        if (response.status === 200) {
          // console.log('Dashboard Data:', response.data);
          setDashboardData({
            studentCount: response.data.student_count,
            teacherCount: response.data.teacher_count,
            parentCount: response.data.parent_count,
            publicUserCount: response.data.public_user_count,
            totalUsers: response.data.total_users,
            classCount: response.data.class_count,
            monthlyRegistrations: response.data.monthly_registrations || [],
            classesData: response.data.classes_data || [],
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function - Move this to the top before any chart options
  const calculateGrowthRate = (data) => {
    return data.map((item, index) => {
      if (index === 0) return 0;
      const previousCount = data[index - 1].count;
      const currentCount = item.count;
      return (((currentCount - previousCount) / previousCount) * 100).toFixed(
        1
      );
    });
  };

  // Now define chart options that use calculateGrowthRate
  const userTrendOptions = {
    chart: {
      type: "area",
      style: { fontFamily: "Inter, sans-serif" },
    },
    title: { text: "User Growth Trends" },
    xAxis: {
      categories: dashboardData.monthlyRegistrations.map((item) => item.month),
    },
    yAxis: [
      {
        title: { text: "Number of Users" },
        labels: { style: { color: "#64748b" } },
      },
      {
        title: { text: "Growth Rate %" },
        opposite: true,
      },
    ],
    series: [
      {
        name: "Total Users",
        data: dashboardData.monthlyRegistrations.map((item) => item.count),
        color: "#3b82f6",
      },
      {
        name: "Growth Rate",
        type: "line",
        yAxis: 1,
        data: calculateGrowthRate(dashboardData.monthlyRegistrations),
        color: "#22c55e",
      },
    ],
    plotOptions: {
      area: {
        fillOpacity: 0.3,
      },
    },
  };

  const KPIMetrics = () => {
    const metrics = [
      {
        label: "User Growth Rate",
        value:
          calculateGrowthRate(dashboardData.monthlyRegistrations).slice(-1)[0] +
          "%",
        trend: "up",
        target: "10%",
      },
      {
        label: "Student-Teacher Ratio",
        value:
          dashboardData.teacherCount > 0
            ? (dashboardData.studentCount / dashboardData.teacherCount).toFixed(
                1
              ) + ":1"
            : "N/A",
        target: "15:1",
      },
      {
        label: "Class Utilization",
        value:
          (
            (dashboardData.studentCount / (dashboardData.classCount * 30)) *
            100
          ).toFixed(1) + "%",
        target: "85%",
      },
    ];


    return (
      <div className="grid grid-cols-1 gap-3">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-600">{metric.label}</h3>
              <span className="text-xs text-gray-500">
                Target: {metric.target}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-lg font-semibold text-gray-800">
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Line chart options
  const lineChartOptions = {
    chart: {
      type: "spline",
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    title: {
      text: "Monthly User Registrations",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: dashboardData.monthlyRegistrations.map((item) => item.month),
      labels: {
        style: {
          color: "#64748b",
        },
      },
    },
    yAxis: {
      title: {
        text: "Number of Users",
        style: {
          color: "#64748b",
        },
      },
      labels: {
        style: {
          color: "#64748b",
        },
      },
    },
    series: [
      {
        name: "New Users",
        data: dashboardData.monthlyRegistrations.map((item) => item.count),
        color: "#3b82f6",
      },
    ],
    plotOptions: {
      spline: {
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 4,
        },
      },
    },
    // Export menu
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            "viewFullscreen",
            "separator",
            "downloadPNG",
            "downloadPDF",
            "downloadCSV",
            "downloadXLS",
            "viewData",
          ],
        },
      },
      enabled: true,
    },
    // Enable data table
    navigation: {
      buttonOptions: {
        enabled: true,
      },
    },
    credits: {
      enabled: false,
    },
  };

  // Pie chart options
  const pieChartOptions = {
    chart: {
      type: "pie",
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    title: {
      text: "User Distribution",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
        },
      },
    },
    series: [
      {
        name: "Users",
        colorByPoint: true,
        data: [
          {
            name: "Students",
            y: dashboardData.studentCount,
            color: "#3b82f6",
          },
          {
            name: "Teachers",
            y: dashboardData.teacherCount,
            color: "#22c55e",
          },
          {
            name: "Parents",
            y: dashboardData.parentCount,
            color: "#eab308",
          },
          {
            name: "Public",
            y: dashboardData.publicUserCount,
            color: "#ef4444",
          },
        ],
      },
    ],
    // Export menu
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            "viewFullscreen",
            "separator",
            "downloadPNG",
            "downloadPDF",
            "downloadCSV",
            "downloadXLS",
            "viewData",
          ],
        },
      },
      enabled: true,
    },
    // Enable data table
    navigation: {
      buttonOptions: {
        enabled: true,
      },
    },
    credits: {
      enabled: false,
    },
  };

  // Metrics data
  const metrics = [
    {
      id: 1,
      label: "Students",
      value: dashboardData.studentCount,
      icon: <FaUserGraduate size={30} className="text-blue-500" />,
    },
    {
      id: 2,
      label: "Teachers",
      value: dashboardData.teacherCount,
      icon: <FaChalkboardTeacher size={30} className="text-green-500" />,
    },
    {
      id: 3,
      label: "Parents",
      value: dashboardData.parentCount,
      icon: <FaUsers size={30} className="text-yellow-500" />,
    },
    {
      id: 4,
      label: "Classes",
      value: dashboardData.classCount,
      icon: <FaSchool size={30} className="text-red-500" />,
    },
  ];

  const userEngagementOptions = {
    chart: {
      type: "column",
    },
    title: { text: "User Engagement Matrix" },
    xAxis: {
      categories: ["Students", "Teachers", "Parents", "Public"],
    },
    yAxis: [
      {
        title: { text: "Count" },
      },
    ],
    series: [
      {
        name: "Active Users",
        data: [
          dashboardData.studentCount,
          dashboardData.teacherCount,
          dashboardData.parentCount,
          dashboardData.publicUserCount,
        ],
      },
    ],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: "{point.y:.0f}",
        },
      },
    },
  };

  // Add new helper function for generating insights
  const generateInsights = () => {
    const insights = [];

    // Growth rate insight
    const latestGrowthRate = parseFloat(
      calculateGrowthRate(dashboardData.monthlyRegistrations).slice(-1)[0]
    );
    if (latestGrowthRate < 5) {
      insights.push({
        type: "warning",
        title: "Low User Growth",
        message:
          "User growth rate is below 5%. Consider implementing user acquisition campaigns.",
        action: "Review marketing strategy and user onboarding process",
      });
    }

    // Student-teacher ratio insight
    const studentTeacherRatio =
      dashboardData.teacherCount > 0
        ? dashboardData.studentCount / dashboardData.teacherCount
        : 0;
    if (studentTeacherRatio > 15) {
      insights.push({
        type: "alert",
        title: "High Student-Teacher Ratio",
        message: `Current ratio of ${studentTeacherRatio.toFixed(
          1
        )}:1 exceeds target of 15:1`,
        action: "Consider hiring more teachers or redistributing classes",
      });
    }

    // Class utilization insight
    const classUtilization =
      (dashboardData.studentCount / (dashboardData.classCount * 30)) * 100;
    if (classUtilization < 70) {
      insights.push({
        type: "info",
        title: "Low Class Utilization",
        message: `Classes are ${classUtilization.toFixed(
          1
        )}% utilized, below optimal levels`,
        action: "Consider consolidating classes or promoting available spots",
      });
    }

    return insights;
  };

  // Add new component for displaying insights
  const DecisionSupport = () => {
    const insights = generateInsights();

    return (
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === "warning"
                    ? "bg-yellow-50 border-yellow-200"
                    : insight.type === "alert"
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <h3 className="font-semibold mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                <div className="flex items-center text-sm font-medium">
                  <span className="mr-2">Recommended Action:</span>
                  <span className="text-blue-600">{insight.action}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              All metrics are within expected ranges.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="p-4 md:p-6 space-y-6 md:space-y-8 min-h-screen"
      id="dashboard-content"
    >
      {/* Header Section - Improved spacing and responsive design */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl text-gray-800 font-bold">
          Dashboard
        </h1>
        <div className="w-full sm:w-auto">
          <button
            onClick={() =>
              setViewMode(viewMode === "charts" ? "table" : "charts")
            }
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            {viewMode === "charts" ? (
              <FaTable className="text-lg" />
            ) : (
              <FaChartBar className="text-lg" />
            )}
            {viewMode === "charts" ? "View Table" : "View Charts"}
          </button>
        </div>
      </div>

      {/* Metrics Cards - Improved grid and card design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gray-50">{metric.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
                {isLoading ? (
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-800">
                    {metric.value.toLocaleString()}
                  </h3>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewMode === "charts" ? (
        <div className="space-y-6">
          {/* New side-by-side layout for KPI and Insights */}
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* KPI Metrics */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Key Performance Indicators
                </h2>
                <KPIMetrics />
              </div>

              {/* Insights & Recommendations */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Insights & Recommendations
                </h2>
                <DecisionSupport />
              </div>
            </div>
          )}

          {/* Charts Grid and remaining content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              <>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                  <div className="bg-gray-100 h-[300px] rounded-lg animate-pulse"></div>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                  <div className="bg-gray-100 h-[300px] rounded-lg animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={lineChartOptions}
                  />
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={pieChartOptions}
                  />
                </div>
              </>
            )}
          </div>

          {/* Full-width charts */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <HighchartsReact
              highcharts={Highcharts}
              options={userTrendOptions}
            />
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <HighchartsReact
              highcharts={Highcharts}
              options={userEngagementOptions}
            />
          </div>
        </div>
      ) : (
        /* Table Section - Improved table design */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    New Users
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Teachers
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Parents
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Public Users
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.monthlyRegistrations.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-sm text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-900">
                      {item.count}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-900">
                      {dashboardData.studentCount}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-900">
                      {dashboardData.teacherCount}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-900">
                      {dashboardData.parentCount}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-900">
                      {dashboardData.publicUserCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Updated scrollbar styles */}
      <style>{`
        @media (min-width: 768px) {
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            display: block;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
          body {
            overflow: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
