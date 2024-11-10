import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import EditSuccessAlert from "../alert/EditSuccessAlert";
import EditErrorAlert from "../alert/EditErrorAlert";
import EditAccountModal from "../modal/admin/EditAccountModal";
import SchawnnahJLoader from "../loaders/SchawnnahJLoader";
import SatyamLoader from "../loaders/SatyamLoader";
import HideScrollBar from "../misc/HideScrollBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const TeacherTable = ({
  teacherAccounts,
  handleSelectRow,
  handleSelectAll,
  isSelected,
  allSelected,
  fetchData,
  searchPerform,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeacher, setIsEditingTeacher] = useState(null);

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

  const handleSave = async (formData) => {
    // Destructure formData to extract necessary fields
    const {
      user_id,
      user_info_id,
      username,
      first_name,
      last_name,
      email,
      contact_no,
      branch_name,
    } = formData;

    try {
      setIsLoading(true);
      // Make simultaneous API calls to update user and user info
      const [customUserDataResponse, userInfoDataResponse] = await Promise.all([
        axiosInstance.patch(`/user-admin/custom-user/edit/${user_id}/`, {
          username,
          email,
          first_name,
          last_name,
          branch_name,
        }),
        axiosInstance.patch(`/user-admin/user-info/edit/${user_info_id}/`, {
          contact_no: contact_no ? contact_no : null,
        }),
      ]);

      // Check if both API responses are successful
      if (
        customUserDataResponse.status === 200 &&
        userInfoDataResponse.status === 200
      ) {
        setIsLoading(false);
        setIsEditing(false);
        setSuccessAlert(true);
        fetchData();
      }
    } catch (error) {
      console.error("An occured while saving the data.", error);
      setIsLoading(false);
      setIsEditing(false);
      setErrorAlert(true);
    }
  };

  const handleRowClick = (teacher) => {
    setIsEditingTeacher(teacher);
    setIsEditing(true);
  };

  if (teacherAccounts && teacherAccounts.length > 0) {
    return (
      <div className="overflow-x-auto">
        <HideScrollBar />
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={allSelected}
                  className="transform scale-150"
                />
              </th>
              <th className="py-2 px-4 text-center">ID</th>
              <th className="py-2 px-4 text-center">Username</th>
              <th className="py-2 px-4 text-center">Name</th>
              <th className="py-2 px-4 text-center">Email</th>
              <th className="py-2 px-4 text-center">Contact No.</th>
              <th className="py-2 px-4 text-center">Branch</th>
            </tr>
          </thead>
          <tbody>
            {teacherAccounts.map((teacher_list) => (
              <tr
                key={teacher_list.user_id}
                className="border-b hover:bg-gray-100"
                onClick={() => handleRowClick(teacher_list)}
              >
                <td className="py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected(teacher_list.user_id)}
                    onChange={(event) =>
                      handleSelectRow(event, teacher_list.user_id)
                    }
                    onClick={(event) => event.stopPropagation()}
                    className="transform scale-150"
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  {teacher_list.user_id}
                </td>
                <td className="py-2 px-4 text-center">
                  {teacher_list.username}
                </td>
                <td className="py-2 px-4 text-center">
                  {`${teacher_list.first_name || "-"} ${
                    teacher_list.last_name
                  }`}
                </td>
                <td className="py-2 px-4 text-center">
                  {teacher_list.email || "-"}
                </td>
                <td className="py-2 px-4 text-center">
                  {teacher_list.contact_no || "-"}
                </td>
                <td className="py-2 px-4 text-center">
                  {teacher_list.branch_name || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
  } else if (searchPerform) {
    // Show this message if a search was performed but no results were found
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
      <div className="display: flex justify-center items-start h-screen">
        <HideScrollBar />
        <div style={{ transform: "translateY(100%)" }}>
          <SatyamLoader />
        </div>
      </div>
    );
  }
};
export default TeacherTable;
