import { RiBusWifiFill } from "react-icons/ri";
import { FaSearchLocation } from "react-icons/fa";
import { LuArrowLeftRight } from "react-icons/lu";
import { PiLineVertical } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AutocompleteInput from "../../components/Other/AutocompleteInput";
import DatePickerInput from "../../components/Other/DatePickerInput";
import locationService from "../../services/locationService";

const Form = () => {

    const [fromCityBus, setFromCityBus] = useState("");
    const [toCityBus, setToCityBus] = useState("");
    const [fromCityStatus, setFromCityStatus] = useState("");
    const [toCityStatus, setToCityStatus] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [startDateStatus, setStartDateStatus] = useState(null);
    const [searching, setSearching] = useState(false);

    const navigate = useNavigate();

    const [showBus, setShowBus] = useState(true);
    const [showStatus, setShowStatus] = useState(false);
    const [selectedView, setSelectedView] = useState("status");
    const [isSwapped, setIsSwapped] = useState(false);

    const handleBus = (e) => {
        e.preventDefault();
        setShowBus(true);
        setShowStatus(false);
        document.getElementById("bus").classList.add("bg-white");
        document.getElementById("status").classList.remove("bg-white");
    };

    const handleStatus = (e) => {
        e.preventDefault();
        setShowStatus(true);
        setShowBus(false);
        document.getElementById("status").classList.add("bg-white");
        document.getElementById("bus").classList.remove("bg-white");
        document.getElementById("bus").classList.add("bg-slate-200");
    };

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!fromCityBus || !toCityBus || !startDate) {
            alert('Please fill in all required fields');
            return;
        }

        setSearching(true);
        
        try {
            // Format date for API - handle Day.js object
            const formattedDate = startDate.format('YYYY-MM-DD');
            
            // Debug logging
            console.log('Search parameters:', {
                from: fromCityBus,
                to: toCityBus,
                originalDate: startDate,
                formattedDate: formattedDate,
                isReturn: selectedView === "bus",
                returnDate: returnDate
            });
            
            let outboundResults = null;
            let returnResults = null;
            
            // Search for outbound journey
            outboundResults = await locationService.searchBusTripsByRoute(
                fromCityBus,
                toCityBus,
                formattedDate
            );
            
            // If return journey is selected and return date is provided, search for return journey
            if (selectedView === "bus" && returnDate) {
                const formattedReturnDate = returnDate.format('YYYY-MM-DD');
                console.log('Searching return journey:', {
                    from: toCityBus,
                    to: fromCityBus,
                    date: formattedReturnDate
                });
                
                returnResults = await locationService.searchBusTripsByRoute(
                    toCityBus, // Opposite direction
                    fromCityBus, // Opposite direction
                    formattedReturnDate
                );
            }

            console.log('Search results:', {
                outbound: outboundResults,
                return: returnResults
            });

            // Combine results for navigation
            const combinedTrips = [];
            
            // Add outbound trips with direction marker
            if (outboundResults && outboundResults.trips) {
                outboundResults.trips.forEach(trip => {
                    combinedTrips.push({
                        ...trip,
                        journey_type: 'outbound',
                        journey_label: `${fromCityBus} → ${toCityBus}`
                    });
                });
            }
            
            // Add return trips with direction marker
            if (returnResults && returnResults.trips) {
                returnResults.trips.forEach(trip => {
                    combinedTrips.push({
                        ...trip,
                        journey_type: 'return',
                        journey_label: `${toCityBus} → ${fromCityBus}`
                    });
                });
            }

            // Navigate to bus list with combined search results
            navigate('/busList', {
                state: {
                    searchResults: combinedTrips,
                    searchParams: {
                        from: fromCityBus,
                        to: toCityBus,
                        date: formattedDate,
                        isReturn: selectedView === "bus",
                        returnDate: returnDate ? returnDate.format('YYYY-MM-DD') : null,
                        hasReturnResults: returnResults && returnResults.trips && returnResults.trips.length > 0
                    }
                }
            });
        } catch (error) {
            console.error('Search error:', error);
            alert('Error searching for bus trips. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 md:px-0">
            <div className="justify-self-center transform translate-y-[-10vh] w-full sm:w-11/12 md:w-10/12 lg:w-4/5 mx-auto rounded-3xl bg-white shadow-md overflow-hidden">
                {/* top buttons */}

                <div className="flex">
                    <button className="bg-white w-1/2 p-2 rounded-tl-3xl
                      duration-200 text-primary"
                        onClick={handleBus}
                        id="bus">
                        <div className="flex gap-1 sm:gap-3 justify-center items-center">
                            <RiBusWifiFill className="inline-block text-xl sm:text-2xl" />
                            <div className="text-sm sm:text-lg font-semibold">Book a bus</div>
                        </div>
                    </button>

                    <button className="bg-slate-200 w-1/2 p-2 rounded-tr-3xl
                      duration-200 text-primary"
                        onClick={handleStatus}
                        id="status">
                        <div className="flex gap-1 sm:gap-3 justify-center items-center">
                            <FaSearchLocation className="inline-block text-xl sm:text-2xl" />
                            <div className="text-sm sm:text-lg font-semibold">Bus status</div>
                        </div>
                    </button>
                </div>
                {showBus &&
                    <div className="py-3 px-2 sm:px-4">
                        {/* radio buttons */}
                        <div className="flex items-center flex-wrap justify-center sm:justify-start">
                            <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-5">
                                <input
                                    type="radio"
                                    name="options"
                                    value="bus"
                                    checked={selectedView === "bus"}
                                    onChange={(e) => setSelectedView(e.target.value)}
                                    className="form-input p-2 sm:p-3 rounded-full" />
                                <label className="text-base sm:text-lg">Return</label>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-5">
                                <input
                                    type="radio"
                                    name="options"
                                    value="status"
                                    checked={selectedView === "status"}
                                    onChange={(e) => setSelectedView(e.target.value)}
                                    className="form-input p-2 sm:p-3 rounded-full" />
                                <label className="text-base sm:text-lg">One way</label>
                            </div>
                        </div>

                        {/* input items */}
                        <div className="px-2 sm:px-4">
                            <div className="flex flex-col md:flex-row border border-black gap-3 items-center p-2 rounded-2xl">
                                {!isSwapped ? (
                                    <div className="flex flex-col sm:flex-row w-full grow shrink gap-2 border border-primary transition-all duration-300 rounded-md p-1">
                                        <div className="w-full sm:w-auto flex-grow">
                                            <AutocompleteInput 
                                                className="input-form flex transition-all duration-300 rounded-lg text-md border-none w-full" 
                                                placeholder="From" value={fromCityBus} setValue={setFromCityBus} 
                                            />
                                        </div>
                                        <button 
                                            className="transition-transform duration-300 active:rotate-180 mx-auto my-1 sm:mx-1 sm:my-auto"
                                            onClick={handleSwap}
                                        >
                                            <LuArrowLeftRight className="inline-block text-xl" />
                                        </button>
                                        <div className="w-full sm:w-auto flex-grow">
                                            <AutocompleteInput 
                                                className="input-form flex transition-all duration-300 rounded-lg text-md border-none w-full" 
                                                placeholder="To" value={toCityBus} setValue={setToCityBus} 
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row w-full grow shrink gap-2 border border-primary transition-all duration-300 rounded-md p-1">
                                        <div className="w-full sm:w-auto flex-grow">
                                            <AutocompleteInput 
                                                className="input-form flex transition-all duration-300 rounded-lg text-md border-none w-full" 
                                                placeholder="To" value={toCityBus} setValue={setToCityBus} 
                                            />
                                        </div>
                                        <button 
                                            className="transition-transform duration-300 active:rotate-180 mx-auto my-1 sm:mx-1 sm:my-auto"
                                            onClick={handleSwap}
                                        >
                                            <LuArrowLeftRight className="inline-block text-xl" />
                                        </button>
                                        <div className="w-full sm:w-auto flex-grow">
                                            <AutocompleteInput 
                                                className="input-form flex transition-all duration-300 rounded-lg text-md border-none w-full" 
                                                placeholder="From" value={fromCityBus} setValue={setFromCityBus} 
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="hidden md:block">
                                    <PiLineVertical className="inline-block text-xl opacity-10" />
                                </div>
                                
                                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 border border-primary rounded-md p-1">
                                    <div className={`w-full ${selectedView === "bus" ? "sm:w-1/2" : "sm:w-full"}`}>
                                        <DatePickerInput 
                                            className="input-form flex justify-self-center rounded-lg text-md border-none w-full"
                                            selectedDate={startDate} setSelectedDate={setStartDate} placeholder="Departure Date" 
                                        />
                                    </div>

                                    {selectedView === "bus" && (
                                        <div className="w-full sm:w-1/2">
                                            <DatePickerInput
                                                className="input-form flex justify-self-center rounded-lg text-md border-none w-full"
                                                selectedDate={returnDate} setSelectedDate={setReturnDate} placeholder="Return Date" 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* search button */}
                        <div className="flex justify-center m-2 sm:m-4 p-2 sm:p-4">
                            <button 
                                onClick={handleSearch}
                                disabled={searching}
                                className="bg-transparent border border-primary py-2 sm:py-3 px-6 sm:px-10 rounded-full
                                    hover:bg-primary duration-200 hover:text-white text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex gap-2 sm:gap-3 justify-center items-center">
                                    <FaSearch className="inline-block text-xl sm:text-2xl" />
                                    <div className="text-base sm:text-lg font-semibold">
                                        {searching ? 'Searching...' : 'Search'}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                }

                {showStatus &&
                    <div className="py-3 px-2 sm:px-4">
                        <div className="py-2 sm:py-4">
                            <div className="flex flex-col md:flex-row gap-3 items-center p-2 rounded-2xl">
                                {!isSwapped ? (
                                    <div className="flex flex-col sm:flex-row w-full grow shrink gap-2 border border-primary transition-all duration-300 rounded-md p-1">
                                        <div className="w-full sm:w-auto flex-grow">
                                            <AutocompleteInput 
                                                className="input-form flex transition-all duration-300 rounded-lg text-md border-none w-full"
                                                placeholder="From" value={fromCityStatus} setValue={setFromCityStatus} 
                                            />
                                        </div>
                                        <button 
                                            className="transition-transform duration-300 active:rotate-180 mx-auto my-1 sm:mx-1 sm:my-auto"
                                            onClick={handleSwap}
                                        >
                                            <LuArrowLeftRight className="inline-block text-xl" />
                                        </button>
                                        <div className="w-full sm:w-auto flex-grow">
                                            <AutocompleteInput 
                                                className="input-form flex transition-all duration-300 rounded-lg text-md border-none w-full"
                                                placeholder="To" value={toCityStatus} setValue={setToCityStatus} 
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row w-full grow shrink gap-2 border border-primary transition-all duration-300 rounded-md p-1">
                                        <div className="w-full sm:w-auto flex-grow">
                                            <AutocompleteInput 
                                                className="input-form flex transition-all duration-300 rounded-lg text-md border-none w-full"
                                                placeholder="To" value={toCityStatus} setValue={setToCityStatus} 
                                            />
                                        </div>
                                        <button 
                                            className="transition-transform duration-300 active:rotate-180 mx-auto my-1 sm:mx-1 sm:my-auto"
                                            onClick={handleSwap}
                                        >
                                            <LuArrowLeftRight className="inline-block text-xl" />
                                        </button>
                                        <div className="w-full sm:w-auto flex-grow">
                                            <AutocompleteInput 
                                                className="input-form flex transition-all duration-300 rounded-lg text-md border-none w-full"
                                                placeholder="From" value={fromCityStatus} setValue={setFromCityStatus} 
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="hidden md:block">
                                    <PiLineVertical className="inline-block text-xl opacity-10" />
                                </div>
                                
                                <div className="w-full md:w-auto md:min-w-[200px] flex gap-2 border border-primary rounded-md p-1">
                                    <DatePickerInput 
                                        className="input-form flex justify-self-center rounded-lg text-md border-none w-full"
                                        selectedDate={startDateStatus} setSelectedDate={setStartDateStatus} placeholder="Date" 
                                    />
                                </div>

                                <div className="flex justify-center w-full md:w-auto mt-4 md:mt-0">
                                    <Link to="/buslist" className="w-full md:w-auto">
                                        <button className="w-full md:w-auto bg-primary border border-primary py-2 px-6 sm:px-10 rounded-full
                                                hover:bg-transparent duration-200 hover:text-primary text-white">
                                            <div className="flex gap-2 sm:gap-3 justify-center items-center">
                                                <FaSearch className="inline-block text-xl sm:text-2xl" />
                                                <div className="text-base sm:text-lg font-semibold">Search</div>
                                            </div>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Form;




