import React, { useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

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
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 shadow-xl transform transition-all">
        <div className="bg-gradient-to-r from-green-700 to-green-400 p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Edit Classroom</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Grade Level Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Grade Level
            </label>
            <Listbox
              value={formData.grade_level}
              onChange={(value) =>
                handleInputChange({ target: { name: "grade_level", value } })
              }
            >
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200">
                  <span className="block truncate text-sm text-gray-700">
                    {formData.grade_level || "Select Level"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
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
                      <Listbox.Option
                        key={grade}
                        value={grade}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-700"
                          }`
                        }
                      >
                        {grade}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Section Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Section</label>
            <input
              type="text"
              name="class_section"
              value={formData.class_section}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
              placeholder="Section (e.g. A, B, C)"
              maxLength={20}
            />
          </div>

          {/* Subject Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Subject</label>
            <Listbox
              value={formData.subject_name}
              onChange={(value) =>
                handleInputChange({ target: { name: "subject_name", value } })
              }
            >
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200">
                  <span className="block truncate text-sm text-gray-700">
                    {formData.subject_name
                      ? subjects.find((s) => s.value === formData.subject_name)
                          ?.label || formData.subject_name
                      : "Select Subject"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                    {[
                      { value: "MORAL", label: "Moral" },
                      { value: "READING", label: "Reading" },
                      { value: "MATH", label: "Math" },
                      {
                        value: "ECLP",
                        label: "English Computerized Learning Program",
                      },
                      { value: "ROBOTICS", label: "Robotics" },
                      { value: "ENGLISH", label: "English" },
                      { value: "SCIENCE", label: "Science" },
                      { value: "FILIPINO", label: "Filipino" },
                      { value: "MOTHER_TONGUE", label: "Mother Tongue" },
                      {
                        value: "ARALING_PANLIPUNAN",
                        label: "Araling Panlipunan",
                      },
                      { value: "MAPEH", label: "MAPEH" },
                      { value: "VALUES_EDUCATION", label: "Values Education" },
                      {
                        value: "HELE",
                        label: "Home Economics & Livelihood Education",
                      },
                    ].map((subject) => (
                      <Listbox.Option
                        key={subject.value}
                        value={subject.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-700"
                          }`
                        }
                      >
                        {subject.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={handleSave}
            >
              Update Classroom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define subjects array at component level for better organization
const subjects = [
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
];

export default EditClassroomModal;
