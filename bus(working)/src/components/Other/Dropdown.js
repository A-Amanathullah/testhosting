import React, { useState } from "react";
import cityList from "../../data/villages.json";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select Location");

  const options = cityList;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          {selected}
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
