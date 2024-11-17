import React from "react";
import {InformationCircleIcon} from '@heroicons/react/24/outline';

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
      <div className="min-h-screen px-6 py-4 text-center flex justify-center items-center h-full ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-max min-h-[350px] flex flex-col font-montserrat">
          <h1 className="text-xl font-semibold mb-4 text-left">
            Generated Student & Parent Accounts
          </h1>
          <p className="text-gray-700 text-xs sm:text-sm mb-4 max-w-md mx-auto bg-gray-100 border-l-4 border-blue-500 p-3 rounded-md flex items-center">
            <InformationCircleIcon className="h-14 w-15 text-blue-500 mr-2 md:h-15 sm:h-15" />
            For each student account generated, a corresponding parent account has been created and linked.
          </p>
          <p className="text-gray-600 text-left mb-4">
            Total Accounts: {generatedAccounts.length * 2}
          </p>
          <div
            className="overflow-y-auto max-h-[200px] mb-4"
            style={{ position: "relative" }}
          >
            <table className="table-auto w-full" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    className="px-4 py-2 sticky top-0 bg-white"
                    style={{ zIndex: 1 }}
                  >
                    Student
                  </th>
                  <th
                    colSpan="2"
                    className="px-4 py-2 sticky top-0 bg-white"
                    style={{ zIndex: 1 }}
                  >
                    Parent
                  </th>
                </tr>
                <tr>
                  <th className="bg-white sticky top-10 px-4 py-2 border-b border-r">
                    Username
                  </th>
                  <th className="bg-white sticky top-10 px-4 py-2 border-b">
                    Password
                  </th>
                  <th className="bg-white sticky top-10 px-4 py-2 border-b border-r">
                    Username
                  </th>
                  <th className="bg-white sticky top-10 px-4 py-2 border-b">
                    Password
                  </th>
                </tr>
              </thead>
              <tbody>
                {generatedAccounts.map((account, i) => (
                  <tr key={i}>
                    <td className="border px-4 py-2">{account.username}</td>
                    <td className="border px-4 py-2">{account.password}</td>
                    <td className="border px-4 py-2">
                      {account.parent_username}
                    </td>
                    <td className="border px-4 py-2">
                      {account.parent_password}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-auto space-x-4">
            <button
              onClick={onSaveAccounts}
              className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 focus:outline-none text-white text-xs sm:text-sm font-bold py-2 px-6 rounded-lg transition-colors duration-200"
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
