import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import EditPublicModal from "../../modal/admin/manage_account/EditPublicModal"; 
import EditSuccessAlert from "../../alert/EditSuccessAlert";
import EditErrorAlert from "../../alert/EditErrorAlert";
import SchawnnahJLoader from "../../loaders/SchawnnahJLoader";
import SatyamLoader from "../../loaders/SatyamLoader";
import HideScrollBar from "../../misc/HideScrollBar";

const PublicUserTable = ({
  publicUserAccounts,
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
  const [editingPublicUser, setIsEditingPublicUser] = useState(null);

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

  const handleRowClick = (publicUser, event) => {
    // Prevent edit if the click was on the checkbox
    if (event.target.type === "checkbox") return;

    setIsEditingPublicUser(publicUser);
    setIsEditing(true);
  };

  const handleCheckboxClick = (event, publicUserId) => {
    event.stopPropagation(); // Prevent triggering row click when clicking checkbox
    handleSelectRow(event, publicUserId);
  };

  const handleSave = async (publicUserData) => {
    const {
      user_id,
      user_info_id,
      username,
      first_name,
      last_name,
      email,
      contact_no,
    } = publicUserData;

    try {
      setIsLoading(true);
      // Make simultaneous API calls to update user and user info
      const [customUserDataResponse, userInfoDataResponse] = await Promise.all([
        axiosInstance.patch(`/user-admin/custom-user/edit/${user_id}/`, {
          username,
          email,
          first_name,
          last_name,
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

  if (publicUserAccounts && publicUserAccounts.length > 0) {
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
                <th className="py-4 px-4 text-center font-bold text-gray-600">
                  Contact No
                </th>
              </tr>
            </thead>
            <tbody>
              {publicUserAccounts.map((public_list) => (
                <tr
                  key={public_list.id}
                  className="border-b hover:bg-blue-50 transition duration-150 ease-in-out"
                  onClick={(event) => handleRowClick(public_list, event)}
                >
                  <td
                    className={`py-3 px-4 text-center ${
                      isSelected(public_list.id)
                        ? "border-l-4 border-blue-500"
                        : "border-l-4 border-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(public_list.id)}
                      onChange={(event) =>
                        handleCheckboxClick(event, public_list.id)
                      }
                      className="transform scale-125 text-blue-500 focus:ring focus:ring-blue-200 rounded"
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {public_list.id}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {public_list.username}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {`${public_list.first_name || "-"} ${
                      public_list.last_name || ""
                    }`}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {public_list.email || "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">
                    {public_list.user_info.contact_no || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading && <SchawnnahJLoader />}

        {isEditing && (
          <EditPublicModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={handleSave}
            userData={editingPublicUser}
            userRole={"Public User"}
          />
        )}

        {successAlert && (
          <EditSuccessAlert
            userType={"Public User"}
            userData={editingPublicUser}
          />
        )}

        {errorAlert && (
          <EditErrorAlert
            userType={"Public User"}
            userData={editingPublicUser}
          />
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
        <p>No Public User account found.</p>
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

export default PublicUserTable;
