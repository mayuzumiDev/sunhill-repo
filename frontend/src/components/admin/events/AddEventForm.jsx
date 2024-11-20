import React, { useState } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import SchawnnahJLoader from "../../../components/loaders/SchawnnahJLoader";

const AddEventForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    target_audience: "all",
    branch: "all",
    location: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);

      // Format the date to ISO string format
      const submissionData = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        attachment: null,  // Set optional fields to null
        expiry_date: null
      };

      const response = await axiosInstance.post(
        "/user-admin/event/create/",
        submissionData
      );

      if (response.status === 201) {
        setFormData({
          title: "",
          description: "",
          date: "",
          target_audience: "all",
          branch: "all",
          location: "",
        });

        onClose();
        onSave();
      }
    } catch (error) {
      console.error("Error saving event:", error);
      const errorMessage = error.response?.data?.errors?.date || 
                          error.response?.data?.message || 
                          "Failed to create event. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="font-montserrat fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 relative">
        {isLoading && <SchawnnahJLoader />}
        {/* Header */}
        <div className="flex justify-center items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Event & Announcements
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleChange}
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter a description"
                value={formData.description}
                onChange={handleChange}
                maxLength={200}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-4">
              {/* Date and Time */}
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Target Audience */}
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="parents">Parents</option>
                </select>
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Branch
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="all">All</option>
                <option value="batangas">Batangas</option>
                <option value="rosario">Rosario</option>
                <option value="bauan">Bauan</option>
                <option value="metrotagaytay">Metro Tagaytay</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleChange}
                maxLength={70}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer with Buttons */}
          <div className="mt-6 flex justify-center space-x-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
