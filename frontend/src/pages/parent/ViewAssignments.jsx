import React, { useState, useEffect } from 'react';
import { FaBook, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaSearch, FaSort, FaDownload, FaEye, FaComment } from 'react-icons/fa';

const ViewAssignments = ({ darkMode }) => {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    // Simulating API call
    const data = [
      { id: 1, title: 'Math Homework', subject: 'Mathematics', dueDate: '2023-06-15', status: 'completed', grade: 'A', description: 'Complete exercises 1-10 on page 45.' },
      { id: 2, title: 'Science Project', subject: 'Science', dueDate: '2023-06-20', status: 'pending', description: 'Create a model of the solar system.' },
      { id: 3, title: 'History Essay', subject: 'History', dueDate: '2023-06-18', status: 'completed', grade: 'B+', description: 'Write a 1000-word essay on the Industrial Revolution.' },
      { id: 4, title: 'English Book Report', subject: 'English', dueDate: '2023-06-25', status: 'pending', description: 'Read "To Kill a Mockingbird" and write a report.' },
    ];
    setAssignments(data);
  };

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

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignment(null);
  };

  const handleDownload = (assignmentId) => {
    console.log(`Downloading assignment ${assignmentId}`);
    // Implement download logic here
  };

  const handleAddComment = (assignmentId, comment) => {
    console.log(`Adding comment to assignment ${assignmentId}: ${comment}`);
    // Implement comment addition logic here
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = filter === 'all' || assignment.status === filter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedAssignments = filteredAssignments.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className={`p-4 md:p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-600">Assignments</h1>
      
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center mb-2 md:mb-0 w-full md:w-auto">
          <label htmlFor="filter" className="mr-2">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`p-2 rounded w-full md:w-auto ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border border-orange-300`}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="relative w-full md:w-auto mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Search assignments..."
            className={`pl-10 pr-4 py-2 rounded-lg w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} border border-orange-300`}
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-orange-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-orange-200 text-orange-800">
            <tr>
              <th className="p-2 text-left cursor-pointer">
                Title <FaSort className="inline ml-1" onClick={() => handleSort('title')} />
              </th>
              <th className="p-2 text-left cursor-pointer">
                Subject <FaSort className="inline ml-1" onClick={() => handleSort('subject')} />
              </th>
              <th className="p-2 text-left cursor-pointer">
                Due Date <FaSort className="inline ml-1" onClick={() => handleSort('dueDate')} />
              </th>
              <th className="p-2 text-left cursor-pointer">
                Status <FaSort className="inline ml-1" onClick={() => handleSort('status')} />
              </th>
              <th className="p-2 text-left">Grade</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssignments.map(assignment => (
              <AssignmentRow 
                key={assignment.id} 
                assignment={assignment} 
                darkMode={darkMode} 
                onViewDetails={handleViewDetails}
                onDownload={handleDownload}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedAssignment && (
        <AssignmentModal 
          assignment={selectedAssignment} 
          onClose={handleCloseModal} 
          darkMode={darkMode}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

const AssignmentRow = ({ assignment, darkMode, onViewDetails, onDownload }) => {
  return (
    <tr className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-orange-50'} transition-colors`}>
      <td className="p-2 border-b border-orange-200">
        <div className="flex items-center">
          <FaBook className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          {assignment.title}
        </div>
      </td>
      <td className="p-2 border-b border-orange-200">{assignment.subject}</td>
      <td className="p-2 border-b border-orange-200">
        <div className="flex items-center">
          <FaCalendarAlt className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          {assignment.dueDate}
        </div>
      </td>
      <td className="p-2 border-b border-orange-200">
        <div className="flex items-center">
          {assignment.status === 'completed' ? (
            <FaCheckCircle className="mr-2 text-green-500" />
          ) : (
            <FaExclamationCircle className="mr-2 text-yellow-500" />
          )}
          <span className="capitalize">{assignment.status}</span>
        </div>
      </td>
      <td className="p-2 border-b border-orange-200">
        {assignment.grade && (
          <span className="font-semibold">{assignment.grade}</span>
        )}
      </td>
      <td className="p-2 border-b border-orange-200">
        <button onClick={() => onViewDetails(assignment)} className="mr-2 text-blue-500 hover:text-blue-700">
          <FaEye />
        </button>
        <button onClick={() => onDownload(assignment.id)} className="text-green-500 hover:text-green-700">
          <FaDownload />
        </button>
      </td>
    </tr>
  );
};

const AssignmentModal = ({ assignment, onClose, darkMode, onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmitComment = () => {
    onAddComment(assignment.id, comment);
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4 md:p-6 rounded-lg max-w-2xl w-full max-h-full overflow-y-auto`}>
        <h2 className="text-xl md:text-2xl font-bold mb-4">{assignment.title}</h2>
        <p><strong>Subject:</strong> {assignment.subject}</p>
        <p><strong>Due Date:</strong> {assignment.dueDate}</p>
        <p><strong>Status:</strong> {assignment.status}</p>
        {assignment.grade && <p><strong>Grade:</strong> {assignment.grade}</p>}
        <p><strong>Description:</strong> {assignment.description}</p>
        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
            rows="3"
          ></textarea>
          <button 
            onClick={handleSubmitComment}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
          >
            Add Comment
          </button>
        </div>
        <button 
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full md:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewAssignments;
