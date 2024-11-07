import React, { useState } from "react";

function EditAccountModal({ isOpen, onClose, onSave, userData, userRole }) {
  const [formData, setFormData] = useState({
    username: userData.username || "",
    firstName: userData.first_name || "",
    lastName: userData.last_name || "",
    email: userData.email || "",
    contactNo: userData.contact_no || "",
    branch: userData.branch_name || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Edit {userRole} Information
        </h2>

        <div className="flex">
          {/* Username */}
          <label className="block mb-2 mr-2 w-1/2">
            <span className="text-gray-700 font-semibold">Username</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Branch */}
          <label className="block mb-4 w-1/2">
            <span className="text-gray-700 font-semibold">Branch</span>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex">
          {/* First Name */}
          <label className="block mb-2 mr-2 w-1/2">
            <span className="text-gray-700 font-semibold">First Name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Last Name */}
          <label className="block mb-2 w-1/2">
            <span className="text-gray-700 font-semibold">Last Name</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Email */}
        <label className="block mb-2">
          <span className="text-gray-700 font-semibold">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* Contact No */}
        <label className="block mb-2">
          <span className="text-gray-700 font-semibold">Contact No</span>
          <input
            type="tel"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAccountModal;
