import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Student = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      grade: "5",
      branch: "Rosario",
      email: "alice@example.com",
      password: "password123",
    },
    {
      id: 2,
      name: "Bob Smith",
      grade: "4",
      branch: "Batangas",
      email: "bob@example.com",
      password: "password123",
    },
    {
      id: 3,
      name: "Charlie Brown",
      grade: "6",
      branch: "Tagaytay",
      email: "charlie@example.com",
      password: "password123",
    },
  ]);

  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    id: null,
    name: "",
    grade: "",
    branch: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const grades = [...new Set(students.map((student) => student.grade))];
  const branches = [...new Set(students.map((student) => student.branch))];

  const handleGradeChange = (e) => setSelectedGrade(e.target.value);
  const handleBranchChange = (e) => setSelectedBranch(e.target.value);

  const filteredStudents = students.filter((student) => {
    const gradeMatch = selectedGrade ? student.grade === selectedGrade : true;
    const branchMatch = selectedBranch
      ? student.branch === selectedBranch
      : true;
    return gradeMatch && branchMatch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = () => {
    if (
      newStudent.name &&
      newStudent.grade &&
      newStudent.branch &&
      newStudent.email &&
      newStudent.password
    ) {
      if (isEditing) {
        setStudents(
          students.map((student) =>
            student.id === newStudent.id ? newStudent : student
          )
        );
        setIsEditing(false);
      } else {
        const newId = students.length
          ? students[students.length - 1].id + 1
          : 1;
        setStudents([...students, { id: newId, ...newStudent }]);
      }
      setNewStudent({
        id: null,
        name: "",
        grade: "",
        branch: "",
        email: "",
        password: "",
      });
      setIsModalOpen(false);
    }
  };

  const handleEditStudent = (student) => {
    setNewStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl text-gray-800 font-bold mb-4">Manage Students</h1>
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Students</h2>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => {
            setNewStudent({
              id: null,
              name: "",
              grade: "",
              branch: "",
              email: "",
              password: "",
            });
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Add New Student
        </button>
      </div>

      <Filters
        grades={grades}
        selectedGrade={selectedGrade}
        handleGradeChange={handleGradeChange}
        branches={branches}
        selectedBranch={selectedBranch}
        handleBranchChange={handleBranchChange}
      />

      <StudentTable
        filteredStudents={filteredStudents}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      {isModalOpen && (
        <Modal
          newStudent={newStudent}
          handleInputChange={handleInputChange}
          handleAddStudent={handleAddStudent}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const Filters = ({
  grades,
  selectedGrade,
  handleGradeChange,
  branches,
  selectedBranch,
  handleBranchChange,
}) => (
  <div className="flex flex-wrap mb-4">
    <div className="flex items-center mr-4 mb-2">
      <label htmlFor="grade" className="mr-2 text-sm text-gray-700">
        Filter by Grade:
      </label>
      <select
        id="grade"
        value={selectedGrade}
        onChange={handleGradeChange}
        className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="">All</option>
        {grades.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </div>
    <div className="flex items-center mb-2">
      <label htmlFor="branch" className="mr-2 text-sm text-gray-700">
        Filter by Branch:
      </label>
      <select
        id="branch"
        value={selectedBranch}
        onChange={handleBranchChange}
        className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="">All</option>
        {branches.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const StudentTable = ({ filteredStudents, onEditStudent, onDeleteStudent }) => (
  <div className="overflow-x-auto">
    {filteredStudents.length === 0 ? (
      <div className="text-center text-gray-500">No students found.</div>
    ) : (
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Grade</th>
            <th className="py-2 px-4 text-left">Branch</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{student.id}</td>
              <td className="py-2 px-4">{student.name}</td>
              <td className="py-2 px-4">{student.grade}</td>
              <td className="py-2 px-4">{student.branch}</td>
              <td className="py-2 px-4">{student.email}</td>
              <td className="py-2 px-4 flex space-x-1">
                <button
                  className="text-blue-500 hover:underline"
                  aria-label="Edit Student"
                  onClick={() => onEditStudent(student)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="text-red-500 hover:underline"
                  aria-label="Delete Student"
                  onClick={() => onDeleteStudent(student.id)}
                >
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

const Modal = ({
  newStudent,
  handleInputChange,
  handleAddStudent,
  closeModal,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
      <h2 className="text-lg font-semibold mb-4">Add New Student</h2>
      {["name", "grade", "branch", "email", "password"].map((field) => (
        <div className="mb-4" key={field}>
          <label className="block mb-1 text-sm" htmlFor={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          <input
            type={field === "password" ? "password" : "text"}
            name={field}
            value={newStudent[field]}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
      ))}
      <div className="flex justify-between">
        <button
          onClick={handleAddStudent}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {newStudent.id ? "Update Student" : "Add Student"}
        </button>
        <button
          onClick={closeModal}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Student;
