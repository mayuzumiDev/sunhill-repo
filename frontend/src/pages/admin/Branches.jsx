import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import HideScrollbar from "../../components/misc/HideScrollBar";
import BranchCard from "../../components/admin/branches/BranchCard";
import BranchTabContent from "../../components/admin/branches/BranchTabContent";
import batangasSunhillImg from "../../assets/img/home/sunhill-bats.jpg";
import rosarioSunhillImg from "../../assets/img/home/rosario.jpg";
import bauanSunhillImg from "../../assets/img/home/bauan.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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

  const handleCloseModal = () => {
    setSelectedBranch(null);
    setActiveTab("overview");
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

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="p-2 sm:p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl sm:text-4xl text-gray-800 font-bold font-montserrat">
              Branches
            </h1>
            <p className="text-gray-500 mt-2">Manage and monitor all Sunhill branches</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <BranchCard
              branchName={"Batangas"}
              imageUrl={batangasSunhillImg}
              branchAddress={"123 Main Street, Batangas City"}
              branchCounts={{ data: branchCounts["Batangas"] }}
              onClick={() => handleBranchSelect("Batangas")}
              className="h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            />
          </motion.div>
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
            branchCounts={{ data: branchCounts["Bauan"] }}
            onClick={() => handleBranchSelect("Bauan")}
          />
          <BranchCard
            branchName={"Metro Tagaytay"}
            imageUrl={bauanSunhillImg}
            branchAddress={"M. Dimapilis St., Anuling Lejos 2, Metro Tagaytay, Mendez, Cavite"}
            branchCounts={{ data: branchCounts["Metro Tagaytay"] }}
            onClick={() => handleBranchSelect("Metro Tagaytay")}
          />
        </div>
      </div>

      {/* Branch Details Modal */}
      <AnimatePresence>
        {selectedBranch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 relative">
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </motion.button>
                <h2 className="text-3xl font-bold text-white">
                  {selectedBranch.name} Branch
                </h2>
                <p className="text-blue-100 mt-2">Branch Details and Statistics</p>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
                <BranchTabContent
                  selectedBranch={selectedBranch}
                  activeTab="overview"
                />
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseModal}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 shadow-sm hover:shadow"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <HideScrollbar />
    </div>
  );
};

export default Branches;
