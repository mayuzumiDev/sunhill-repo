import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import EditSuccessAlert from "../../alert/EditSuccessAlert";
import EditErrorAlert from "../../alert/EditErrorAlert";
import EditAccountModal from "../../modal/admin/manage_account/EditAccountModal";
import SchawnnahJLoader from "../../loaders/SchawnnahJLoader";
import SatyamLoader from "../../loaders/SatyamLoader";
import HideScrollBar from "../../misc/HideScrollBar";

const TeacherTable = ({
  teacherAccounts,
  handleSelectRow,
  handleSelectAll,
  isSelected,
  allSelected,
  fetchData,
  isOperationRunning,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeacher, setIsEditingTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (successAlert) {
      const timer = setTimeout(() => setSuccessAlert(false), 5000);
      return () => clearTimeout(timer);
    }
    if (errorAlert) {
      const timer = setTimeout(() => setErrorAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [successAlert, errorAlert]);

  const handleSave = async (formData) => {
    const {
      id,
      user_info_id,
      teacher_info_id,
      username,
      first_name,
      last_name,
      email,
      contact_no,
      staff_position,
      branch_name,
    } = formData;

    try {
      setIsLoading(true);
      const [
        customUserDataResponse,
        userInfoDataResponse,
        teacherInfoDataResponse,
      ] = await Promise.all([
        axiosInstance.patch(`/user-admin/custom-user/edit/${id}/`, {
          username,
          email,
          first_name,
          last_name,
          branch_name,
        }),
        axiosInstance.patch(`/user-admin/user-info/edit/${user_info_id}/`, {
          contact_no: contact_no ? contact_no : null,
        }),
        axiosInstance.patch(
          `/user-admin/teacher-info/edit/${teacher_info_id}/`,
          {
            staff_position,
          }
        ),
      ]);

      if (
        customUserDataResponse.status === 200 &&
        userInfoDataResponse.status === 200 &&
        teacherInfoDataResponse.status === 200
      ) {
        setIsLoading(false);
        setIsEditing(false);
        setSuccessAlert(true);
        fetchData();
      }
    } catch (error) {
      console.error("An error occurred while saving the data.", error);
      setIsLoading(false);
      setIsEditing(false);
      setErrorAlert(true);
    }
  };

  const handleRowClick = (teacher, event) => {
    if (event.target.type === "checkbox") return;
    setIsEditingTeacher(teacher);
    setIsEditing(true);
  };

  const handleCheckboxClick = (event, teacherId) => {
    event.stopPropagation();
    handleSelectRow(event, teacherId);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = teacherAccounts
    ? teacherAccounts.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (teacherAccounts && teacherAccounts.length > 0) {
    return (
      <div className="overflow-x-auto">
        <HideScrollBar />
        <div className="max-h-96 overflow-y-auto relative rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="sticky top-0 z-10 bg-gray-200 rounded-t-lg border-l-4 shadow-sm">
              <tr>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={allSelected}
                    className="transform scale-125 text-blue-500 focus:ring focus:ring-blue-200 rounded"
                  />
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  ID
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  Username
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  Name
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  Email
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  Contact No.
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  Staff Position
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600">
                  Branch
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((teacher_list) => (
                <tr
                  key={teacher_list.id}
                  className="border-b hover:bg-blue-50 transition duration-150 ease-in-out"
                  onClick={(event) => handleRowClick(teacher_list, event)}
                >
                  <td
                    className={`py-3 px-4 text-center ${
                      isSelected(teacher_list.id)
                        ? "border-l-4 border-blue-500"
                        : "border-l-4 border-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(teacher_list.id)}
                      onChange={(event) =>
                        handleCheckboxClick(event, teacher_list.id)
                      }
                      className="transform scale-125 text-blue-500 focus:ring focus:ring-blue-200 rounded"
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {teacher_list.teacher_info.id}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {teacher_list.username}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">{`${
                    teacher_list.first_name || "-"
                  } ${teacher_list.last_name || ""}`}</td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {teacher_list.email || "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {teacher_list.user_info.contact_no || "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {teacher_list.teacher_info.staff_position || "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {teacher_list.branch_name || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className=" flex flex-col sm:flex-row justify-between border-b border-gray-200 pt-4 items-center">
          <span className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 sm:mb-0">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, teacherAccounts.length)} of{" "}
            {teacherAccounts.length} Teacher Accounts
          </span>
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition duration-150 ease-in-out"
              aria-label="Previous page"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm sm:text-base">
              {currentPage} / {Math.ceil(teacherAccounts.length / itemsPerPage)}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(teacherAccounts.length / itemsPerPage)
              }
              className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition duration-150 ease-in-out"
              aria-label="Next page"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        {isLoading && <SchawnnahJLoader />}
        {isEditing && (
          <EditAccountModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={handleSave}
            userData={editingTeacher}
            userRole={"Teacher"}
          />
        )}
        {successAlert && (
          <EditSuccessAlert userType={"Teacher"} userData={editingTeacher} />
        )}
        {errorAlert && (
          <EditErrorAlert userType={"Teacher"} userData={editingTeacher} />
        )}
      </div>
    );
  } else if (isOperationRunning) {
    return (
      <div className="text-center py-4 mt-24">
        <HideScrollBar />
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size="2x"
          className="text-red-500 mb-2"
        />
        <p>No teacher account found.</p>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-start h-screen">
        <HideScrollBar />
        <div style={{ transform: "translateY(100%)" }}>
          <SatyamLoader />
        </div>
      </div>
    );
  }
};

export default TeacherTable;
