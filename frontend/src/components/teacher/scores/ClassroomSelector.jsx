import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ClassroomSelector = ({
  selectedClassroom,
  classrooms,
  onClassroomChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedItem = classrooms.find((c) => c.id === selectedClassroom);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4" ref={dropdownRef}>
      <div className="relative">
        {/* Custom Select Button */}
        <button
          type="button"
          className="w-full px-4 py-2 text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedItem
            ? `${selectedItem.grade_level} - ${selectedItem.class_section}`
            : "Select a classroom"}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-4 h-4 text-green-500 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {classrooms.map((classroom) => (
                <li
                  key={classroom.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-green-100 transition-colors duration-150
                    ${selectedClassroom === classroom.id ? "bg-green-50" : ""}`}
                  onClick={() => {
                    onClassroomChange(classroom.id);
                    setIsOpen(false);
                  }}
                >
                  {`${classroom.grade_level} - ${classroom.class_section}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomSelector;
