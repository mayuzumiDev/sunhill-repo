import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import AddAccountModal from "../../../components/modal/AddAccountModal";
import BiingsAlertSuccesss from "../../../components/alert/BiingsAlertSuccess";
import BiingsAlertError from "../../../components/alert/BiingsAlertError";
import "../../../components/alert/styles/BiingsAlert.css";

const Teacher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [newTeacher, setNewTeacher] = useState({
    id: "",
    username: "",
    email: "",
    branch: "",
    contact_no: "",
  });

  /*   const [newTeacher, setNewTeacher] = useState({
    name: "",
    subject: "",
    branch: "",
    username: "",
    password: "",
  }); */

  // const subjects = [...new Set(teachers.map((teacher) => teacher.subject))];
  const branches = [...new Set(teachers.map((teacher) => teacher.branch))];

  const handleBranchChange = (e) => setSelectedBranch(e.target.value);

  const filteredTeachers = teachers.filter((teacher) => {
    const branchMatch = selectedBranch
      ? teacher.branch === selectedBranch
      : true;

    return branchMatch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTeacher = async (numAccounts, branch) => {
    try {
      const response = await axiosInstance.post("/user-admin/create-account/", {
        account_count: numAccounts,
        role: "teacher",
        branch_name: branch,
      });

      if (response.status === 201) {
        setShowSuccessAlert(true);
        const timeoutSuccess = setTimeout(() => {
          setShowSuccessAlert(false);
        }, 2000);
      }
    } catch (error) {
      console.error(
        "An error occurred while creating teacher accounts.",
        error
      );
      setShowErrorAlert(true);
      const timeoutError = setTimeout(() => {
        setShowErrorAlert(false);
      }, 2000);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl text-gray-800 font-bold mb-4">Manage Accounts</h1>
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Teachers</h2>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Add New Teacher
        </button>
      </div>
      <AddAccountModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onAddAccount={handleAddTeacher}
        userType={"Teacher"}
      />
      {showSuccessAlert && (
        <div>
          <BiingsAlertSuccesss
            userType={"Teacher"}
            className={`animate-fade-in-down ${
              showSuccessAlert
                ? "opacity-100"
                : "opacity-0 transition-opacity duration-500 ease-in-out"
            }`}
          />
        </div>
      )}
      {showErrorAlert && (
        <div>
          <BiingsAlertError
            userType={"Teacher"}
            className={`animate-fade-in-down ${
              showErrorAlert
                ? "opacity-100"
                : "opacity-0 transition-opacity duration-500 ease-in-out"
            }`}
          />
        </div>
      )}

      <Filters
        branches={branches}
        selectedBranch={selectedBranch}
        handleBranchChange={handleBranchChange}
      />

      <TeacherTable filteredTeachers={filteredTeachers} />
    </div>
  );
};

const Filters = ({ branches, selectedBranch, handleBranchChange }) => (
  <div className="flex flex-wrap mb-4">
    <div className="flex items-center mb-2">
      <label htmlFor="branch" className="mr-2 text-sm text-gray-700">
        Filter by Branch:
      </label>
      <select
        id="branch"
        value={selectedBranch}
        onChange={handleBranchChange}
        className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="">All</option>
        {branches.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const TeacherTable = ({ filteredTeachers }) => (
  <div className="overflow-x-auto">
    {filteredTeachers.length === 0 ? (
      <div className="text-center text-gray-500">No teachers found.</div>
    ) : (
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Subject</th>
            <th className="py-2 px-4 text-left">Branch</th>
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr key={teacher.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{teacher.id}</td>
              <td className="py-2 px-4">{teacher.name}</td>
              <td className="py-2 px-4">{teacher.subject}</td>
              <td className="py-2 px-4">{teacher.branch}</td>
              <td className="py-2 px-4">{teacher.username}</td>
              <td className="py-2 px-4 flex space-x-1">
                <button
                  className="text-blue-500 hover:underline"
                  aria-label="Edit Teacher"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="text-red-500 hover:underline"
                  aria-label="Delete Teacher"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <style jsx>{`
      /* Hide scrollbar in all browsers */
      ::-webkit-scrollbar {
        display: none;
      }
      body {
        overflow: hidden; /* Prevent scrolling on the body */
      }
    `}</style>
  </div>
);

export default Teacher;
