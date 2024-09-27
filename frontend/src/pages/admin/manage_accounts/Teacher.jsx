import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Teacher = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: "John Doe", subject: "Mathematics", branch: "Rosario", username: "john_doe", password: "password123" },
    { id: 2, name: "Jane Smith", subject: "Science", branch: "Batangas", username: "jane_smith", password: "password123" },
    { id: 3, name: "Emily Johnson", subject: "English", branch: "Tagaytay", username: "emily_j", password: "password123" },
    { id: 4, name: "Michael Brown", subject: "Mathematics", branch: "Batangas", username: "michael_b", password: "password123" },
    { id: 5, name: "Jessica Taylor", subject: "Science", branch: "Bauan", username: "jessica_t", password: "password123" },
  ]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "", branch: "", username: "", password: "" });

  const subjects = [...new Set(teachers.map((teacher) => teacher.subject))];
  const branches = [...new Set(teachers.map((teacher) => teacher.branch))];

  const handleSubjectChange = (e) => setSelectedSubject(e.target.value);
  const handleBranchChange = (e) => setSelectedBranch(e.target.value);

  const filteredTeachers = teachers.filter((teacher) => {
    const subjectMatch = selectedSubject ? teacher.subject === selectedSubject : true;
    const branchMatch = selectedBranch ? teacher.branch === selectedBranch : true;
    return subjectMatch && branchMatch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.subject && newTeacher.branch && newTeacher.username && newTeacher.password) {
      const newId = teachers.length ? teachers[teachers.length - 1].id + 1 : 1;
      setTeachers([...teachers, { id: newId, ...newTeacher }]);
      setNewTeacher({ name: "", subject: "", branch: "", username: "", password: "" });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl text-gray-800 font-bold mb-4">Manage Accounts</h1>
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Teachers</h2>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Add New Teacher
        </button>
      </div>

      <Filters
        subjects={subjects}
        selectedSubject={selectedSubject}
        handleSubjectChange={handleSubjectChange}
        branches={branches}
        selectedBranch={selectedBranch}
        handleBranchChange={handleBranchChange}
      />

      <TeacherTable filteredTeachers={filteredTeachers} />

      {isModalOpen && (
        <Modal
          newTeacher={newTeacher}
          handleInputChange={handleInputChange}
          handleAddTeacher={handleAddTeacher}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const Filters = ({ subjects, selectedSubject, handleSubjectChange, branches, selectedBranch, handleBranchChange }) => (
    <div className="flex flex-wrap mb-4">
      <div className="flex items-center mr-4 mb-2">
        <label htmlFor="subject" className="mr-2 text-sm text-gray-700">Filter by Subject:</label>
        <select
          id="subject"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">All</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center mb-2">
        <label htmlFor="branch" className="mr-2 text-sm text-gray-700">Filter by Branch:</label>
        <select
          id="branch"
          value={selectedBranch}
          onChange={handleBranchChange}
          className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">All</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>
      
    </div>
  );
  

const TeacherTable = ({ filteredTeachers }) => (
  <div className="overflow-x-auto">
    {filteredTeachers.length === 0 ? (
      <div className="text-center text-gray-500">No teachers found.</div>
    ) : (
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Subject</th>
            <th className="py-2 px-4 text-left">Branch</th>
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr key={teacher.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{teacher.id}</td>
              <td className="py-2 px-4">{teacher.name}</td>
              <td className="py-2 px-4">{teacher.subject}</td>
              <td className="py-2 px-4">{teacher.branch}</td>
              <td className="py-2 px-4">{teacher.username}</td>
              <td className="py-2 px-4 flex space-x-1">
                <button className="text-blue-500 hover:underline" aria-label="Edit Teacher">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-500 hover:underline" aria-label="Delete Teacher">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <style jsx>{`
        /* Hide scrollbar in all browsers */
        ::-webkit-scrollbar {
          display: none;
        }
        body {
          overflow: hidden; /* Prevent scrolling on the body */
        }
      `}</style>
  </div>

);

const Modal = ({ newTeacher, handleInputChange, handleAddTeacher, closeModal }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
    <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-1/3">
      <h2 className="text-lg font-semibold mb-4">Add New Teacher</h2>
      <input
        type="text"
        name="name"
        value={newTeacher.name}
        onChange={handleInputChange}
        placeholder="Name"
        className="border rounded p-2 mb-2 w-full"
      />
      <input
        type="text"
        name="subject"
        value={newTeacher.subject}
        onChange={handleInputChange}
        placeholder="Subject"
        className="border rounded p-2 mb-2 w-full"
      />
      <input
        type="text"
        name="branch"
        value={newTeacher.branch}
        onChange={handleInputChange}
        placeholder="Branch"
        className="border rounded p-2 mb-2 w-full"
      />
      <input
        type="text"
        name="username"
        value={newTeacher.username}
        onChange={handleInputChange}
        placeholder="Username"
        className="border rounded p-2 mb-2 w-full"
      />
      <input
        type="password"
        name="password"
        value={newTeacher.password}
        onChange={handleInputChange}
        placeholder="Password"
        className="border rounded p-2 mb-2 w-full"
      />
      <div className="flex justify-end">
        <button onClick={handleAddTeacher} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add</button>
        <button onClick={closeModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded ml-2 hover:bg-gray-400">Cancel</button>
      </div>
    </div>
  </div>
);
export default Teacher;
