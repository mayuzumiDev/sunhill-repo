import React, { useState } from "react";

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
  const [selectedBranch, setSelectedBranch] = useState(branches[0].value);

  const handleGenerate = () => {
    if (numAccounts && selectedBranch) {
      onGenerateAccount(numAccounts, selectedBranch);
    }
  };

  return (
    <div
      className={`modal fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50`}
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
            <p className="text-gray-700 text-sm mb-4 max-w-md mx-auto bg-gray-100 border-l-4 border-blue-500 p-3 rounded-md">
              Generate {userType} accounts with usernames in the format{" "}
              <code className="font-semibold">tch-24-1234</code> and passwords
              like <code className="font-semibold">teacher1234</code>
            </p>
            <div className="mb-4 max-w-xs mx-auto">
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
            <div className="mb-4 max-w-xs mx-auto">
              <label
                htmlFor="branch"
                className="text-gray-700 font-montserrat font-semibold mb-2 flex items-center justify-start"
              >
                Select Branch
              </label>
              <select
                id="branch"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
              >
                {branches.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
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
              onClick={() => setIsModalOpen(false)}
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
