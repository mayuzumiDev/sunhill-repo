import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import HideScrollbar from "../../components/misc/HideScrollBar";
import BranchCard from "../../components/admin/branches/BranchCard";
import BranchTabContent from "../../components/admin/branches/BranchTabContent";
import batangasSunhillImg from "../../assets/img/home/sunhill-bats.jpg";
import rosarioSunhillImg from "../../assets/img/home/rosario.jpg";
import bauanSunhillImg from "../../assets/img/home/bauan.jpg";

const Branches = () => {
  const [branchCounts, setBranchCounts] = useState({});

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleBranchSelect = (branchName) => {
    setSelectedBranch({
      name: branchName,
      data: branchCounts[branchName],
    });
  };

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axiosInstance.post(
          "/user-admin/branch/user-list/",
          {}
        );

        if (response.status === 200) {
          console.log("Raw API Response:", response.data);
          const branchData = {};
          response.data.data.forEach((branch) => {
            branchData[branch.branch_name] = branch;
          });

          console.log("Final branchData:", branchData);
          setBranchCounts(branchData);
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    fetchUserCount();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          {" "}
          <h1 className="text-3xl sm:text-4xl text-gray-800 font-bold font-montserrat">
            Branches
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BranchCard
            branchName={"Batangas"}
            imageUrl={batangasSunhillImg}
            branchAddress={"123 Main Street, Batangas City"}
            branchCounts={{ data: branchCounts["Batangas"] }}
            onClick={() => handleBranchSelect("Batangas")}
          />
          <BranchCard
            branchName={"Rosario"}
            imageUrl={rosarioSunhillImg}
            branchAddress={"456 School Avenue, Rosario"}
            branchCounts={{ data: branchCounts["Rosario"] }}
            onClick={() => handleBranchSelect("Rosario")}
          />
          <BranchCard
            branchName={"Bauan"}
            imageUrl={bauanSunhillImg}
            branchAddress={"789 Education Road, Bauan"}
            branchCounts={{ data: branchCounts["Rosario"] }}
            onClick={() => handleBranchSelect("Bauan")}
          />
        </div>
      </div>

      {selectedBranch && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              {selectedBranch.name} Branch
            </h2>
          </div>

          {/* Tab Section */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b">
              {["overview", "facilities", "programs", "achievements"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <BranchTabContent
            selectedBranch={selectedBranch}
            activeTab={activeTab}
          />
        </div>
      )}
      <HideScrollbar />
    </div>
  );
};

export default Branches;
