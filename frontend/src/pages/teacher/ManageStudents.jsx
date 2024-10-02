import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Set the app element for accessibility
Modal.setAppElement('#root');

const ManageStudents = () => {
  // Sample data for classes
  const [classes] = useState([
    { id: 1, name: 'Math Class', subject: 'Mathematics' },
    { id: 2, name: 'Science Class', subject: 'Science' },
    { id: 3, name: 'English Class', subject: 'English' },
  ]);

  const [students, setStudents] = useState([]); // Array of students for the selected class
  const [newStudent, setNewStudent] = useState({ name: '', progress: 0, attendance: 0, lessons: 0 });
  const [editStudentId, setEditStudentId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(classes[0]); // Default selected class
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const addNewStudent = () => {
    if (!newStudent.name) return; // Basic validation
    setStudents([...students, { id: Date.now(), ...newStudent, classId: selectedClass.id }]);
    resetForm();
  };

  const editStudent = (student) => {
    setNewStudent(student);
    setEditStudentId(student.id);
    setIsModalOpen(true); // Open modal for editing
  };

  const updateStudent = () => {
    setStudents(students.map((student) => (student.id === editStudentId ? { ...student, ...newStudent } : student)));
    resetForm();
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const resetForm = () => {
    setNewStudent({ name: '', progress: 0, attendance: 0, lessons: 0 });
    setEditStudentId(null);
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Students</h2>

      {/* Class Selection */}
      <div className="mb-6">
        <label className="font-semibold mb-2 block">Select Class:</label>
        <select
          onChange={(e) => setSelectedClass(classes.find((cls) => cls.id === Number(e.target.value)))}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        >
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} ({cls.subject})
            </option>
          ))}
        </select>
      </div>

      <h3 className="text-lg font-semibold mb-4">Students in {selectedClass.name}:</h3>

      {/* Student List Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Student Name</th>
              <th className="border border-gray-300 p-2">Progress (%)</th>
              <th className="border border-gray-300 p-2">Attendance (%)</th>
              <th className="border border-gray-300 p-2">Lessons Completed (%)</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students
                .filter(student => student.classId === selectedClass.id) // Filter students by selected class
                .map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="border border-gray-300 p-2">{student.name}</td>
                    <td className="border border-gray-300 p-2">{student.progress}%</td>
                    <td className="border border-gray-300 p-2">{student.attendance}%</td>
                    <td className="border border-gray-300 p-2">{student.lessons}%</td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex justify-around">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                          onClick={() => {
                            editStudent(student);
                            setIsModalOpen(true); // Open modal for editing
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                          onClick={() => deleteStudent(student.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-gray-500 text-center p-4">No students found in this class.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Button */}
      <button
        onClick={() => setIsModalOpen(true)} // Open modal for adding a new student
        className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
      >
        <FaPlus /> Add New Student
      </button>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={resetForm}
        className="bg-white shadow-lg rounded-lg p-6 z-index-100 w-1/2 mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-lg font-semibold mb-4">{editStudentId ? 'Edit Student' : 'Add New Student'}</h2>
        <input
          type="text"
          placeholder="Student Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="number"
            placeholder="Academic Progress (%)"
            value={newStudent.progress}
            onChange={(e) => setNewStudent({ ...newStudent, progress: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Attendance (%)"
            value={newStudent.attendance}
            onChange={(e) => setNewStudent({ ...newStudent, attendance: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Lessons Completed (%)"
            value={newStudent.lessons}
            onChange={(e) => setNewStudent({ ...newStudent, lessons: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <button
          onClick={editStudentId ? updateStudent : addNewStudent}
          className={`bg-${editStudentId ? 'blue' : 'green'}-500 text-white px-3 py-1.5 rounded-lg hover:bg-${editStudentId ? 'blue' : 'green'}-600 transition`}
        >
         {editStudentId ? 'Update Student' : 'Add'}
        </button>
        <button onClick={resetForm} className="bg-gray-300 text-black px-3 py-1.5 rounded-lg hover:bg-gray-400 transition ml-4">
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default ManageStudents;
