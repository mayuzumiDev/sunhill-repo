import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import ConfirmDeleteModal from "../../modal/teacher/ConfirmDeleteModal";
import { HiTrash } from "react-icons/hi";

const ClassroomDetailsModal = ({ isOpen, onClose, classroom }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [classroomStudents, setClassroomStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchClassroomStudents();
    } else {
      setClassroomStudents([]);
    }
  }, [isOpen, classroom.id]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full mx-4 transform transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                {classroom.grade_level} - {classroom.class_section}
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                {classroom.subject_name_display}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
            >
              Close
            </button>
          </div>
        </div>

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
    </div>
  );
};

export default ClassroomDetailsModal;
