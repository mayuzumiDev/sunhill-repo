import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap,
  FaChartLine,
  FaSearch,
  FaSort,
  FaEye,
  FaFilter,
  FaBell,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";

const ViewStudents = ({ darkMode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterGrade, setFilterGrade] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [uniqueGrades, setUniqueGrades] = useState([]);

  useEffect(() => {
    const fetchParentStudents = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/api/user-parent/current-parent/"
        );

        if (response.data.status === "success") {
          const studentData = response.data.data.student_info || [];
          const formattedStudents = studentData.map((student) => ({
            id: student.student_info_id,
            name: `${student.first_name} ${student.last_name}`,
            grade: student.grade_level,
            email: student.email,
            profile_image: student.user_info?.profile_image,
            branch_name: student.branch_name,
            recentGrade: "N/A",
            upcomingAssignment: "N/A",
            attendance: "N/A",
          }));
          setStudents(formattedStudents);

          const grades = [
            ...new Set(formattedStudents.map((student) => student.grade)),
          ].sort();
          setUniqueGrades(grades);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParentStudents();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (event) => {
    setFilterGrade(event.target.value);
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterGrade === "" || student.grade === filterGrade)
  );

  const sortedStudents = filteredStudents.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div
      className={`p-4 sm:p-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-orange-600">
        My Students
      </h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search students..."
            className="pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          value={filterGrade}
          onChange={handleFilterChange}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-800 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300"
        >
          <option value="">All Grades</option>
          {uniqueGrades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto rounded-lg shadow-md bg-white overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-orange-100 to-orange-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents(students.map((s) => s.id));
                    } else {
                      setSelectedStudents([]);
                    }
                  }}
                />
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name <FaSort className="ml-2" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("grade")}
              >
                <div className="flex items-center">
                  Grade <FaSort className="ml-2" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("grade")}
              >
                <div className="flex items-center">
                  Branch <FaSort className="ml-2" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8">
                  <div className="flex justify-center items-center">
                    <DotLoaderSpinner color="#f97316" />
                  </div>
                </td>
              </tr>
            ) : sortedStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              sortedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-orange-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelection(student.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {student.branch_name}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewStudents;
