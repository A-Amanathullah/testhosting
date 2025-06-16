import React, { useState, useRef } from "react";
import cityList from "../../data/sriLankanCities.json";

const AutocompleteInput = ({ placeholder, value, setValue,className = '' }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef();

    const handleChange = (e) => {
        const userInput = e.target.value;
        setValue(userInput);

        if (userInput.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(true);
        } else {
            const filtered = cityList.filter((city) =>
                city.toLowerCase().startsWith(userInput.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        }
    };

    const handleSelect = (city) => {
        setValue(city);
        setSuggestions([]);
        setShowSuggestions(false);
        inputRef.current.focus();
    };

    const handleFocus = () => {
        if (value.trim() === "") {
            setSuggestions(cityList);
        } else {
            const filtered = cityList.filter((city) =>
                city.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filtered);
        }
        setShowSuggestions(true);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100);
    };

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                type="text"
                className={`input-form w-full p-2 rounded-lg border border-gray-300 ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                    {suggestions.map((city, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => handleSelect(city)}
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;
