import useBusHook from "../../hooks/useBusHook";
import BusTripCard from "./BusTripCard";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";


const BusList = () => {
    const location = useLocation();
    const { searchResults, searchParams } = location.state || {};
    
    // Format date from ISO string to user-friendly format (DD MMM YYYY)
    // Note: With backend changes, dates may already be formatted
    const formatDate = (dateString) => {
        if (!dateString) return "";
        
        // Check if date is already formatted (contains spaces, e.g., "10 Jul 2025")
        if (typeof dateString === 'string' && dateString.includes(' ')) {
            return dateString; // Already formatted
        }
        
        try {
            // Check if it's an ISO string (with T and Z)
            const isISO = typeof dateString === 'string' && dateString.includes('T');
            const date = isISO ? parseISO(dateString) : new Date(dateString);
            return format(date, 'dd MMM yyyy');
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString; // Return original string if parsing fails
        }
    };
    
    // Use search results if available, otherwise fall back to the hook
    const { trips: allTrips, buses, loading, error } = useBusHook();
    
    // Use search results if they exist, otherwise use all trips
    const trips = searchResults || allTrips;
    
    // Show loading only if we're fetching all trips and don't have search results
    const isLoading = !searchResults && loading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200">
                <div className="flex space-x-2">
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
                    />
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
                    />
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.6 }}
                    />
                </div>
                <p className="mt-4 text-primary text-lg font-semibold">Finding the best trips for you...</p>
            </div>
        );
    }
    if (error) return <div className="p-6 text-red-500">Failed to load trips.</div>;


    return (
        <div className="bg-slate-200 min-h-full py-2 sm:py-4">
            <div className="container flex flex-col gap-4 sm:gap-7 max-w-4xl mx-auto px-1 sm:px-2 md:px-4">
                {/* Search Results Header */}
                {searchResults && searchParams && (
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Search Results: {searchParams.from} → {searchParams.to}
                            {searchParams.hasReturnResults && (
                                <span className="text-sm font-normal text-gray-600"> (Round Trip)</span>
                            )}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Date: {formatDate(searchParams.date)} 
                            {searchParams.returnDate && ` | Return: ${formatDate(searchParams.returnDate)}`} • 
                            Found {searchResults.length} trip{searchResults.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}
                
                {/* No Results Message */}
                {searchResults && searchResults.length === 0 && (
                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No trips found</h3>
                        <p className="text-gray-600">
                            No bus trips available from {searchParams?.from} to {searchParams?.to} on {formatDate(searchParams?.date)}.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Try selecting different locations or dates.
                        </p>
                    </div>
                )}
                
                {/* Trip Cards */}
                {trips && trips.length > 0 && (() => {
                    // Group trips by journey type
                    const outboundTrips = trips.filter(trip => !trip.journey_type || trip.journey_type === 'outbound');
                    const returnTrips = trips.filter(trip => trip.journey_type === 'return');
                    
                    // Filter by date if not search results
                    const filterByDate = (trips) => {
                        if (searchResults) return trips; // Don't filter search results
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return trips.filter(trip => {
                            const depDate = new Date(trip.departure_date);
                            depDate.setHours(0, 0, 0, 0);
                            return depDate >= today;
                        });
                    };
                    
                    const filteredOutbound = filterByDate(outboundTrips);
                    const filteredReturn = filterByDate(returnTrips);
                    
                    return (
                        <>
                            {/* Outbound Trips */}
                            {filteredOutbound.length > 0 && (
                                <>
                                    {searchResults && returnTrips.length > 0 && (
                                        <div className="bg-blue-100 rounded-lg p-3 shadow-sm">
                                            <h3 className="text-lg font-semibold text-blue-800">
                                                Outbound Journey: {searchParams?.from} → {searchParams?.to}
                                            </h3>
                                            <p className="text-sm text-blue-600">Departure: {formatDate(searchParams?.date)}</p>
                                        </div>
                                    )}
                                    {filteredOutbound.map(trip => (
                                        <BusTripCard key={`outbound-${trip.id}`} trip={trip} buses={buses} />
                                    ))}
                                </>
                            )}
                            
                            {/* Return Trips */}
                            {filteredReturn.length > 0 && (
                                <>
                                    <div className="bg-green-100 rounded-lg p-3 shadow-sm">
                                        <h3 className="text-lg font-semibold text-green-800">
                                            Return Journey: {searchParams?.to} → {searchParams?.from}
                                        </h3>
                                        <p className="text-sm text-green-600">Departure: {formatDate(searchParams?.returnDate)}</p>
                                    </div>
                                    {filteredReturn.map(trip => (
                                        <BusTripCard key={`return-${trip.id}`} trip={trip} buses={buses} />
                                    ))}
                                </>
                            )}
                        </>
                    );
                })()}
            </div>
        </div>
    );
};

export default BusList;