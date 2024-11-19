import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import HideScrollbar from "../../components/misc/HideScrollBar";
import BranchCard from "../../components/admin/branches/BranchCard";
import batangasSunhillImg from "../../assets/img/home/sunhill-bats.jpg";
import rosarioSunhillImg from "../../assets/img/home/rosario.jpg";
import bauanSunhillImg from "../../assets/img/home/bauan.jpg";

const Branches = () => {
  const [branchCounts, setBranchCounts] = useState({});

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
            onClick={() => {
              console.log("clicked");
            }}
          />
          <BranchCard
            branchName={"Rosario"}
            imageUrl={rosarioSunhillImg}
            branchAddress={"456 School Avenue, Rosario"}
            branchCounts={{ data: branchCounts["Bauan"] }}
            onClick={() => {
              console.log("clicked");
            }}
          />
          <BranchCard
            branchName={"Bauan"}
            imageUrl={bauanSunhillImg}
            branchAddress={"789 Education Road, Bauan"}
            branchCounts={{ data: branchCounts["Rosario"] }}
            onClick={() => {
              console.log("clicked");
            }}
          />
        </div>
      </div>
      <HideScrollbar />
    </div>
  );
};

export default Branches;
