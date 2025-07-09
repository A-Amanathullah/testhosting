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
    const [selectedView, setSelectedView] = useState("bus");
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
        <div>
            <div className="justify-self-center  translate-y-[-10vh] w-4/5 h-1/4 rounded-3xl bg-white shadow-md">
                {/* top buttons */}

                <button className="bg-white w-1/2 p-2 rounded-tl-3xl
                  duration-200  text-primary"
                    onClick={handleBus}
                    id="bus">
                    <div className="flex gap-3 justify-center items-center">
                        <RiBusWifiFill className="inline-block text-2xl " />
                        <div className="text-lg font-semibold"> Book a bus</div>
                    </div>
                </button>

                <button className="bg-slate-200 w-1/2 p-2 rounded-tr-3xl
                  duration-200 text-primary"
                    onClick={handleStatus}
                    id="status">
                    <div className="flex gap-3 justify-center items-center">
                        <FaSearchLocation className="inline-block text-2xl " />
                        <div className="text-lg font-semibold"> Bus status</div>
                    </div>
                </button>
                {showBus &&
                    <div>
                        {/* radio buttons */}
                        <div className=" flex items-center flex-wrap">
                            <div className="flex items-center gap-4 p-5">
                                <input
                                    type="radio"
                                    name="options"
                                    value="bus"
                                    checked={selectedView === "bus"}
                                    onChange={(e) => setSelectedView(e.target.value)}
                                    className="form-input p-3 rounded-full" />
                                <label className="text-lg">Return</label>
                            </div>

                            <div className="flex items-center gap-4 p-5">
                                <input
                                    type="radio"
                                    name="options"
                                    value="status"
                                    checked={selectedView === "status"}
                                    onChange={(e) => setSelectedView(e.target.value)}
                                    className="form-input p-3 rounded-full" />
                                <label className="text-lg">One way</label>
                            </div>
                        </div>

                        {/* input items */}
                        <div>
                            <div className="flex border border-black gap-3 items-center p-2 grow shrink mx-4 rounded-2xl">
                                {!isSwapped ? (
                                    <div className="flex grow shrink  gap-2  border border-primary transition-all duration-300 rounded-md">
                                        <AutocompleteInput className="input-form flex transition-all duration-300 rounded-lg text-md border-none"
                                            placeholder="From" value={fromCityBus} setValue={setFromCityBus} />
                                        <button className="transition-transform duration-300 active:rotate-180"
                                            onClick={handleSwap}>
                                            <LuArrowLeftRight className="inline-block text-xl" />
                                        </button>
                                        <AutocompleteInput className="input-form flex transition-all duration-300 rounded-lg text-md border-none"
                                            placeholder="To" value={toCityBus} setValue={setToCityBus} />
                                    </div>
                                ) : (
                                    <div className="flex grow shrink  gap-2  border border-primary transition-all duration-300 rounded-md">
                                        <AutocompleteInput className="input-form flex transition-all duration-300 rounded-lg text-md border-none"
                                            placeholder="To" value={toCityBus} setValue={setToCityBus} />
                                        <button className="transition-transform duration-300 active:rotate-180"
                                            onClick={handleSwap}>
                                            <LuArrowLeftRight className="inline-block text-xl" />
                                        </button>
                                        <AutocompleteInput className="input-form flex transition-all duration-300 rounded-lg text-md border-none"
                                            placeholder="From" value={fromCityBus} setValue={setFromCityBus} />
                                    </div>
                                )}
                                <PiLineVertical className="inline-block text-xl opacity-10" />
                                <div className="flex gap-2 border border-primary rounded-md">
                                    <DatePickerInput 
                                    className="input-form flex justify-self-center  rounded-lg text-md border-none"
                                    selectedDate={startDate} setSelectedDate={setStartDate} placeholder="Departure Date" />

                                    {selectedView === "bus" &&
                                        <DatePickerInput
                                        className="input-form flex justify-self-center  rounded-lg text-md border-none"
                                        selectedDate={returnDate} setSelectedDate={setReturnDate} placeholder="Return Date" />
                                    }
                                </div>

                            </div>

                        </div>

                        {/* search button */}

                        <div className="flex justify-center m-4 p-4">
                            <button 
                                onClick={handleSearch}
                                disabled={searching}
                                className="bg-transparent border border-primary py-3 px-10 rounded-full
                        hover:bg-primary duration-200 hover:text-white text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                                <div className="flex gap-3 justify-center items-center">
                                    <FaSearch className="inline-block text-2xl " />
                                    <div className="text-lg font-semibold">
                                        {searching ? 'Searching...' : 'Search'}
                                    </div>
                                </div>
                            </button>
                        </div>

                    </div>
                }

                {showStatus &&
                    <div>
                        <div className=' py-4 '>
                            <div className="flex px-5 py-5 pt-9 bg-white gap-3 items-center p-2 flex-wrap grow shrink  rounded-2xl">
                                {!isSwapped ? (
                                    <div className="flex grow shrink  gap-2  border border-primary transition-all duration-300 rounded-md">
                                        <AutocompleteInput className="input-form flex transition-all duration-300 rounded-lg text-md border-none"
                                            placeholder="From" value={fromCityStatus} setValue={setFromCityStatus} />
                                        <button className="transition-transform duration-300 active:rotate-180"
                                            onClick={handleSwap}>
                                            <LuArrowLeftRight className="inline-block text-xl" />
                                        </button>
                                        <AutocompleteInput className="input-form flex transition-all duration-300 rounded-lg text-md border-none"
                                            placeholder="To" value={toCityStatus} setValue={setToCityStatus} />
                                    </div>
                                ) : (
                                    <div className="flex grow shrink  gap-2  border border-primary transition-all duration-300 rounded-md">
                                        <AutocompleteInput className="input-form flex transition-all duration-300 rounded-lg text-md border-none"
                                            placeholder="To" value={toCityStatus} setValue={setToCityStatus} />
                                        <button className="transition-transform duration-300 active:rotate-180"
                                            onClick={handleSwap}>
                                            <LuArrowLeftRight className="inline-block text-xl" />
                                        </button>
                                        <AutocompleteInput className="input-form flex transition-all duration-300 rounded-lg text-md border-none"
                                            placeholder="From" value={fromCityStatus} setValue={setFromCityStatus} />
                                    </div>
                                )}

                                <div><PiLineVertical className="inline-block text-xl opacity-10" /></div>
                                <div className="flex gap-2 border border-primary rounded-md">
                                    <DatePickerInput 
                                    className="input-form flex justify-self-center  rounded-lg text-md border-none"
                                    selectedDate={startDateStatus} setSelectedDate={setStartDateStatus} placeholder="Date" />
                                </div>


                                <div className="flex justify-center">
                                    <Link to="/buslist">
                                        <button className="bg-primary border border-primary py-2 px-10 rounded-full
                                                hover:bg-transparent duration-200 hover:text-primary text-white">
                                            <div className="flex gap-3 justify-center items-center">
                                                <FaSearch className="inline-block text-2xl " />
                                                <div className="text-lg font-semibold"> Search</div>
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




