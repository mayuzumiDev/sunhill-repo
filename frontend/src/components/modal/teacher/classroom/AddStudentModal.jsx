import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../../utils/axiosInstance";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

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

  const handleSelectAll = (checked) => {
    if (checked) {
      // Add all filtered students that aren't already selected
      const newSelections = [...selectedStudents];
      filteredStudents.forEach((student) => {
        if (!selectedStudents.some((s) => s.id === student.id)) {
          newSelections.push(student);
        }
      });
      setSelectedStudents(newSelections);
    } else {
      // Remove all filtered students from selection
      const newSelections = selectedStudents.filter(
        (selected) =>
          !filteredStudents.some((filtered) => filtered.id === selected.id)
      );
      setSelectedStudents(newSelections);
    }
  };

  // Check if all filtered students are selected
  const areAllFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) =>
      selectedStudents.some((selected) => selected.id === student.id)
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-[90rem] shadow-xl transform transition-all">
        <div className="bg-gradient-to-r from-green-700 to-green-400 p-6 rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Add Students to Classroom
          </h2>
          <span className="text-sm text-white/90">
            Selected: {selectedStudents.length} student(s)
          </span>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Search Student
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Grade Level Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Grade Level
              </label>
              <Listbox value={gradeFilter} onChange={setGradeFilter}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200">
                    <span className="block truncate text-sm text-gray-700">
                      {gradeFilter || "All Grade Levels"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                      <Listbox.Option
                        value=""
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-700"
                          }`
                        }
                      >
                        All Grade Levels
                      </Listbox.Option>
                      {Array.from(
                        new Set(students.map((s) => s.student_info.grade_level))
                      )
                        .sort()
                        .map((grade) => (
                          <Listbox.Option
                            key={grade}
                            value={grade}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                                active
                                  ? "bg-green-50 text-green-700"
                                  : "text-gray-700"
                              }`
                            }
                          >
                            {grade}
                          </Listbox.Option>
                        ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Branch
              </label>
              <Listbox value={branchFilter} onChange={setBranchFilter}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200">
                    <span className="block truncate text-sm text-gray-700">
                      {branchFilter || "All Branches"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                      <Listbox.Option
                        value=""
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-700"
                          }`
                        }
                      >
                        All Branches
                      </Listbox.Option>
                      {Array.from(new Set(students.map((s) => s.branch_name)))
                        .sort()
                        .map((branch) => (
                          <Listbox.Option
                            key={branch}
                            value={branch}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                                active
                                  ? "bg-green-50 text-green-700"
                                  : "text-gray-700"
                              }`
                            }
                          >
                            {branch}
                          </Listbox.Option>
                        ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Students Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={areAllFilteredSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-200"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Has Special Needs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Grade Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="inline-block h-4 w-16 bg-gray-400/30 animate-pulse rounded"></div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                      >
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedStudents.some((s) => s.id === student.id)
                            ? "bg-green-50"
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
                            className="rounded border-gray-300 text-green-600 focus:ring-green-200"
                          />
                        </td>
                        <td className="px-6 py-4">{getFullName(student)}</td>
                        <td className="px-6 py-4">
                          {student.student_info.has_special_needs
                            ? "Yes"
                            : "No"}
                        </td>
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
            <div className="p-3 bg-red-50 border border-red-200 text-center text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center space-x-3 pt-4">
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                selectedStudents.length > 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleAddStudents}
              disabled={selectedStudents.length === 0}
            >
              Add {selectedStudents.length} Student(s)
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
