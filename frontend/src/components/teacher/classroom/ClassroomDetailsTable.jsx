import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import ConfirmDeleteModal from "../../modal/teacher/ConfirmDeleteModal";
import { HiTrash } from "react-icons/hi";

const ClassroomDetailsTable = ({ classroom }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [classroomStudents, setClassroomStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    if (classroom?.id) {
      fetchClassroomStudents();
    } else {
      setClassroomStudents([]);
    }
  }, [classroom?.id]);

  const fetchClassroomStudents = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get(
        "/user-teacher/classroom/list-student/",
        {
          params: {
            classroom_id: classroom.id,
          },
        }
      );

      if (response.status === 200) {
        const studentList = response.data.classroom_student_list;
        console.log(studentList);
        setClassroomStudents(studentList);
      }
    } catch (error) {
      console.error(
        "An error occurred fetching the selected classroom students.",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = async (studentID) => {
    try {
      const response = await axiosInstance.delete(
        `/user-teacher/classroom/delete-student/${studentID}/`
      );

      if (response.status === 200) {
        console.log("Deleted successfully.");
        await fetchClassroomStudents();
      }
    } catch (error) {
      console.error(
        "An error occured removing student from the classroom.",
        error
      );
    }
  };

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-32 border-b-2 border-green-500/20"
              >
                Student ID
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-green-500/20"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 border-b-2 border-green-500/20"
              ></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <>
                {[1, 2, 3].map((index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-green-100 rounded w-20 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-green-100 rounded w-48"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-green-100 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : classroomStudents.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center">
                  <p className="text-lg text-gray-500">
                    No students found in this classroom
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Add students to get started
                  </p>
                </td>
              </tr>
            ) : (
              classroomStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {student.student.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {student.student.first_name} {student.student.last_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setShowConfirmDelete(true);
                      }}
                      className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors hover:bg-red-50 px-2 py-1 rounded"
                    >
                      <HiTrash className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => handleRemoveStudent(selectedStudentId)}
        message="Are you sure you want to remove this student from the classroom?"
      />
    </div>
  );
};

export default ClassroomDetailsTable;
