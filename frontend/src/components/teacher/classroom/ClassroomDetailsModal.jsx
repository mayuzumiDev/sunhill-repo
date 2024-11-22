import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import ConfirmDeleteModal from "../../modal/teacher/ConfirmDeleteModal";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {classroom.grade_level} - {classroom.class_section}
          </h2>
          <div>
            <h3 className="font-semibold text-lg">Subject</h3>
            <p>{classroom.subject_name_display}</p>
          </div>
        </div>

        {/* Table for the Added Student to Classroom */}
        <div className="space-y-4">
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-32"
                  >
                    Student ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-full"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                  ></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-block h-4 w-24 bg-gray-400/30 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-block h-4 w-64 bg-gray-400/30 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-block h-4 w-8 bg-gray-400/30 animate-pulse rounded"></div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : classroomStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      No students found in this classroom
                    </td>
                  </tr>
                ) : (
                  classroomStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {student.student.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.student.first_name}{" "}
                          {student.student.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => {
                            setSelectedStudentId(student.id);
                            setShowConfirmDelete(true);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Delete confirm */}
        <ConfirmDeleteModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={() => handleRemoveStudent(selectedStudentId)}
          message={"Are you sure to remove this student?"}
        />

        {/* Button for Closing the Modal */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 font-bold text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetailsModal;
