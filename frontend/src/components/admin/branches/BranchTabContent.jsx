import React from "react";
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

const BranchTabContent = ({ selectedBranch, activeTab }) => {
  console.log("BranchTabContent received:", { selectedBranch, activeTab });

  if (!selectedBranch) return null;

  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Contact Information
          </h3>
          <div className="space-y-2">
            <p className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2" /> {selectedBranch.address}
            </p>
            <p className="flex items-center text-gray-600">
              <FaPhone className="mr-2" /> {selectedBranch.phone}
            </p>
            <p className="flex items-center text-gray-600">
              <FaEnvelope className="mr-2" /> {selectedBranch.email}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Leadership
          </h3>
          <p className="flex items-center text-gray-600">
            <FaUserTie className="mr-2" /> Principal: {selectedBranch.principal}
          </p>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <FaUsers className="mr-2" /> Population
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li>Teachers: {selectedBranch.data?.teacher_count}</li>
            <li>Students: {selectedBranch.data?.student_count}</li>
            <li>Parents: {selectedBranch.data?.parent_count}</li>
          </ul>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <FaChartLine className="mr-2" /> Performance
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li>Attendance:</li>
            <li>Satisfaction:</li>
            <li>Academic:</li>
          </ul>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
            <FaBook className="mr-2" /> Education
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li>Classes: </li>
          </ul>
        </div>
      </div>
    </div>
  );

  //   const renderFacilitiesTab = () => (
  //     <div className="space-y-4">
  //       <h3 className="text-xl font-semibold text-gray-800 mb-4">
  //         Available Facilities
  //       </h3>
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //         {selectedBranch.facilities.map((facility, index) => (
  //           <div key={index} className="bg-white p-4 rounded-lg shadow border">
  //             <h4 className="font-semibold text-gray-800">{facility}</h4>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );

  //   const renderProgramsTab = () => (
  //     <div className="space-y-4">
  //       <h3 className="text-xl font-semibold text-gray-800 mb-4">
  //         Educational Programs
  //       </h3>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         {selectedBranch.programs.map((program, index) => (
  //           <div key={index} className="bg-white p-4 rounded-lg shadow border">
  //             <h4 className="font-semibold text-gray-800">{program}</h4>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );

  //   const renderAchievementsTab = () => (
  //     <div className="space-y-4">
  //       <h3 className="text-xl font-semibold text-gray-800 mb-4">
  //         Recent Achievements
  //       </h3>
  //       <div className="space-y-4">
  //         {selectedBranch.achievements.map((achievement, index) => (
  //           <div key={index} className="bg-white p-4 rounded-lg shadow border">
  //             <h4 className="font-semibold text-gray-800">{achievement}</h4>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );

  const tabContent = {
    overview: renderOverviewTab,
    // facilities: renderFacilitiesTab,
    // programs: renderProgramsTab,
    // achievements: renderAchievementsTab,
  };

  return tabContent[activeTab]?.() || null;
};

export default BranchTabContent;
