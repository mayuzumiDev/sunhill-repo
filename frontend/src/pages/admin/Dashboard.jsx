import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { axiosInstance } from "../../utils/axiosInstance";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaSchool,
  FaDownload,
  FaTable,
  FaChartBar
} from "react-icons/fa";

// Import Highcharts modules
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import HC_accessibility from 'highcharts/modules/accessibility';

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
  });
  const [viewMode, setViewMode] = useState('charts'); // 'charts' or 'table'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/user-admin/dashboard/metrics/');
        if (response.status === 200) {
          console.log('Dashboard Data:', response.data);
          setDashboardData({
            studentCount: response.data.student_count,
            teacherCount: response.data.teacher_count,
            parentCount: response.data.parent_count,
            publicUserCount: response.data.public_user_count,
            totalUsers: response.data.total_users,
            classCount: response.data.class_count,
            monthlyRegistrations: response.data.monthly_registrations || [],
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  


  // Line chart options
  const lineChartOptions = {
    chart: {
      type: 'spline',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: 'Monthly User Registrations',
      style: {
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: dashboardData.monthlyRegistrations.map(item => item.month),
      labels: {
        style: {
          color: '#64748b'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Number of Users',
        style: {
          color: '#64748b'
        }
      },
      labels: {
        style: {
          color: '#64748b'
        }
      }
    },
    series: [{
      name: 'New Users',
      data: dashboardData.monthlyRegistrations.map(item => item.count),
      color: '#3b82f6'
    }],
    plotOptions: {
      spline: {
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 4
        }
      }
    },
    // Export menu
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadPDF', 'downloadCSV', 'downloadXLS', 'viewData']
        }
      },
      enabled: true
    },
    // Enable data table
    navigation: {
      buttonOptions: {
        enabled: true
      }
    },
    credits: {
      enabled: false
    }
  };

  // Pie chart options
  const pieChartOptions = {
    chart: {
      type: 'pie',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: 'User Distribution',
      style: {
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%'
        }
      }
    },
    series: [{
      name: 'Users',
      colorByPoint: true,
      data: [
        {
          name: 'Students',
          y: dashboardData.studentCount,
          color: '#3b82f6'
        },
        {
          name: 'Teachers',
          y: dashboardData.teacherCount,
          color: '#22c55e'
        },
        {
          name: 'Parents',
          y: dashboardData.parentCount,
          color: '#eab308'
        },
        {
          name: 'Public',
          y: dashboardData.publicUserCount,
          color: '#ef4444'
        }
      ]
    }],
    // Export menu
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadPDF', 'downloadCSV', 'downloadXLS', 'viewData']
        }
      },
      enabled: true
    },
    // Enable data table
    navigation: {
      buttonOptions: {
        enabled: true
      }
    },
    credits: {
      enabled: false
    }
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

  return (
    <div className="p-6 space-y-8 overflow-hidden bg-lightblue-800" id="dashboard-content">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl text-gray-700 font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode(viewMode === 'charts' ? 'table' : 'charts')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {viewMode === 'charts' ? <FaTable className="text-lg" /> : <FaChartBar className="text-lg" />}
            {viewMode === 'charts' ? 'View Table' : 'View Charts'}
          </button>
          
        </div>
      </div>

      {/* Metrics Section with Hover Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white p-6 rounded-lg shadow-lg flex items-center hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div className="mr-4">{metric.icon}</div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-700">
                {metric.value}
              </h3>
              <p className="text-sm md:text-base text-gray-500">
                {metric.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'charts' ? (
        /* Chart Section */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <HighchartsReact
              highcharts={Highcharts}
              options={lineChartOptions}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <HighchartsReact
              highcharts={Highcharts}
              options={pieChartOptions}
            />
          </div>
        </div>
      ) : (
        /* Table Section */
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teachers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parents</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public Users</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.monthlyRegistrations.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dashboardData.studentCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dashboardData.teacherCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dashboardData.parentCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dashboardData.publicUserCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Styles to hide scrollbar */}
      <style>{`
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
