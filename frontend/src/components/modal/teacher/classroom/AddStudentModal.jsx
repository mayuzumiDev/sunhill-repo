import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../../utils/axiosInstance";

const AddStudentModal = ({ isOpen, onClose, onAdd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

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

  const filteredStudents = students.filter((student) => {
    const nameMatch = getFullName(student)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const gradeMatch =
      !gradeFilter || student.student_info.grade_level === gradeFilter;

    const branchMatch = !branchFilter || student.branch_name === branchFilter;

    return nameMatch && gradeMatch && branchMatch;
  });

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

  const handleAddStudents = async () => {
    if (selectedStudents.length > 0) {
      setError("");

      const result = await onAdd({
        students: selectedStudents.map((student) => ({
          student: student.student_info.id,
        })),
      });

      if (result) {
        setError(result);
      } else {
        onClose();
      }
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl text-gray-800">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Students to Classroom</h2>
          <span className="text-sm text-gray-600">
            Selected: {selectedStudents.length} student(s)
          </span>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Filter Dropdown for Grade Level */}
            <select
              className="w-full p-2 border rounded"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="">All Grade Levels</option>
              {Array.from(
                new Set(students.map((s) => s.student_info.grade_level))
              )
                .sort()
                .map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
            </select>

            {/* Filter Dropdown for Branch */}
            <select
              className="w-full p-2 border rounded"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="">All Branches</option>
              {Array.from(new Set(students.map((s) => s.branch_name)))
                .sort()
                .map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
            </select>
          </div>

          {/* Students Table */}
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Grade Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Branch
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-block h-4 w-4 bg-gray-400/30 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-block h-4 w-32 bg-gray-400/30 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-block h-4 w-16 bg-gray-400/30 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-block h-4 w-16 bg-gray-400/30 animate-pulse rounded"></div>
                        </td>
                      </tr>
                    ))}
                  </>
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
                      <td className="px-6 py-4">{student.branch_name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mx-32 mb-4 p-3 bg-red-100 border text-center border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="p-4 border-t flex justify-center space-x-2">
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
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
