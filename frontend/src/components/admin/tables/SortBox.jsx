import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const SortBox = ({ options = [], label = "Sort By", onSelect, filterType, resetSelection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const sortBoxRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleOptionClick = (option) => {
    if (filterType !== null) {
      onSelect(filterType, option);
      setSelectedOption(option);
      setIsOpen(false);
      return;
    }
    onSelect(option);
    setSelectedOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    if (resetSelection) {
      setSelectedOption(null);
    }
  }, [resetSelection]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortBoxRef.current && !sortBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={sortBoxRef} className="relative z-20 w-full md:w-auto">
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-between px-2 py-1 md:px-3 md:py-2 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none w-full md:w-auto ${
          selectedOption ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" : "bg-white text-gray-800"
        }`}
      >
        <span className="text-xs sm:text-sm font-medium">
          {selectedOption || label}
        </span>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className={`h-4 w-4 md:h-5 md:w-5 ml-2 transition-transform duration-300 ease-in-out ${
            selectedOption ? "text-white" : "text-gray-600"
          }`}
        />
      </button>

      <div
        className={`absolute left-0 right-0 md:right-auto md:left-auto mt-2 w-full md:w-48 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 scale-100 translate-y-1" : "opacity-0 scale-95 pointer-events-none -translate-y-1"
        }`}
      >
        <ul className="py-2">
          {options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => handleOptionClick(option)}
                className={`block w-full text-left px-3 py-2 text-sm md:px-4 md:py-2 md:text-md focus:outline-none transition-colors duration-150 ${
                  selectedOption === option
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-indigo-100"
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SortBox;
