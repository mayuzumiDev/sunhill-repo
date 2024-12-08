import React, { useState } from "react";

function EditStudentModal({ isOpen, onClose, onSave, userData, userRole }) {
  const [formData, setFormData] = useState({
    id: userData.id,
    user_info_id: userData.user_info.id || "",
    student_info_id: userData.student_info.id || "",
    username: userData.username || "",
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    email: userData.email || "",
    contact_no: userData.user_info.contact_no || "",
    branch_name: userData.branch_name || "",
    grade_level: userData.student_info.grade_level || "",
    has_special_needs: userData.student_info.has_special_needs === true,
    special_needs_details: userData.student_info.special_needs_details || "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Handling change for ${name}:`, value, typeof value);

    if (name === "has_special_needs") {
      const boolValue = value === "true";
      console.log("Converting to boolean:", boolValue);
      setFormData((prev) => ({ ...prev, [name]: boolValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrorMessage("");
  };

  const handleSave = () => {
    console.log("Saving form data:", formData);
    // Check if the username is not empty and follows the required format
    if (!formData.username) {
      setErrorMessage("Username cannot be empty.");
      return;
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      setErrorMessage("Username must be between 3 and 20 characters.");
      return;
    }

    // Check if the email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Check if the contact number is a valid Philippine number (11 digits, starts with 09)
    const contactNoPattern = /^09\d{9}$/; // Must start with "09" and be 11 digits total
    if (formData.contact_no && !contactNoPattern.test(formData.contact_no)) {
      setErrorMessage("Please enter a valid contact number.");
      return;
    }
    // If all validations pass, call the onSave function
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">{userRole} Information</h2>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <div className="flex">
          <label className="block mb-4 mr-2 w-1/2">
            <span className="text-gray-700 font-semibold">
              {userRole} ID:{" "}
              <span className="text-gray-700">{userData.student_info_id}</span>
            </span>
          </label>
        </div>

        <div className="flex">
          {/* Username */}
          <label className="block mb-2 mr-2 w-1/2">
            <span className="text-gray-700 font-semibold">
              Username <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="username"
              minLength="3"
              maxLength="20"
              required
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
              name="branch_name"
              value={formData.branch_name}
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
              name="first_name"
              minLength="2"
              maxLength="50"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Last Name */}
          <label className="block mb-2 w-1/2">
            <span className="text-gray-700 font-semibold">Last Name</span>
            <input
              type="text"
              name="last_name"
              minLength="2"
              maxLength="50"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex">
          {/* Grade Level */}
          <label className="block mb-2 mr-2 w-1/2">
            <span className="text-gray-700 font-semibold">Grade Level</span>
            <input
              type="text"
              name="grade_level"
              value={formData.grade_level}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex">
          {/* Has Special Needs */}
          <label className="block mb-2 mr-2 w-1/2">
            <span className="text-gray-700 font-semibold">
              Has Special Needs
            </span>
            <select
              name="has_special_needs"
              value={String(formData.has_special_needs)}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </label>

          {/* Special Needs Details */}
          <label className="block mb-2 w-1/2">
            <span className="text-gray-700 font-semibold">
              Special Needs Details
            </span>
            <input
              type="text"
              name="special_needs_details"
              value={formData.special_needs_details}
              onChange={handleChange}
              maxLength="50"
              placeholder="Enter details if applicable"
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex">
          {/* Email */}
          <label className="block mb-2 mr-2 w-1/2">
            <span className="text-gray-700 font-semibold">Email</span>
            <input
              type="email"
              name="email"
              minLength="5"
              maxLength="255"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Contact No */}
          <label className="block mb-2 w-1/2">
            <span className="text-gray-700 font-semibold">Contact No</span>
            <input
              type="tel"
              name="contact_no"
              minLength="11"
              maxLength="15"
              value={formData.contact_no}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

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

export default EditStudentModal;
