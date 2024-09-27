import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Parent = () => {
  const [parents, setParents] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210" },
  ]);

  const [newParent, setNewParent] = useState({ id: null, name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle input changes for parent details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParent((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update parent based on whether we're editing or adding a new one
  const handleAddParent = () => {
    if (newParent.name && newParent.email && newParent.phone) {
      if (isEditing) {
        // Update existing parent
        setParents(parents.map((parent) => (parent.id === newParent.id ? newParent : parent)));
        setIsEditing(false);
      } else {
        // Add new parent
        const newId = parents.length ? parents[parents.length - 1].id + 1 : 1;
        setParents([...parents, { id: newId, ...newParent }]);
      }
      // Reset input fields and close modal
      setNewParent({ id: null, name: "", email: "", phone: "" });
      setIsModalOpen(false);
    }
  };

  // Prepare to edit a parent's details
  const handleEditParent = (parent) => {
    setNewParent(parent);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Delete a parent account
  const handleDeleteParent = (id) => {
    setParents(parents.filter((parent) => parent.id !== id));
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl text-gray-800 font-bold mb-4">Manage Parents</h1>
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Parents</h2>

      <button
        onClick={() => {
          setNewParent({ id: null, name: "", email: "", phone: "" });
          setIsEditing(false);
          setIsModalOpen(true);
        }}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition mt-4"
      >
        Add New Parent
      </button>

      <ParentTable 
        parents={parents} 
        onEditParent={handleEditParent} 
        onDeleteParent={handleDeleteParent} 
      />

      {isModalOpen && (
        <Modal
          newParent={newParent}
          handleInputChange={handleInputChange}
          handleAddParent={handleAddParent}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const ParentTable = ({ parents, onEditParent, onDeleteParent }) => (
  <div className="overflow-x-auto mt-4">
    {parents.length === 0 ? (
      <div className="text-center text-gray-500">No parents found.</div>
    ) : (
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Phone</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parents.map((parent) => (
            <tr key={parent.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{parent.id}</td>
              <td className="py-2 px-4">{parent.name}</td>
              <td className="py-2 px-4">{parent.email}</td>
              <td className="py-2 px-4">{parent.phone}</td>
              <td className="py-2 px-4 flex space-x-1">
                <button 
                  className="text-blue-500 hover:underline" 
                  aria-label="Edit Parent" 
                  onClick={() => onEditParent(parent)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="text-red-500 hover:underline" 
                  aria-label="Delete Parent" 
                  onClick={() => onDeleteParent(parent.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const Modal = ({ newParent, handleInputChange, handleAddParent, closeModal }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
      <h2 className="text-lg font-semibold mb-4">{newParent.id ? "Edit Parent" : "Add New Parent"}</h2>
      {["name", "email", "phone"].map((field) => (
        <div className="mb-4" key={field}>
          <label className="block mb-1 text-sm" htmlFor={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            value={newParent[field]}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
      ))}
      <div className="flex justify-between">
        <button 
          onClick={handleAddParent} 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {newParent.id ? "Update Parent" : "Add Parent"}
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

export default Parent;
