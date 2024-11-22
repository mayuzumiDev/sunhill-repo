import React, { useState, useEffect } from "react";

const EditClassroomModal = ({ isOpen, onClose, onSave, classroomData }) => {
  const [formData, setFormData] = useState({
    grade_level: "",
    class_section: "",
    subject_name: "",
  });

  useEffect(() => {
    if (classroomData) {
      setFormData({
        grade_level: classroomData.grade_level || "",
        class_section: classroomData.class_section || "",
        subject_name: classroomData.subject_name || "",
      });
    }
  }, [classroomData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Edit Data: ", formData);
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Classroom</h2>

          {/* Dropdown for Selecting Grade Level */}
          <select
            name="grade_level"
            value={formData.grade_level}
            onChange={handleInputChange}
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
          <input
            type="text"
            name="class_section"
            value={formData.class_section}
            onChange={handleInputChange}
            className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
            placeholder="Section (e.g. A, B, C)"
          />

          {/* Subject Dropdown Menu */}
          <select
            name="subject_name"
            value={formData.subject_name}
            onChange={handleInputChange}
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

          {/* Buttons for Save and Cancel */}
          <div className="flex justify-center space-x-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClassroomModal;
