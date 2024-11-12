import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const SortBox = ({ options = [], label = "Sort By", onSelect, filterType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = `sortbox-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const sortBoxRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleOptionClick = (option) => {
    if (filterType !== null) {
      onSelect(filterType, option);
      setIsOpen(false);
      return;
    }

    onSelect(option);
    setIsOpen(false);
  };

  // Close the dropdown when clicking outside of it
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
    <div ref={sortBoxRef} className="relative text-gray-800 z-20">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-1 cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition duration-150 ease-in-out focus:outline-none"
      >
        <span className="text-xs sm:text-sm font-medium">{label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="h-4 w-4 text-gray-500"
        />
      </button>

      <div
        className={`absolute justify-center mt-2 w-40 bg-white shadow-lg rounded-lg transition-transform transform ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ transition: "opacity 0.15s ease, transform 0.15s ease" }}
      >
        <ul className="py-2">
          {options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => handleOptionClick(option)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none"
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