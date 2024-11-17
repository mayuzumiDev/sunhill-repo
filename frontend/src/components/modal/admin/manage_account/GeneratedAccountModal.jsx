import React from "react";

const GeneratedAccountModal = ({
  isModalOpen,
  setIsModalOpen,
  handleCloseModal,
  generatedAccounts,
  onSaveAccounts,
}) => {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
      style={{ display: isModalOpen ? "block" : "none" }}
    >
      <div className="min-h-screen px-6 py-4 text-center flex justify-center items-center h-full">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md min-h-[350px] flex flex-col font-montserrat">
          <h1 className="text-xl font-semibold mb-4 text-left">
            Generated Teacher Accounts
          </h1>
          <p className="text-gray-600 text-left mb-4">
            Total Accounts: {generatedAccounts.length}
          </p>
          <div
            className="overflow-y-auto max-h-[200px] mb-4"
            style={{ position: "relative" }}
          >
            <table className="table-auto w-full" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th
                    className="px-4 py-2 sticky top-0 bg-white"
                    style={{ zIndex: 1 }}
                  >
                    Username
                  </th>
                  <th
                    className="px-4 py-2 sticky top-0 bg-white"
                    style={{ zIndex: 1 }}
                  >
                    Password
                  </th>
                </tr>
              </thead>
              <tbody>
                {generatedAccounts.map((account, i) => (
                  <tr key={i}>
                    <td className="border px-4 py-2">{account.username}</td>
                    <td className="border px-4 py-2">{account.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-auto space-x-4">
            <button
              onClick={onSaveAccounts}
              className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 focus:outline-none text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Save & Print
            </button>
            <button
              onClick={handleCloseModal}
              className="bg-gray-500 hover:bg-gray-700 focus:bg-gray-500 focus:outline-none text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedAccountModal;
