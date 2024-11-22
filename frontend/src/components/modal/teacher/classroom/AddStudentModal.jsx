import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../../utils/axiosInstance";

const AddStudentModal = ({ isOpen, onClose, onAdd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      setSelectedStudents([]);
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get("/user-admin/student-list/");

      if (response.status === 200) {
        const studentList = response.data.student_list;
        setStudents(studentList);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFullName = (student) => {
    return `${student.first_name} ${student.last_name}`.trim();
  };

  const filteredStudents = students.filter((student) =>
    getFullName(student).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentSelect = (student) => {
    setSelectedStudents((prev) => {
      const isSelected = prev.some((s) => s.id === student.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleAddStudents = () => {
    if (selectedStudents.length > 0) {
      onAdd({
        students: selectedStudents.map((student) => ({
          student: student.student_info.id,
        })),
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Students to Classroom</h2>
          <span className="text-sm text-gray-600">
            Selected: {selectedStudents.length} student(s)
          </span>
        </div>

        <div className="p-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search students..."
            className="w-full p-2 border rounded mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Students Table */}
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Grade Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 whitespace-nowrap text-center"
                    >
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-400"></div>
                        <span className="text-gray-500">
                          Loading students...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      Student list is empty.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedStudents.some((s) => s.id === student.id)
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() => handleStudentSelect(student)}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.some(
                            (s) => s.id === student.id
                          )}
                          onChange={() => handleStudentSelect(student)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-6 py-4">{getFullName(student)}</td>
                      <td className="px-6 py-4">
                        {student.student_info.grade_level}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedStudents.length > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleAddStudents}
            disabled={selectedStudents.length === 0}
          >
            Add {selectedStudents.length} Student(s)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
