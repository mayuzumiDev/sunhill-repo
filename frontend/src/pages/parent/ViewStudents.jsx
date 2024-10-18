import React, { useState, useEffect } from 'react';
import { FaUser, FaBook, FaCalendarAlt, FaGraduationCap, FaChartLine, FaSearch, FaSort, FaEye, FaFilter, FaBell, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ViewStudents = ({ darkMode }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterGrade, setFilterGrade] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    // Fetch students data from API or context
    // This is a placeholder. Replace with actual API calls.
    setStudents([
      { id: 1, name: 'John Doe', grade: '10th', recentGrade: 'A', upcomingAssignment: 'Math Project', attendance: '95%' },
      { id: 2, name: 'Jane Doe', grade: '8th', recentGrade: 'B+', upcomingAssignment: 'Science Report', attendance: '98%' },
      { id: 3, name: 'Alice Smith', grade: '9th', recentGrade: 'A-', upcomingAssignment: 'History Essay', attendance: '92%' },
      { id: 4, name: 'Bob Johnson', grade: '10th', recentGrade: 'B', upcomingAssignment: 'English Presentation', attendance: '90%' },
      { id: 5, name: 'Charlie Brown', grade: '8th', recentGrade: 'A+', upcomingAssignment: 'Art Project', attendance: '97%' },
    ]);
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
    setSelectedStudents(prevSelected => 
      prevSelected.includes(studentId)
        ? prevSelected.filter(id => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleBulkAction = (action) => {
    // Implement bulk actions (e.g., send notification, message)
    console.log(`Bulk ${action} for students:`, selectedStudents);
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
      
      <div className="mb-4 flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search students..."
            className={`w-full sm:w-auto pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex flex-wrap items-center mb-4 sm:mb-0">
          <FaFilter className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          <select
            value={filterGrade}
            onChange={handleFilterChange}
            className={`mr-4 p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            <option value="">All Grades</option>
            <option value="8th">8th Grade</option>
            <option value="9th">9th Grade</option>
            <option value="10th">10th Grade</option>
          </select>
          <button
            onClick={() => handleSort('name')}
            className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}
          >
            Sort by Name <FaSort />
          </button>
          <button
            onClick={() => handleSort('grade')}
            className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`}
          >
            Sort by Grade <FaSort />
          </button>
        </div>
        <div className="flex flex-wrap items-center mt-4 sm:mt-0">
          <button
            onClick={() => handleBulkAction('notify')}
            className={`mr-2 mb-2 sm:mb-0 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}
            disabled={selectedStudents.length === 0}
          >
            <FaBell className="mr-1 inline" />
            Notify Selected
          </button>
          <button
            onClick={() => handleBulkAction('message')}
            className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`}
            disabled={selectedStudents.length === 0}
          >
            <FaEnvelope className="mr-1 inline" />
            Message Selected
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sortedStudents.map(student => (
          <StudentCard 
            key={student.id} 
            student={student} 
            darkMode={darkMode}
            isSelected={selectedStudents.includes(student.id)}
            onSelect={() => handleStudentSelection(student.id)}
          />
        ))}
      </div>
    </div>
  );
};

const StudentCard = ({ student, darkMode, isSelected, onSelect }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} ${isSelected ? 'border-2 border-orange-500' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="mr-2"
          />
          <FaUser className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          <h2 className="text-lg sm:text-xl font-semibold">{student.name}</h2>
        </div>
        <Link to={`/student/${student.id}`} className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
          <FaEye />
        </Link>
      </div>
      <div className="flex items-center mb-2">
        <FaGraduationCap className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
        <p>Grade: {student.grade}</p>
      </div>
      <div className="flex items-center mb-2">
        <FaChartLine className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
        <p>Recent Grade: {student.recentGrade}</p>
      </div>
      <div className="flex items-center mb-2">
        <FaBook className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
        <p className="truncate">Upcoming: {student.upcomingAssignment}</p>
      </div>
      <div className="flex items-center mt-4">
        <FaCalendarAlt className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
        <p>Attendance: {student.attendance}</p>
      </div>
    </div>
  );
};

export default ViewStudents;
