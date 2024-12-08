import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import EditSuccessAlert from "../../alert/EditSuccessAlert";
import EditErrorAlert from "../../alert/EditErrorAlert";
import EditStudentModal from "../../modal/admin/manage_account/EditStudentModal";
import SchawnnahJLoader from "../../loaders/SchawnnahJLoader";
import SatyamLoader from "../../loaders/SatyamLoader";
import HideScrollBar from "../../misc/HideScrollBar";

const StudentTable = ({
  studentAccounts,
  fetchData,
  isOperationRunning,
  handleSelectRow,
  handleSelectAll,
  isSelected,
  allSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setIsEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Automatically hide alert after 5 seconds
    if (successAlert) {
      const timer = setTimeout(() => setSuccessAlert(false), 5000);
      return () => clearTimeout(timer);
    }

    if (errorAlert) {
      const timer = setTimeout(() => setErrorAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [successAlert, errorAlert]);

  const handleRowClick = (student, event) => {
    // Prevent edit if the click was on the checkbox
    if (event.target.type === "checkbox") return;

    setIsEditingStudent(student);
    setIsEditing(true);
  };

  const handleCheckboxClick = (event, studentId) => {
    event.stopPropagation(); // Prevent triggering row click when clicking checkbox
    handleSelectRow(event, studentId);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = studentAccounts
    ? studentAccounts.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSave = async (studentData) => {
    const {
      id,
      user_info_id,
      student_info_id,
      username,
      first_name,
      last_name,
      email,
      contact_no,
      grade_level,
      branch_name,
      has_special_needs,
      special_needs_details,
    } = studentData;

    console.log("Processing student data:", {
      has_special_needs,
      type: typeof has_special_needs,
      special_needs_details,
    });

    try {
      setIsLoading(true);
      // Make simultaneous API calls to update user and user info
      const [
        customUserDataResponse,
        userInfoDataResponse,
        studentInfoDataResponse,
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
          `/user-admin/student-info/edit/${student_info_id}/`,
          {
            grade_level: grade_level,
            has_special_needs: Boolean(has_special_needs), // Ensure it's a boolean
            special_needs_details: special_needs_details || "",
          }
        ),
      ]);

      console.log("API Responses:", {
        customUser: customUserDataResponse.data,
        userInfo: userInfoDataResponse.data,
        studentInfo: studentInfoDataResponse.data,
      });

      // Check if both API responses are successful
      if (
        customUserDataResponse.status === 200 &&
        userInfoDataResponse.status === 200 &&
        studentInfoDataResponse.status === 200
      ) {
        await fetchData();
        setIsLoading(false);
        setIsEditing(false);
        setSuccessAlert(true);
      }
    } catch (error) {
      console.error("An occured while saving the data.", error);
      setIsLoading(false);
      setIsEditing(false);
      setErrorAlert(true);
    }
  };

  if (studentAccounts && studentAccounts.length > 0) {
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
                  Grade Level
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  Special Needs
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600 border-r border-gray-300">
                  Special Needs Details
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-600">
                  Branch
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((student_list) => (
                <tr
                  key={student_list.id}
                  className="border-b hover:bg-blue-50 transition duration-150 ease-in-out"
                  onClick={(event) => handleRowClick(student_list, event)}
                >
                  <td
                    className={`py-3 px-4 text-center ${
                      isSelected(student_list.id)
                        ? "border-l-4 border-blue-500"
                        : "border-l-4 border-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(student_list.id)}
                      onChange={(event) =>
                        handleCheckboxClick(event, student_list.id)
                      }
                      className="transform scale-125 text-blue-500 focus:ring focus:ring-blue-200 rounded"
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {student_list.student_info.id}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {student_list.username}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {`${student_list.first_name || "-"} ${
                      student_list.last_name || ""
                    }`}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {student_list.student_info.grade_level || "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {student_list.student_info.has_special_needs ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {student_list.student_info.special_needs_details || "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {student_list.branch_name || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between border-b border-gray-200 items-center">
          <span className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 sm:mb-0">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, studentAccounts.length)} of{" "}
            {studentAccounts.length} Student Accounts
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
              {currentPage} / {Math.ceil(studentAccounts.length / itemsPerPage)}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(studentAccounts.length / itemsPerPage)
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
          <EditStudentModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={handleSave}
            userData={editingStudent}
            userRole={"Student"}
          />
        )}

        {successAlert && (
          <EditSuccessAlert userType={"Student"} userData={editingStudent} />
        )}

        {errorAlert && (
          <EditErrorAlert userType={"Student"} userData={editingStudent} />
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
        <p>No Student account found.</p>
      </div>
    );
  } else {
    return (
      <div className="display: flex justify-center items-start h-screen">
        <HideScrollBar />
        <div style={{ transform: "translateY(100%)" }}>
          <SatyamLoader />
        </div>
      </div>
    );
  }
};

export default StudentTable;
