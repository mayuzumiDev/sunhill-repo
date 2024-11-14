import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { faChevronDown, faChevronUp, faUserCheck, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import {
 SparklesIcon
} from '@heroicons/react/24/outline';
const branches = [
  { value: "Batangas", label: "BATANGAS" },
  { value: "Rosario", label: "ROSARIO" },
  { value: "Bauan", label: "BAUAN" },
  { value: "Metro Tagaytay", label: "METRO TAGAYTAY" },
];

const AddAccountModal = ({
  isModalOpen,
  setIsModalOpen,
  onGenerateAccount,
  userType,
}) => {
  const [numAccounts, setNumAccounts] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleGenerate = () => {
    if (!numAccounts || !selectedBranch) {
      setErrorMessage("Please fill in all fields."); // Set error message
      return; // Prevent further action if fields are not filled
    }
    setErrorMessage(""); // Clear error message if validation passes
    onGenerateAccount(numAccounts, selectedBranch);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCancel = () => {
    setNumAccounts("");
    setSelectedBranch("");
    setErrorMessage("");
    setIsModalOpen(false);
  };

  return (
    <div
      className={`modal fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50`}
      style={{ display: isModalOpen ? "block" : "none" }}
    >
      <div className="min-h-screen px-6 py-4 text-center flex justify-center items-center h-full">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="text-gray-700 px-6 py-4 flex justify-between">
            <h2 className="text-lg font-montserrat font-bold">
              Create {userType} Account
            </h2>
          </div>
          <div className="p-6">
            {errorMessage && (
              <p className="text-red-600 text-sm mb-4 max-w-md mx-auto bg-red-100 border-l-4 border-red-500 p-3 rounded-md">
                {errorMessage}
              </p>
            )}
           
           <p className="text-gray-700 text-sm mb-4 max-w-md mx-auto bg-gray-100 border-l-4 border-blue-500 p-3 rounded-md flex items-center">
              <SparklesIcon className="h-10 w-10 text-blue-500 " />
              <span>
                Generate {userType} accounts with usernames in the format{" "}
                <code className="font-semibold">tch-24-1234</code> and passwords like{" "}
                <code className="font-semibold">teacher1234</code>
              </span>
            </p>

            <div className="mb-4 max-w-xs mx-auto relative">
              <label
                htmlFor="numAccounts"
                className="text-gray-700 font-montserrat font-semibold mb-2 flex items-center"
              >
                  
                Number of Accounts
              </label>
              <input
                type="number"
                id="numAccounts"
                placeholder="Enter number of accounts"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={numAccounts}
                onChange={(e) => setNumAccounts(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 max-w-xs mx-auto relative">
              <label
                htmlFor="branch"
                className="text-gray-700 font-montserrat font-semibold mb-2 flex items-center"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-600" />
                Select Branch
              </label>
              <div className="relative">
                <select
                  id="branch"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isDropdownOpen ? "border-blue-500" : "border-gray-300"}`}
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                  onClick={toggleDropdown}
                >
                  <option value="" disabled>
                    Choose Branch
                  </option>
                  {branches.map((branch) => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <FontAwesomeIcon icon={isDropdownOpen ? faChevronUp : faChevronDown} className="h-5 w-5 text-gray-500" />
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between p-6">
            <StyledWrapper>
              <button 
              className="btn"    
              onClick={handleGenerate}
              >  
                <svg height={24} width={24} fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
                  <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                </svg>
                <span className="text">Generate</span>
              </button>
            </StyledWrapper>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .btn {
    border: none;
    width: 11em;
    height: 2.5em;
    border-radius: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: #1C1A1C;
    cursor: pointer;
    transition: all 450ms ease-in-out;
  }

  .sparkle {
    fill: #AAAAAA;
    transition: all 800ms ease;
  }

  .text {
    font-weight: 600;
    color: #AAAAAA;
    font-size: medium;
  }

  .btn:hover {
    background: linear-gradient(0deg,#A47CF3,#683FEA);
    box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
    inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 4px rgba(255, 255, 255, 0.2),
    0px 0px 180px 0px #9917FF;
    transform: translateY(-2px);
  }

  .btn:hover .text {
    color: white;
  }

  .btn:hover .sparkle {
    fill: white;
    transform: scale(1.2);
  }`;


export default AddAccountModal;