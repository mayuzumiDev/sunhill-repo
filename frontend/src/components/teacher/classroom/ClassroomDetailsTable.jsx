import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import ConfirmDeleteModal from "../../modal/teacher/ConfirmDeleteModal";
import { HiTrash } from "react-icons/hi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ClassroomDetailsTable = ({ classroom }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [classroomStudents, setClassroomStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate pagination values
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = classroomStudents.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(classroomStudents.length / rowsPerPage);

  // Handle page navigation
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
                className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-green-500/20"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-green-500/20"
              >
                Special Needs
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-green-500/20"
              >
                Details
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 border-b-2 border-green-500/20"
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
                      <div className="h-4 bg-green-100 rounded w-24 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-green-100 rounded w-32"></div>
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
              currentRows.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900 items-center">
                      {student.student.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 items-center">
                      {student.student.first_name} {student.student.last_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.student.has_special_needs
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.student.has_special_needs ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-500">
                      {student.student.special_needs_details || "-"}
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

      {/* Pagination Controls */}
      {!isLoading && classroomStudents.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {classroomStudents.length > 0 ? indexOfFirstRow + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastRow, classroomStudents.length)}
              </span>{" "}
              of <span className="font-medium">{classroomStudents.length}</span>{" "}
              students
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
