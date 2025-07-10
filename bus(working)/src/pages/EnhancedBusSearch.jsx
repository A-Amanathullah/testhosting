import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useBusHook from '../hooks/useBusHook';
import sriLankanLocationService from '../services/sriLankanLocationService';

const EnhancedBusSearch = () => {
    const navigate = useNavigate();
    const [searchFilters, setSearchFilters] = useState({
        from: '',
        to: '',
        departureDate: ''
    });
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [showAll, setShowAll] = useState(true);
    const [locations, setLocations] = useState([]);
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);

    // Get bus data using existing hook
    const { buses, trips, loading, error } = useBusHook();

    // Load locations from your Sri Lankan locations API
    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await sriLankanLocationService.getMajorStops();
                setLocations(data);
            } catch (error) {
                console.error('Error loading locations:', error);
                // Fallback locations are handled by the service
            }
        };
        loadLocations();
    }, []);

    // Initialize with all current and future trips
    useEffect(() => {
        console.log('Buses loaded:', buses);
        console.log('Trips loaded:', trips);
        if (trips && trips.length > 0) {
            const currentAndFutureTrips = trips.filter(trip => {
                return isDateCurrentOrFuture(trip.departure_date);
            });
            
            console.log(`Filtered out ${trips.length - currentAndFutureTrips.length} past trips`);
            setFilteredTrips(currentAndFutureTrips);
        }
    }, [buses, trips]);

    // Search suggestions
    const searchLocations = (query) => {
        if (!query || query.length < 2) return [];
        return locations.filter(location =>
            location.name.toLowerCase().includes(query.toLowerCase()) ||
            location.district.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [field]: value
        }));

        // Show suggestions for location fields
        if (field === 'from') {
            setFromSuggestions(searchLocations(value));
            setShowFromSuggestions(value.length > 0);
        } else if (field === 'to') {
            setToSuggestions(searchLocations(value));
            setShowToSuggestions(value.length > 0);
        }
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (field, location) => {
        setSearchFilters(prev => ({
            ...prev,
            [field]: location.name
        }));
        setShowFromSuggestions(false);
        setShowToSuggestions(false);
    };

    // Helper function to ensure correct date comparison
    const isDateCurrentOrFuture = (dateStr) => {
        if (!dateStr) return false;
        
        // Get today's date at the beginning of the day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Parse the trip date correctly
        const tripDate = new Date(dateStr);
        // For comparison purposes, remove time component
        tripDate.setHours(0, 0, 0, 0);
        
        console.log(`Date comparison: ${dateStr} (${tripDate}) vs Today (${today}) = ${tripDate >= today}`);
        
        // Compare dates
        return tripDate >= today;
    };

    // Filter trips based on search criteria
    const handleSearch = () => {
        console.log('Search triggered with filters:', searchFilters);
        console.log('Available trips:', trips);
        console.log('Available buses:', buses);
        
        // If no specific filters, show all current and future trips
        if (!searchFilters.from && !searchFilters.to && !searchFilters.departureDate) {
            const currentAndFutureTrips = trips.filter(trip => {
                return isDateCurrentOrFuture(trip.departure_date);
            });
            
            setFilteredTrips(currentAndFutureTrips);
            setShowAll(true);
            return;
        }

        // First, let's check what fields exist in trips
        if (trips && trips.length > 0) {
            console.log('Sample trip data:', trips[0]);
        }

        const filtered = trips.filter(trip => {
            // Only include current and future trips using our helper function
            const isCurrentOrFuture = isDateCurrentOrFuture(trip.departure_date);
            
            if (!isCurrentOrFuture) return false;
            
            // More flexible matching for locations
            const matchesFrom = !searchFilters.from || 
                (trip.departure_location && trip.departure_location.toLowerCase().includes(searchFilters.from.toLowerCase())) ||
                (trip.start_point && trip.start_point.toLowerCase().includes(searchFilters.from.toLowerCase()));
                
            const matchesTo = !searchFilters.to || 
                (trip.arrival_location && trip.arrival_location.toLowerCase().includes(searchFilters.to.toLowerCase())) ||
                (trip.end_point && trip.end_point.toLowerCase().includes(searchFilters.to.toLowerCase()));
                
            // More flexible date matching
            const matchesDate = !searchFilters.departureDate || 
                trip.departure_date === searchFilters.departureDate ||
                (trip.departure_date && trip.departure_date.startsWith(searchFilters.departureDate));

            console.log(`Trip ${trip.id}:`, {
                from: trip.departure_location || trip.start_point,
                to: trip.arrival_location || trip.end_point,
                date: trip.departure_date,
                isCurrentOrFuture,
                matchesFrom,
                matchesTo,
                matchesDate
            });

            return matchesFrom && matchesTo && matchesDate;
        });

        console.log('Filtered trips:', filtered);
        setFilteredTrips(filtered);
        setShowAll(false);
    };

    // Clear filters and show only current & future trips
    const handleClear = () => {
        setSearchFilters({
            from: '',
            to: '',
            departureDate: ''
        });
        
        // Filter for current and future trips only using our helper function
        const currentAndFutureTrips = trips.filter(trip => {
            return isDateCurrentOrFuture(trip.departure_date);
        });
        
        setFilteredTrips(currentAndFutureTrips);
        setShowAll(true);
        setShowFromSuggestions(false);
        setShowToSuggestions(false);
    };

    // Get today's date for min date validation
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Search Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        Find Your Perfect Bus Journey
                    </h1>
                    
                    {/* Search Form */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* From Location */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaMapMarkerAlt className="inline mr-2 text-blue-500" />
                                From
                            </label>
                            <input
                                type="text"
                                value={searchFilters.from}
                                onChange={(e) => handleInputChange('from', e.target.value)}
                                placeholder="Enter departure city"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {/* From Suggestions */}
                            {showFromSuggestions && fromSuggestions.length > 0 && (
                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                                    {fromSuggestions.map((location) => (
                                        <div
                                            key={location.id}
                                            onClick={() => handleSuggestionSelect('from', location)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                        >
                                            <div className="font-medium">{location.name}</div>
                                            <div className="text-sm text-gray-500">{location.district}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* To Location */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaMapMarkerAlt className="inline mr-2 text-green-500" />
                                To
                            </label>
                            <input
                                type="text"
                                value={searchFilters.to}
                                onChange={(e) => handleInputChange('to', e.target.value)}
                                placeholder="Enter destination city"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            {/* To Suggestions */}
                            {showToSuggestions && toSuggestions.length > 0 && (
                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                                    {toSuggestions.map((location) => (
                                        <div
                                            key={location.id}
                                            onClick={() => handleSuggestionSelect('to', location)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                        >
                                            <div className="font-medium">{location.name}</div>
                                            <div className="text-sm text-gray-500">{location.district}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Departure Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaCalendarAlt className="inline mr-2 text-purple-500" />
                                Departure Date
                            </label>
                            <input
                                type="date"
                                value={searchFilters.departureDate}
                                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                                min={today}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Search Buttons */}
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <FaSearch className="mr-2" />
                                Search
                            </button>
                            <button
                                onClick={handleClear}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                            >
                                <FaTimes className="mr-2" />
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="text-center text-gray-600">
                        {showAll ? (
                            <>
                                <p>Showing all available trips ({filteredTrips.length} found)</p>
                                <p className="text-sm text-blue-600 mt-1">Only showing current and future schedules</p>
                            </>
                        ) : (
                            <p>Found {filteredTrips.length} trips for your search</p>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading buses...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <p>Error loading buses: {error.message}</p>
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && filteredTrips.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">
                            No trips found for your search criteria
                        </div>
                        <button
                            onClick={handleClear}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View All Trips
                        </button>
                    </div>
                )}

                {/* View Results Button */}
                {!loading && !error && filteredTrips.length > 0 && (
                    <div className="text-center">
                        <button
                            onClick={() => {
                                navigate('/busList', {
                                    state: {
                                        searchResults: filteredTrips,
                                        searchParams: {
                                            from: searchFilters.from,
                                            to: searchFilters.to,
                                            date: searchFilters.departureDate
                                        }
                                    }
                                });
                            }}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                        >
                            View {filteredTrips.length} Trip{filteredTrips.length !== 1 ? 's' : ''} Found
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedBusSearch;
