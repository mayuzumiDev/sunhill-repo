import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import ConfirmDeleteModal from "../../modal/teacher/ConfirmDeleteModal";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSpinner,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";

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
  }, [isOpen, classroom?.id]);

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
        setShowConfirmDelete(false);
        await fetchClassroomStudents();
      }
    } catch (error) {
      console.error(
        "An error occurred removing student from the classroom.",
        error
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {classroom.grade_level} - {classroom.class_section}
              </h2>
              <div className="bg-white/10 rounded-lg p-3">
                <h3 className="text-white text-sm font-medium mb-1">Subject</h3>
                <p className="text-white/90 text-sm">
                  {classroom.subject_name_display}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                    <tr>
                      <td colSpan="1" className="px-4 md:px-6 py-8 text-center">
                        <div className="flex justify-center items-center space-x-3">
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className="animate-spin text-blue-500 text-xl"
                          />
                          <span className="text-gray-500">
                            Loading students...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : classroomStudents.length === 0 ? (
                    <tr>
                      <td colSpan="1" className="px-4 md:px-6 py-8 text-center">
                        <div className="flex flex-col items-center text-gray-500">
                          <FontAwesomeIcon
                            icon={faUserGraduate}
                            className="text-3xl mb-2 text-gray-400"
                          />
                          <p>No students found in this classroom</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    classroomStudents.map((student) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{
                          backgroundColor: "rgba(243, 244, 246, 0.5)",
                        }}
                      >
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm md:text-base font-medium text-gray-900">
                            {student.student.last_name},{" "}
                            {student.student.first_name}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedStudentId(student.id);
                              setShowConfirmDelete(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Remove
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 shadow-lg"
              >
                Close
              </motion.button>
            </div>
          </div>

          {/* Confirm Delete Modal */}
          <ConfirmDeleteModal
            isOpen={showConfirmDelete}
            onClose={() => setShowConfirmDelete(false)}
            onConfirm={() => handleRemoveStudent(selectedStudentId)}
            message="Are you sure you want to remove this student from the classroom?"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClassroomDetailsModal;
