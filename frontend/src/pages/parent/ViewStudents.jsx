import React, { useState, useEffect } from 'react';
import { FaUser, FaBook, FaCalendarAlt, FaGraduationCap, FaChartLine, FaSearch, FaSort, FaEye, FaFilter, FaBell, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { axiosInstance } from "../../utils/axiosInstance";

const ViewStudents = ({ darkMode }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterGrade, setFilterGrade] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchParentStudents = async () => {
      try {
        const response = await axiosInstance.get('/api/user-parent/current-parent/');
        
        if (response.data.status === 'success') {
          const studentData = response.data.data.student_info || [];
          const formattedStudents = studentData.map(student => ({
            id: student.student_info_id,
            name: `${student.first_name} ${student.last_name}`,
            grade: student.grade_level,
            email: student.email,
            profile_image: student.user_info?.profile_image,
            recentGrade: 'N/A',
            upcomingAssignment: 'N/A',
            attendance: 'N/A'
          }));
          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchParentStudents();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (event) => {
    setFilterGrade(event.target.value);
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prevSelected => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter(id => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterGrade === '' || student.grade === filterGrade)
  );

  const sortedStudents = filteredStudents.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-orange-600">My Students</h1>
      
      {/* Search and filter controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search students..."
            className={`pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          value={filterGrade}
          onChange={handleFilterChange}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          <option value="">All Grades</option>
          <option value="8th">8th Grade</option>
          <option value="9th">9th Grade</option>
          <option value="10th">10th Grade</option>
        </select>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <thead>
            <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents(students.map(s => s.id));
                    } else {
                      setSelectedStudents([]);
                    }
                  }}
                />
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Name <FaSort className="ml-2" />
                </div>
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('grade')}>
                <div className="flex items-center">
                  Grade <FaSort className="ml-2" />
                </div>
              </th>
              <th className="p-3 text-left">Recent Grade</th>
              <th className="p-3 text-left">Upcoming Assignment</th>
              <th className="p-3 text-left">Attendance</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map(student => (
              <tr 
                key={student.id} 
                className={`border-b ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-orange-50'}`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentSelection(student.id)}
                  />
                </td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.grade}</td>
                <td className="p-3">{student.recentGrade}</td>
                <td className="p-3">{student.upcomingAssignment}</td>
                <td className="p-3">{student.attendance}</td>
                <td className="p-3">
                  <Link 
                    to={`/student/${student.id}`} 
                    className={`${darkMode ? 'text-orange-400' : 'text-orange-600'} hover:text-orange-500`}
                  >
                    <FaEye className="inline mr-2" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewStudents;
