import React, { useState, useRef, useEffect } from "react";
import locationService from "../../services/locationService";

const AutocompleteInput = ({ placeholder, value, setValue, className = '' }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    // Load major stops on component mount
    useEffect(() => {
        const loadMajorStops = async () => {
            try {
                const majorStops = await locationService.getMajorStops();
                // Store major stops for quick access
                window.majorStops = majorStops;
            } catch (error) {
                console.error('Error loading major stops:', error);
            }
        };
        loadMajorStops();
    }, []);

    const searchLocations = async (query) => {
        if (!query || query.trim() === "") {
            // Show major stops when no query
            setSuggestions(window.majorStops || []);
            return;
        }

        setLoading(true);
        try {
            const results = await locationService.searchLocations(query, 15);
            setSuggestions(results);
        } catch (error) {
            console.error('Error searching locations:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const userInput = e.target.value;
        setValue(userInput);
        setShowSuggestions(true);
        
        // Debounce the search
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            searchLocations(userInput);
        }, 300);
    };

    const handleSelect = (location) => {
        const locationName = typeof location === 'string' ? location : location.name;
        setValue(locationName);
        setSuggestions([]);
        setShowSuggestions(false);
        inputRef.current.focus();
    };

    const handleFocus = () => {
        setShowSuggestions(true);
        if (value.trim() === "") {
            setSuggestions(window.majorStops || []);
        } else {
            searchLocations(value);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100);
    };

    const formatLocationDisplay = (location) => {
        if (typeof location === 'string') return location;
        
        const { name, district, province, type } = location;
        return (
            <div className="flex flex-col">
                <span className="font-medium">{name}</span>
                <span className="text-xs text-gray-500">
                    {district}, {province} • {type}
                </span>
            </div>
        );
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
            {showSuggestions && (
                <div className="absolute z-10 bg-white border border-gray-300 w-full rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-2 text-gray-500 text-center">
                            Searching...
                        </div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((location, index) => (
                            <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onMouseDown={() => handleSelect(location)}
                            >
                                {formatLocationDisplay(location)}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500 text-center">
                            No locations found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AutocompleteInput;
