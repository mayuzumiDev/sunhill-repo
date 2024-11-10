import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const SortBox = ({ options = [], label = "Sort By", onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = `sortbox-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleOptionClick = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative text-gray-700">
      <input
        type="checkbox"
        id={uniqueId}
        className="hidden absolute"
        checked={isOpen}
        onChange={toggleMenu}
      />
      <label
        htmlFor={uniqueId}
        className="flex items-center space-x-1 cursor-pointer"
      >
        <span className="text-sm font-semibold">{label}</span>
        <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4" />
      </label>

      <div
        id="sortboxmenu"
        className={`absolute mt-1 right-1 top-full min-w-max shadow rounded bg-gray-200 border border-gray-300 transition delay-75 ease-in-out z-10 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <ul className="block text-sm text-right text-gray-900">
          {options.map((option, index) => (
            <li key={index}>
              <a
                className="block px-3 py-2 hover:bg-gray-300"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SortBox;
