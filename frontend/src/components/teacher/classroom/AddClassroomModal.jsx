import React, { useState } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";

const AddClassroomModal = ({ isOpen, isClose, onSuccess }) => {
  const initialFormState = {
    grade_level: "",
    class_section: "",
    subject_name: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log("Sending form data: ", formData);
      const response = await axiosInstance.post(
        "/user-teacher/classroom/create/",
        formData
      );

      if (response.status === 201) {
        console.log("Response from create classroom:", response.data);
        const newClassroom = response.data.classroom_created;
        setFormData(initialFormState);
        isClose();
        if (onSuccess && newClassroom) {
          onSuccess(newClassroom);
        }
      }
    } catch (error) {
      console.error("Error Response Data:", error.response?.data);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96 font-montserrat">
        <h2 className="text-2xl font-bold mb-4">Create New Classroom</h2>

        {/* Grade Level Dropdown Menu */}
        <select
          name="grade_level"
          value={formData.grade_level}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
        >
          <option value="" disabled>
            Select Level
          </option>
          {[
            "Nursery",
            "Casa 1",
            "Casa 2",
            "Grade 1",
            "Grade 2",
            "Grade 3",
            "Grade 4",
            "Grade 5",
            "Grade 6",
          ].map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>

        {/* Class Section Input */}
        <input
          type="text"
          name="class_section"
          value={formData.class_section}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
          placeholder="Section (e.g. A, B, C)"
          maxLength={20}
        />

        {/* Subject Dropdown Menu */}
        <select
          name="subject_name"
          value={formData.subject_name}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
        >
          <option value="" disabled>
            Select Subject
          </option>
          {[
            { value: "MORAL", label: "Moral" },
            { value: "READING", label: "Reading" },
            { value: "MATH", label: "Math" },
            { value: "ECLP", label: "English Computerized Learning Program" },
            { value: "ROBOTICS", label: "Robotics" },
            { value: "ENGLISH", label: "English" },
            { value: "SCIENCE", label: "Science" },
            { value: "FILIPINO", label: "Filipino" },
            { value: "MOTHER_TONGUE", label: "Mother Tongue" },
            { value: "ARALING_PANLIPUNAN", label: "Araling Panlipunan" },
            { value: "MAPEH", label: "MAPEH" },
            { value: "VALUES_EDUCATION", label: "Values Education" },
            { value: "HELE", label: "Home Economics & Livelihood Education" },
          ].map((subject) => (
            <option key={subject.value} value={subject.value}>
              {subject.label}
            </option>
          ))}
        </select>

        {/* Add and Cancel Button */}
        <div className="flex justify-end space-x-2">
          <button
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
            onClick={handleSave}
          >
            Add Class
          </button>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
            onClick={isClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClassroomModal;
