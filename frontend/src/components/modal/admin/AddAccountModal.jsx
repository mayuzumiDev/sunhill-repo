import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
    // Reset the state when the modal is cancelled
    setNumAccounts("");
    setSelectedBranch("");
    setErrorMessage("");
    setIsModalOpen(false); // Close the modal
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
            <p className="text-gray-700 text-sm mb-4 max-w-md mx-auto bg-gray-100 border-l-4 border-blue-500 p-3 rounded-md">
              Generate {userType} accounts with usernames in the format{" "}
              <code className="font-semibold">tch-24-1234</code> and passwords
              like <code className="font-semibold">teacher1234</code>
            </p>
            <div className="mb-4 max-w-xs mx-auto relative">
              <label
                htmlFor="numAccounts"
                className="text-gray-700 font-montserrat font-semibold mb-2 flex items-center justify-start"
              >
                Number of Accounts
              </label>
              <input
                type="number"
                id="numAccounts"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={numAccounts}
                onChange={(e) => setNumAccounts(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 max-w-xs mx-auto relative">
              <label
                htmlFor="branch"
                className="text-gray-700 font-montserrat font-semibold mb-2 flex items-center justify-start"
              >
                Select Branch
              </label>
              <div className="relative">
                <select
                  id="branch"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isDropdownOpen ? "border-blue-500" : "border-gray-300"}`}
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                  onClick={toggleDropdown} // Open dropdown on click
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
                  onClick={toggleDropdown} // Toggle dropdown on click
                >
                  <FontAwesomeIcon icon={isDropdownOpen ? faChevronUp : faChevronDown} className="h-5 w-5 text-gray-500" />
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between p-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleGenerate}
            >
              Generate
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCancel} // Call handleCancel to reset and close modal
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
