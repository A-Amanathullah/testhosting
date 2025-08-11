import React, { useState, useRef, useEffect } from "react";
import locationService from "../../services/locationService";
import { createPortal } from "react-dom";

const AutocompleteInput = ({ placeholder, value, setValue, className = '' }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allLocations, setAllLocations] = useState([]);
    const inputRef = useRef();

    // Load all locations on component mount
    useEffect(() => {
        const loadAllLocations = async () => {
            setLoading(true);
            try {
                // You can replace getAllLocations with your actual service method
                const locations = await locationService.getAllLocations();
                setAllLocations(locations);
                setSuggestions(locations);
            } catch (error) {
                console.error('Error loading locations:', error);
                setAllLocations([]);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };
        loadAllLocations();
    }, []);

    const filterLocations = (query) => {
        const normalizedQuery = (query || "").trim().toLowerCase();
        if (!normalizedQuery) {
            setSuggestions(allLocations);
            return;
        }
        const filtered = allLocations.filter(loc => {
            if (typeof loc === 'string') {
                return loc.toLowerCase().includes(normalizedQuery);
            }
            // Check all relevant fields for a match
            const name = (loc.name || "").toLowerCase();
            const district = (loc.district || "").toLowerCase();
            const province = (loc.province || "").toLowerCase();
            const type = (loc.type || "").toLowerCase();
            return (
                name.includes(normalizedQuery) ||
                district.includes(normalizedQuery) ||
                province.includes(normalizedQuery) ||
                type.includes(normalizedQuery)
            );
        });
        setSuggestions(filtered);
    };

    const handleChange = (e) => {
        const userInput = e.target.value;
        setValue(userInput);
        setShowSuggestions(true);
        filterLocations(userInput);
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
        filterLocations(value);
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

    // Calculate dropdown position for portal
    const [dropdownStyle, setDropdownStyle] = useState({});
    useEffect(() => {
        if (showSuggestions && inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: "absolute",
                left: rect.left + window.scrollX,
                top: rect.bottom + window.scrollY,
                width: rect.width,
                zIndex: 9999
            });
        }
    }, [showSuggestions]);

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
            {showSuggestions && createPortal(
                <div style={dropdownStyle} className="bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
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
                </div>,
                document.body
            )}
        </div>
    );
};

export default AutocompleteInput;
