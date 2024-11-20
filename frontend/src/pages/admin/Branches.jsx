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
    <div className="p-2 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
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
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </motion.button>
                <h2 className="text-2xl font-bold text-white">
                  {selectedBranch.name} Branch
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                {/* Tab Navigation */}
                <div className="mb-6">
                  <div className="flex space-x-4 border-b">
                    {["overview", "students", "teachers", "parents"].map((tab) => (
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
                    ))}
                  </div>
                </div>

                <BranchTabContent
                  selectedBranch={selectedBranch}
                  activeTab={activeTab}
                />
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-100 p-6">
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseModal}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
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
