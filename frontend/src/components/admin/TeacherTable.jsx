import React, { useState } from "react";
import SatyamLoader from "../loaders/SatyamLoader";
import EditAccountModal from "../modal/admin/EditAccountModal";

const TeacherTable = ({
  teacherAccounts,
  handleSelectRow,
  handleSelectAll,
  isSelected,
  allSelected,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeacher, setIsEditingTeacher] = useState(null);

  const handleSave = (updatedUserData) => {
    console.log("Updated user data:", updatedUserData);
    // Perform save logic here, such as sending data to an API
  };

  const handleRowClick = (teacher) => {
    setIsEditingTeacher(teacher);
    setIsEditing(true);
  };

  return (
    <div className="overflow-x-auto">
      {teacherAccounts && teacherAccounts.length > 0 ? (
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
      ) : (
        <div className="display: flex justify-center items-start h-screen">
          <div style={{ transform: "translateY(100%)" }}>
            <SatyamLoader />
          </div>
        </div>
      )}

      {isEditing && (
        <EditAccountModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          userData={editingTeacher}
          userRole={"Teacher"}
        />
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
};
export default TeacherTable;
