import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUserTie,
  FaUsers,
  FaChartLine,
  FaBook,
} from "react-icons/fa";
import axios from "axios";

const BranchTabContent = ({ selectedBranch, activeTab }) => {
  const [branchStats, setBranchStats] = useState(null);

  useEffect(() => {
    const fetchBranchStats = async () => {
      if (selectedBranch?.id) {
        console.log("Fetching stats for branch:", selectedBranch.id);
        try {
          const response = await axios.get(`/user-admin/branch-metrics/${selectedBranch.id}/`);
          console.log("Received branch stats:", response.data);
          setBranchStats(response.data);
        } catch (error) {
          console.error("Error fetching branch stats:", error.response || error);
        }
      }
    };

    fetchBranchStats();
  }, [selectedBranch]);

  console.log("BranchTabContent received:", { selectedBranch, activeTab });

  if (!selectedBranch) return null;

  const renderOverviewTab = () => {
    console.log("Rendering overview tab with branchStats:", branchStats);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <FaUsers className="mr-2" /> Population
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li>Teachers: {selectedBranch.data?.teacher_count || 0}</li>
              <li>Students: {selectedBranch.data?.student_count || 0}</li>
              <li>Parents: {selectedBranch.data?.parent_count || 0}</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
              <FaBook className="mr-2" /> Education
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li>Average Class Size: {branchStats?.average_class_size || 'N/A'} students</li>
              <li>Student-Teacher Ratio: {selectedBranch.data?.student_count && selectedBranch.data?.teacher_count
                ? (selectedBranch.data.student_count / selectedBranch.data.teacher_count).toFixed(1) + ':1'
                : 'N/A'}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const tabContent = {
    overview: renderOverviewTab,
  };

  return tabContent[activeTab]?.() || null;
};

export default BranchTabContent;
