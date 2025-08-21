import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSteering2Fill } from "react-icons/ri";
import ConfirmBooking from "./ConfirmBooking";
import { createBooking, updateBookingStatus, deleteBooking } from "../../services/bookingService";
import { createGuestBooking, updateGuestBooking, deleteGuestBooking } from "../../services/guestBookingService";
import { AuthContext } from "../../context/AuthContext";
import useBusHook from "../../hooks/useBusHook";
import useBookings from "../../hooks/useBookings";
import useGuestBookings from '../../hooks/useGuestBookings';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentAPI from "../PaymentAPI";
import BookingQRCode from "./BookingQRCode";
import GuestBookingForm from "./GuestBookingForm";
import ReturnTripChoiceModal from "./ReturnTripChoiceModal";
import CombinedBookingConfirmModal from "./CombinedBookingConfirmModal";
import axios from "axios";
import locationService from "../../services/locationService";
import { formatDateForMySQL, formatDateForDisplay } from "../../utils/dateUtils";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const SeatPlanning = ( ) => {
    const location = useLocation();
    const trip = location.state?.trip;
    // Access isReturn and selectedView from navigation state
    const isReturn = location.state?.isReturn;
    const selectedView = location.state?.selectedView;
    const isSecondLeg = location.state?.isSecondLeg; // Flag to indicate this is second leg of round trip
    const firstTripBookingData = location.state?.firstTripBooking; // First trip booking data
    const originalSearchParams = location.state?.searchParams; // Original search parameters including returnDate
    // Debug log
    console.log('isReturn:', isReturn, 'selectedView:', selectedView, 'isSecondLeg:', isSecondLeg);
    console.log('originalSearchParams:', originalSearchParams);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { buses } = useBusHook();
    const busNo = trip?.bus_no;
    const date = trip?.departure_date;
    const pickup = trip?.start_point;
    const drop = trip?.end_point;
    const busInfo = buses.find(bus => String(bus.bus_no) === String(busNo));
    const bus_id = busInfo ? busInfo.id : null;
    
    // Debug log to see what date format we're receiving from the backend
    console.log("Original departure_date received:", trip?.departure_date);
    console.log("Formatted for MySQL:", formatDateForMySQL(trip?.departure_date));
    console.log("Formatted for display:", formatDateForDisplay(trip?.departure_date));
    
    // Log detailed booking information for debugging
    console.log("Bus ID being used for booking fetch:", bus_id);
    console.log("Date being used for booking fetch:", date);
    
    const { bookings, frozenSeats, loading } = useBookings(bus_id, date);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { guestBookings = [] } = useGuestBookings(bus_id, date, refreshTrigger);

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrBookingDetails, setQrBookingDetails] = useState(null);
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [guestDetails, setGuestDetails] = useState(null);
    const [processingBookingId, setProcessingBookingId] = useState(null); // Track processing booking
    const [guestProcessingBookingId, setGuestProcessingBookingId] = useState(null); // Track guest processing booking
    const [isLoading, setIsLoading] = useState(false); // Loading state for button actions
    
    // Return trip booking states
    const [showReturnChoiceModal, setShowReturnChoiceModal] = useState(false);
    const [firstTripBooking, setFirstTripBooking] = useState(null); // Store first trip booking data
    const [isBookingReturnTrip, setIsBookingReturnTrip] = useState(false); // Flag to track if user is booking return trip
    const [showCombinedConfirmModal, setShowCombinedConfirmModal] = useState(false);
    const [secondTripBooking, setSecondTripBooking] = useState(null); // Store second trip booking data

    // // Debug: Log bookings, frozenSeats, bus_id, and date to verify correct data per bus
    // console.log('bus_id:', bus_id, 'date:', date, 'bookings:', bookings, 'frozenSeats:', frozenSeats);
    // // Debug: Log detailed seat numbers and booking IDs for each bus
    // console.log('bus_id:', bus_id, 'date:', date, 'bookings:', bookings.map(b => ({id: b.id, seat_no: b.seat_no, status: b.status})), 'frozenSeats:', frozenSeats.map(f => ({id: f.id, seat_no: f.seat_no, status: f.status})));

    // Filter bookings and frozenSeats to only include those for the current bus
    const filteredBookings = (bookings || []).filter(b => String(b.bus_id) === String(bus_id));
    const filteredFrozenSeats = (frozenSeats || []).filter(f => String(f.bus_id) === String(bus_id));

    // Debug log to verify booking data
    console.log("All filtered bookings:", filteredBookings);
    console.log("All guest bookings:", guestBookings);
    console.log("All frozen seats:", filteredFrozenSeats);

    // Helper function to parse seat_no from any format (string, array, comma-separated)
    const parseSeatNumbers = (seatData) => {
        if (!seatData) return [];
        
        if (Array.isArray(seatData)) {
            return seatData.map(seat => seat.trim()).filter(Boolean);
        } 
        
        if (typeof seatData === "string") {
            return seatData.split(",").map(seat => seat.trim()).filter(Boolean);
        }
        
        return [];
    };

    // Merge user bookings and guest bookings for seat status
    const allBookings = [...(filteredBookings || []), ...(guestBookings || [])];

    const toggleSeat = (seat) => {
        setSelectedSeats((prev) =>
            prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
        );
    };

    const renderMainRows = () => {
        let seatNum = 1;
        const rows = [];
        const totalSeats = busInfo?.total_seats || 0;
        const seatStatusMap = {};
        
        // Initialize all seats as available
        for (let i = 1; i <= totalSeats; i++) seatStatusMap[`S${i}`] = "available";
        
        // Mark frozen seats
        (filteredFrozenSeats || []).forEach(frozen => {
            const seatArr = parseSeatNumbers(frozen.seat_no);
            seatArr.forEach(seat => {
                seatStatusMap[seat] = "freezed";
            });
        });
        
        // Mark regular bookings and guest bookings
        console.log("Marking seats from all bookings:", allBookings);
        (allBookings || []).forEach(booking => {
            const seats = parseSeatNumbers(booking.seat_no);
            
            // Debug log each booking's seats and status
            console.log(`Booking ${booking.id} with status ${booking.status} has seats:`, seats);
            
            seats.forEach(seat => {
                if (String(booking.status).toLowerCase() === "confirmed") {
                    seatStatusMap[seat] = "reserved";
                    console.log(`Marked seat ${seat} as reserved`);
                } else if (String(booking.status).toLowerCase() === "processing") {
                    seatStatusMap[seat] = "processing";
                    console.log(`Marked seat ${seat} as processing`);
                }
            });
        });

        for (let r = 0; r < 10; r++) {
            const row = [];
            for (let c = 0; c < 5; c++) {
                if (c === 2) {
                    row.push(<div key={`aisle-${r}-${c}`} className="w-14"></div>);
                    continue;
                }
                const seatLabel = `S${seatNum++}`;
                const isSelected = selectedSeats.includes(seatLabel);
                let seatColor = "bg-gray-200 hover:bg-gray-300";
                if (seatStatusMap[seatLabel] === "reserved" || seatStatusMap[seatLabel] === "freezed") {
                    seatColor = "bg-red-600 text-white";
                } else if (seatStatusMap[seatLabel] === "processing") {
                    seatColor = "bg-green-600 text-white";
                } else if (isSelected) {
                    seatColor = "bg-blue-500 text-white";
                }
                row.push(
                    <button
                        key={seatLabel}
                        onClick={() => toggleSeat(seatLabel)}
                        className={`w-24 h-20 rounded-md m-1 text-2xl font-semibold ${seatColor}`}
                        disabled={seatStatusMap[seatLabel] === "reserved" || seatStatusMap[seatLabel] === "freezed" || seatStatusMap[seatLabel] === "processing"}
                    >
                        {seatLabel}
                    </button>
                );
            }
            rows.push(
                <div key={`row-${r}`} className="flex justify-center mb-1">
                    {row}
                </div>
            );
        }
        return rows;
    };

    const renderBackRow = () => {
        const row = [];
        const totalSeats = busInfo?.total_seats || 0;
        const seatStatusMap = {};
        
        // Initialize all seats as available
        for (let i = 1; i <= totalSeats; i++) seatStatusMap[`S${i}`] = "available";
        
        // Mark frozen seats
        (filteredFrozenSeats || []).forEach(frozen => {
            const seatArr = parseSeatNumbers(frozen.seat_no);
            seatArr.forEach(seat => {
                seatStatusMap[seat] = "freezed";
            });
        });
        
        // Mark both regular and guest bookings
        (allBookings || []).forEach(booking => {
            const seats = parseSeatNumbers(booking.seat_no);
            
            seats.forEach(seat => {
                if (String(booking.status).toLowerCase() === "confirmed") {
                    seatStatusMap[seat] = "reserved";
                } else if (String(booking.status).toLowerCase() === "processing") {
                    seatStatusMap[seat] = "processing";
                }
            });
        });
        
        for (let i = totalSeats; i >= 41; i--) {
            const seatLabel = `S${i}`;
            const isSelected = selectedSeats.includes(seatLabel);
            let seatColor = "bg-gray-200 hover:bg-gray-300";
            if (seatStatusMap[seatLabel] === "reserved" || seatStatusMap[seatLabel] === "freezed") {
                seatColor = "bg-red-600 text-white";
            } else if (seatStatusMap[seatLabel] === "processing") {
                seatColor = "bg-green-600 text-white";
            } else if (isSelected) {
                seatColor = "bg-blue-500 text-white";
            }
            row.push(
                <button
                    key={seatLabel}
                    onClick={() => toggleSeat(seatLabel)}
                    className={`w-24 h-20 rounded-md m-1 text-2xl font-semibold ${seatColor}`}
                    disabled={seatStatusMap[seatLabel] === "reserved" || seatStatusMap[seatLabel] === "freezed" || seatStatusMap[seatLabel] === "processing"}
                >
                    {seatLabel}
                </button>
            );
        }
        return <div className="flex justify-center mt-2">{row}</div>;
    };

    const handleGuestBooking = async (guestForm) => {
        if (isLoading) return; // Prevent multiple submissions
        setIsLoading(true);
        
        try {
            const totalPrice = Number(trip.price) * selectedSeats.length;
            let finalSerialNo = "N/A"; // Variable to track the final serial number
            
            console.log("=== GUEST BOOKING START ===");
            console.log("guestProcessingBookingId:", guestProcessingBookingId);
            console.log("guestForm:", guestForm);
            
            // Use the robust function to ensure MySQL-compatible date format
            const formattedDepartureDate = formatDateForMySQL(trip.departure_date);
            console.log("Formatted departure date for MySQL:", formattedDepartureDate);
            
            // If we have a guest processing booking, update it instead of creating new one
            if (guestProcessingBookingId) {
                console.log("=== UPDATING EXISTING BOOKING ===");
                
                // First, fetch the existing temporary booking to preserve its serial_no
                console.log("Fetching existing booking...");
                const existingBookingResponse = await axios.get(`${API_URL}/guest-bookings?bus_id=${trip.bus_id}&departure_date=${formattedDepartureDate}`);
                console.log("All guest bookings:", existingBookingResponse.data);
                
                const existingBooking = existingBookingResponse.data.find(booking => booking.id === guestProcessingBookingId);
                
                if (!existingBooking) {
                    console.error("Temporary booking not found! ID:", guestProcessingBookingId);
                    throw new Error("Temporary booking not found. Please try again.");
                }
                
                console.log("Found existing temporary booking:", existingBooking);
                
                // Update existing guest processing booking with complete data, preserving original serial_no
                const bookingData = {
                    ...guestForm, // Contains name, phone, email, status, payment_status, agent_id
                    bus_id: trip.bus_id,
                    bus_no: trip.bus_no,
                    serial_no: existingBooking.serial_no, // Preserve original serial_no
                    reserved_tickets: selectedSeats.length,
                    seat_no: selectedSeats.join(","),
                    pickup,
                    drop,
                    departure_date: formattedDepartureDate,
                    reason: null,
                    price: totalPrice,
                };
                
                console.log("=== ABOUT TO UPDATE BOOKING ===");
                console.log("UPDATE URL:", `${API_URL}/guest-bookings/${guestProcessingBookingId}`);
                console.log("UPDATE DATA:", bookingData);
                
                // Use updateGuestBooking service instead of direct axios call
                const response = await updateGuestBooking(guestProcessingBookingId, bookingData);
                console.log("=== UPDATE RESPONSE ===", response.data);
                
                // Store the final booking details for QR code
                const finalBooking = response.data;
                finalSerialNo = finalBooking.serial_no || existingBooking.serial_no;
                
                console.log("=== AFTER UPDATE ===");
                console.log("finalSerialNo:", finalSerialNo);
                console.log("About to clear guestProcessingBookingId...");
                
                const bookingIdToVerify = guestProcessingBookingId; // Store before clearing
                setGuestProcessingBookingId(null); // Clear processing booking ID
                
                // Delay the refresh and verify the booking still exists
                setTimeout(async () => {
                    console.log("=== VERIFYING BOOKING EXISTS BEFORE REFRESH ===");
                    try {
                        const verifyResponse = await axios.get(`${API_URL}/guest-bookings?bus_id=${trip.bus_id}&departure_date=${formattedDepartureDate}`);
                        const updatedBooking = verifyResponse.data.find(booking => booking.id === bookingIdToVerify);
                        console.log("Booking verification:", updatedBooking);
                        if (updatedBooking) {
                            console.log("=== BOOKING STILL EXISTS, TRIGGERING REFRESH ===");
                        } else {
                            console.log("=== WARNING: BOOKING DISAPPEARED! ===");
                        }
                    } catch (verifyErr) {
                        console.error("Error verifying booking:", verifyErr);
                    }
                    console.log("=== TRIGGERING REFRESH AFTER DELAY ===");
                    setRefreshTrigger(prev => prev + 1); // Trigger refresh of guest bookings
                }, 1000);
                
                console.log("=== REFRESH TRIGGERED ===");
                
                // Set final booking details for QR code generation
                const finalGuestDetails = {
                    ...guestForm,
                    serialNo: finalSerialNo
                };
                setGuestDetails(finalGuestDetails);
                
                console.log("=== FINAL GUEST DETAILS SET ===", finalGuestDetails);
            } else {
                console.log("=== CREATING NEW BOOKING ===");
                // Create new booking (fallback if no processing booking exists)
                const now = new Date();
                const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
                const rand = Math.floor(100 + Math.random() * 900);
                const serialNo = `BK-${yymmdd}-${rand}`;
                
                // Create booking data with special handling for agent bookings
                const bookingData = {
                    ...guestForm, // Contains name, phone, email
                    bus_id: trip.bus_id,
                    bus_no: trip.bus_no,
                    serial_no: serialNo,
                    reserved_tickets: selectedSeats.length,
                    seat_no: selectedSeats.join(","),
                    pickup,
                    drop,
                    departure_date: formattedDepartureDate,
                    reason: null,
                    price: totalPrice,
                    
                    // Special handling for agent bookings - always bypass payment API
                    ...(guestForm.agent_id && {
                        status: "Confirmed", // Auto-confirm agent bookings
                        payment_status: "Not Applicable" // No payment required for agent bookings
                    })
                };
                
                // Log for debugging
                console.log("GUEST BOOKING DATA:", bookingData);
                console.log("IS AGENT BOOKING:", !!guestForm.agent_id);
                
                // Use createGuestBooking service instead of direct axios call
                const response = await createGuestBooking(bookingData);
                console.log("New booking created:", response.data);
                
                finalSerialNo = response.data.serial_no || serialNo;
                
                // Set final booking details for QR code generation
                const finalGuestDetails = {
                    ...guestForm,
                    serialNo: finalSerialNo
                };
                setGuestDetails(finalGuestDetails);
            }
            
            console.log("=== BEFORE QR CODE GENERATION ===");
            console.log("finalSerialNo:", finalSerialNo);
            console.log("guestForm.agent_id:", guestForm.agent_id);
            console.log("guestForm.payment_status:", guestForm.payment_status);
            
            // Show different toast messages and handle QR code using the finalSerialNo
            if (guestForm.agent_id) {
                toast.success("Agent booking for passenger confirmed!");
                // Show QR code for agent bookings
                setQrBookingDetails({
                    busName: busInfo?.bus_name || trip.bus_no,
                    seatNumbers: selectedSeats,
                    pickup,
                    drop,
                    price: totalPrice,
                    serialNo: finalSerialNo,
                    date: trip.departure_date, // For display, keep original format
                });
                setShowQRCode(true);
            } else if (guestForm.payment_status === "Paid") {
                toast.success("Guest booking confirmed and paid!");
                // Show QR code for confirmed bookings
                setQrBookingDetails({
                    busName: busInfo?.bus_name || trip.bus_no,
                    seatNumbers: selectedSeats,
                    pickup,
                    drop,
                    price: totalPrice,
                    serialNo: finalSerialNo,
                    date: trip.departure_date, // For display, keep original format
                });
                setShowQRCode(true);
            } else {
                toast.info("Guest booking saved with pending payment.");
            }
            
            // Clear selected seats after successful booking
            setSelectedSeats([]);
            console.log("=== GUEST BOOKING COMPLETED ===");
        } catch (err) {
            console.error("=== GUEST BOOKING ERROR ===", err); // Add more detailed error logging
            if (err.response) {
                console.error("Error response data:", err.response.data);
                console.error("Error response status:", err.response.status);
            }
            toast.error("Failed to save booking: " + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Function to create temporary guest booking for seat protection
    const createTemporaryGuestBooking = async () => {
        if (isLoading) return; // Prevent multiple submissions
        setIsLoading(true);
        
        try {
            const now = new Date();
            const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
            const rand = Math.floor(100 + Math.random() * 900);
            const serialNo = `TEMP-${yymmdd}-${rand}`;
            const totalPrice = Number(trip.price) * selectedSeats.length;

            // Use the robust function to ensure MySQL-compatible date format
            const formattedDepartureDate = formatDateForMySQL(trip.departure_date);

            const tempBookingData = {
                name: "Temporary Guest", // Temporary placeholder name
                phone: "0000000000", // Temporary placeholder phone
                email: "",
                bus_id: trip.bus_id,
                bus_no: trip.bus_no,
                serial_no: serialNo,
                reserved_tickets: selectedSeats.length,
                seat_no: selectedSeats.join(","),
                pickup,
                drop,
                departure_date: formattedDepartureDate,
                reason: null,
                price: totalPrice,
                status: "Processing",
                payment_status: "Pending"
            };

            // Use the guestBookingService instead of direct axios call
            const response = await createGuestBooking(tempBookingData);
            console.log("Temporary booking created:", response.data);
            setGuestProcessingBookingId(response?.data?.id);
            console.log("Set guestProcessingBookingId to:", response?.data?.id);
            setRefreshTrigger(prev => prev + 1); // Trigger refresh to show processing seats
            setShowGuestForm(true);
        } catch (err) {
            toast.error("Failed to reserve seats: " + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Function to create initial booking with appropriate status based on user role
    const createInitialBooking = async () => {
        if (isLoading) return; // Prevent multiple submissions
        
        console.log("=== CREATE INITIAL BOOKING DEBUG ===");
        console.log("isSecondLeg:", isSecondLeg);
        console.log("firstTripBookingData:", firstTripBookingData);
        console.log("selectedView:", selectedView);
        console.log("isReturn:", isReturn);
        console.log("isBookingReturnTrip:", isBookingReturnTrip);
        
        // If this is the second leg of a round trip, proceed directly to booking
        if (isSecondLeg && firstTripBookingData) {
            console.log("This is second leg - proceeding with booking");
            console.log("firstTripBookingData received:", firstTripBookingData);
            // Store both trip data for final confirmation
            setFirstTripBooking(firstTripBookingData);
            setIsBookingReturnTrip(true);
            // Proceed with creating the second booking
            proceedWithBooking(false); // Show confirm modal for second leg
            return;
        }
        
        // Check if we need to show return trip choice modal
        // Show modal if: 
        // 1. User selected "Return" (selectedView === "bus") OR isReturn is true
        // 2. AND we're not already booking the return trip
        const shouldShowReturnChoice = ((selectedView === "bus") || (isReturn === true)) && !isBookingReturnTrip;
        console.log("shouldShowReturnChoice:", shouldShowReturnChoice);
        
        if (shouldShowReturnChoice) {
            console.log("Showing return choice modal");
            // Store current selection for the choice modal
            setFirstTripBooking({
                trip,
                selectedSeats: [...selectedSeats],
                isReturn: isReturn || false
            });
            console.log("Setting firstTripBooking with:", {
                trip: trip,
                selectedSeats: selectedSeats,
                isReturn: isReturn || false,
                journey_type: trip.journey_type,
                start_point: trip.start_point,
                end_point: trip.end_point
            });
            setShowReturnChoiceModal(true);
            return;
        }
        
        console.log("Proceeding with regular one-way booking");
        // Regular one-way booking
        proceedWithBooking(false); // Pass false to show confirm modal
    };

    // Helper function to proceed with actual booking creation
    const proceedWithBooking = async (skipConfirmModal = false) => {
        console.log("=== PROCEED WITH BOOKING ===");
        console.log("skipConfirmModal parameter:", skipConfirmModal);
        
        // Handle second leg of return booking for guest users
        if (isSecondLeg && firstTripBookingData && firstTripBookingData.isGuestBooking) {
            console.log("=== SECOND LEG GUEST BOOKING ===");
            console.log("Creating second temporary guest booking");
            
            setIsLoading(true);
            
            try {
                const now = new Date();
                const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
                const rand = Math.floor(100 + Math.random() * 900);
                const serialNo = `TEMP-${yymmdd}-${rand}`;
                const totalPrice = Number(trip.price) * selectedSeats.length;
                const formattedDepartureDate = formatDateForMySQL(trip.departure_date);

                const tempBookingData = {
                    name: "Temporary Guest", // Temporary placeholder name
                    phone: "0000000000", // Temporary placeholder phone
                    email: "",
                    bus_id: trip.bus_id,
                    bus_no: trip.bus_no,
                    serial_no: serialNo,
                    reserved_tickets: selectedSeats.length,
                    seat_no: selectedSeats.join(","),
                    pickup,
                    drop,
                    departure_date: formattedDepartureDate,
                    reason: null,
                    price: totalPrice,
                    status: "Processing",
                    payment_status: "Pending"
                };

                const secondBookingResponse = await createGuestBooking(tempBookingData);
                console.log("Second guest booking created with ID:", secondBookingResponse?.data?.id);
                
                setGuestProcessingBookingId(secondBookingResponse?.data?.id);
                setSecondTripBooking({
                    trip,
                    selectedSeats: [...selectedSeats],
                    bookingId: secondBookingResponse?.data?.id,
                    userType: 'guest',
                    isGuestBooking: true
                });
                
                setRefreshTrigger(prev => prev + 1); // Trigger refresh to show processing seats
                setShowCombinedConfirmModal(true);
            } catch (err) {
                toast.error("Failed to create second booking: " + (err.response?.data?.message || err.message));
            } finally {
                setIsLoading(false);
            }
            return;
        }
        
        if (!user) {
            // For guest users, create temporary booking to protect seats
            console.log("Guest user - creating temporary booking");
            createTemporaryGuestBooking();
            return;
        }

        setIsLoading(true);
        const busInfo = buses.find(bus => String(bus.bus_no) === String(trip.bus_no));
        if (!busInfo) {
            toast.error("Bus information not found.");
            setIsLoading(false);
            return;
        }
        let seatPrice = Number(trip.price);
        if (isNaN(seatPrice) || seatPrice <= 0) {
            toast.error("Seat price is missing or invalid. Please check trip details.");
            setIsLoading(false);
            return;
        }

        try {
            console.log(`Creating booking as ${user.role} user`);
            const now = new Date();
            const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
            const rand = Math.floor(100 + Math.random() * 900);
            const serialNo = `BK-${yymmdd}-${rand}`;
            const totalPrice = seatPrice * selectedSeats.length;
            
            // Use the robust function to ensure MySQL-compatible date format
            const formattedDepartureDate = formatDateForMySQL(trip.departure_date);

            // For all users, initial status is "Processing"
            // The status will be updated to "Confirmed" for admin/agent users after they confirm
            const bookingData = {
                user_id: user.id,
                bus_id: trip.bus_id,
                bus_no: trip.bus_no,
                serial_no: serialNo,
                reserved_tickets: selectedSeats.length,
                seat_no: selectedSeats.join(","),
                pickup,
                drop,
                role: user.role,
                departure_date: formattedDepartureDate,
                reason: null,
                price: totalPrice,
                status: "Processing",
                payment_status: "Pending"
            };

            const response = await createBooking(bookingData, user.token);
            setProcessingBookingId(response?.data?.id);
            setBookingId(response?.data?.id);
            
            // If this is the second leg of a round trip, handle based on user type from first leg
            if (isSecondLeg && firstTripBookingData) {
                console.log("=== SECOND LEG BOOKING ===");
                console.log("firstTripBookingData:", firstTripBookingData);
                console.log("Current trip (second leg):", trip);
                console.log("Response booking ID:", response?.data?.id);

                // Check user type from first trip booking
                const firstTripUserType = firstTripBookingData.userType?.toLowerCase();
                const isFirstTripGuest = firstTripBookingData.isGuestBooking;

                if (isFirstTripGuest) {
                    // First trip was guest booking, but now user is logged in
                    // This shouldn't normally happen, but handle gracefully
                    console.log("Warning: First trip was guest, but second trip is logged-in user");
                }

                // Update second booking status based on user type
                if (firstTripUserType === "admin" || firstTripUserType === "agent") {
                    // Admin/Agent - directly confirm the second booking as well
                    try {
                        await updateBookingStatus({
                            id: response?.data?.id,
                            payment_status: "Not Applicable",
                            status: "Confirmed",
                        }, user.token);
                        console.log("Second booking confirmed for admin/agent");
                    } catch (updateErr) {
                        console.error("Failed to confirm second booking:", updateErr);
                        toast.error("Second booking created but confirmation failed");
                    }
                }
                
                setSecondTripBooking({
                    trip,
                    selectedSeats: [...selectedSeats],
                    bookingId: response?.data?.id,
                    userType: firstTripUserType,
                    isGuestBooking: isFirstTripGuest
                });
                
                console.log("Set secondTripBooking with bookingId:", response?.data?.id);
                setShowCombinedConfirmModal(true);
            } else if (!skipConfirmModal) {
                console.log("Showing ConfirmBooking modal");
                // Show ConfirmBooking modal only if not skipping
                setShowModal(true);
            } else {
                console.log("Skipping ConfirmBooking modal - proceeding directly");
                // If skipping confirm modal, handle admin/agent direct confirmation
                if (user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "agent") {
                    try {
                        await updateBookingStatus(response?.data?.id, "Confirmed", user.token);
                        toast.success("Booking confirmed successfully!");
                        
                        const bookingDetails = {
                            busName: busInfo?.bus_name || trip.bus_no,
                            seatNumbers: selectedSeats,
                            pickup,
                            drop,
                            price: Number(trip.price) * selectedSeats.length,
                            serialNo: response?.data?.id,
                            date: trip.departure_date,
                        };
                        
                        setQrBookingDetails(bookingDetails);
                        setShowQRCode(true);
                        setSelectedSeats([]);
                    } catch (updateErr) {
                        toast.error("Booking created but confirmation failed: " + (updateErr.response?.data?.message || updateErr.message));
                    }
                } else {
                    // For regular users, proceed to payment directly
                    setShowPayment(true);
                }
            }
        } catch (err) {
            toast.error("Failed to create booking: " + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBooking = async () => {
        // This function handles the confirmation logic after initial booking is created
        if (isLoading) return; // Prevent multiple submissions
        
        if (!user) {
            toast.error("User not found.");
            return;
        }

        if (!processingBookingId) {
            toast.error("No booking found to confirm.");
            return;
        }

        setIsLoading(true);
        
        try {
            // For display purposes, keep original format
            const displayDate = trip.departure_date;
            
            if (user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "agent") {
                // For admin and agent users, bypass payment API completely
                console.log(`${user.role.toUpperCase()} BOOKING - BYPASSING PAYMENT API`);
                console.log(`Setting payment_status to "Not Applicable" and status to "Confirmed"`);
                
                // Direct confirmation without payment
                await updateBookingStatus({
                    id: processingBookingId,
                    payment_status: "Not Applicable", // Important: Set payment status to Not Applicable
                    status: "Confirmed",
                }, user.token);
                
                setSelectedSeats([]);
                setShowModal(false);
                toast.success(`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} booking confirmed successfully!`);
                
                // Generate QR code for the confirmed booking
                const busInfo = buses.find(bus => String(bus.bus_no) === String(trip.bus_no));
                setQrBookingDetails({
                    busName: busInfo?.bus_name || trip.bus_no,
                    seatNumbers: selectedSeats,
                    pickup,
                    drop,
                    price: Number(trip.price) * selectedSeats.length,
                    serialNo: processingBookingId,
                    date: displayDate,
                });
                setShowQRCode(true);
            } else {
                // For regular users, proceed to payment API
                console.log("REGULAR USER BOOKING - PROCEEDING TO PAYMENT API");
                setShowModal(false);
                setShowPayment(true);
            }
        } catch (err) {
            console.error("Booking confirmation failed:", err);
            toast.error("Booking confirmation failed: " + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Function to cancel/delete the processing booking
    const cancelProcessingBooking = async () => {
        if (isLoading) return; // Prevent multiple submissions
        
        if (processingBookingId) {
            setIsLoading(true);
            try {
                // Delete the booking from backend
                await deleteBooking(processingBookingId, user?.token);
                setProcessingBookingId(null);
                setBookingId(null);
                toast.info("Booking cancelled successfully.");
            } catch (err) {
                console.error("Failed to cancel booking:", err);
                toast.error("Failed to cancel booking.");
            } finally {
                setIsLoading(false);
            }
        }
        setShowModal(false);
    };

    // Function to cancel/delete guest processing booking (only when user explicitly cancels)
    // const cancelGuestProcessingBooking = async () => {
    //     console.log("=== CANCELLING GUEST PROCESSING BOOKING ===", guestProcessingBookingId);
    //     if (guestProcessingBookingId) {
    //         try {
    //             await axios.delete(`${API_URL}/guest-bookings/${guestProcessingBookingId}`);
    //             setGuestProcessingBookingId(null);
    //             setRefreshTrigger(prev => prev + 1); // Refresh to remove processing seats
    //             toast.info("Booking cancelled successfully.");
    //         } catch (err) {
    //             console.error("Failed to cancel guest booking:", err);
    //             toast.error("Failed to cancel booking.");
    //         }
    //     }
    //     setShowGuestForm(false);
    //     setSelectedSeats([]); // Clear selected seats when cancelling
    // };

    // Function to simply close the form without cancelling booking (used after successful booking)
    const closeGuestForm = () => {
        console.log("=== CLOSING GUEST FORM WITHOUT CANCELLING ===");
        setShowGuestForm(false);
        setGuestProcessingBookingId(null);
        setSelectedSeats([]); // Clear selected seats
    };

    // Function to force cancel guest booking (used for user-initiated cancellations like close button, login, signup)
    const forceCancelGuestProcessingBooking = async () => {
        console.log("=== FORCE CANCELLING GUEST PROCESSING BOOKING ===", guestProcessingBookingId);
        if (guestProcessingBookingId) {
            try {
                // Use deleteGuestBooking service instead of direct axios call
                await deleteGuestBooking(guestProcessingBookingId);
                setRefreshTrigger(prev => prev + 1); // Refresh to remove processing seats
                toast.info("Booking cancelled successfully.");
            } catch (err) {
                console.error("Failed to cancel guest booking:", err);
                toast.error("Failed to cancel booking.");
            }
        }
        setGuestProcessingBookingId(null);
        setShowGuestForm(false);
        setSelectedSeats([]); // Clear selected seats when cancelling
    };

    const handlePayment = async (paymentStatus) => {
        if (paymentStatus === "Paid") {
            try {
                // Handle payment for both bookings if it's a combined booking
                if (secondTripBooking && firstTripBookingData) {
                    console.log("=== UPDATING BOTH BOOKINGS ===");
                    const firstBookingId = firstTripBookingData?.bookingId || processingBookingId;
                    const secondBookingId = secondTripBooking?.bookingId;
                    
                    console.log("First booking ID:", firstBookingId);
                    console.log("Second booking ID:", secondBookingId);
                    console.log("Is guest booking:", firstTripBookingData?.isGuestBooking);

                    if (firstTripBookingData?.isGuestBooking) {
                        // Handle guest booking updates
                        console.log("Updating guest bookings");
                        await Promise.all([
                            updateGuestBooking(firstBookingId, {
                                payment_status: "Paid",
                                status: "Confirmed",
                            }),
                            updateGuestBooking(secondBookingId, {
                                payment_status: "Paid", 
                                status: "Confirmed",
                            })
                        ]);
                    } else {
                        // Handle regular booking updates
                        console.log("Updating regular bookings");
                        await Promise.all([
                            updateBookingStatus({
                                id: firstBookingId,
                                payment_status: "Paid",
                                status: "Confirmed",
                            }, user.token),
                            updateBookingStatus({
                                id: secondBookingId,
                                payment_status: "Paid",
                                status: "Confirmed",
                            }, user.token)
                        ]);
                    }

                    console.log("Both bookings updated successfully");
                    toast.success("Payment successful! Both bookings confirmed.");
                    
                    // Generate combined QR code
                    const combinedBookingDetails = {
                        firstTrip: {
                            busName: buses.find(bus => String(bus.bus_no) === String(firstTripBookingData.trip.bus_no))?.bus_name || firstTripBookingData.trip.bus_no,
                            seatNumbers: firstTripBookingData.selectedSeats,
                            pickup: firstTripBookingData.trip.start_point,
                            drop: firstTripBookingData.trip.end_point,
                            price: Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length,
                            serialNo: firstBookingId,
                            date: firstTripBookingData.trip.departure_date,
                        },
                        secondTrip: {
                            busName: buses.find(bus => String(bus.bus_no) === String(secondTripBooking.trip.bus_no))?.bus_name || secondTripBooking.trip.bus_no,
                            seatNumbers: secondTripBooking.selectedSeats,
                            pickup: secondTripBooking.trip.start_point,
                            drop: secondTripBooking.trip.end_point,
                            price: Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length,
                            serialNo: secondBookingId,
                            date: secondTripBooking.trip.departure_date,
                        },
                        totalAmount: (
                            (Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length) +
                            (Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length)
                        ),
                        isCombined: true
                    };
                    
                    setQrBookingDetails(combinedBookingDetails);
                    setShowPayment(false);
                    setShowQRCode(true);
                    setSelectedSeats([]);
                    
                    // Clear booking IDs after successful payment
                    setProcessingBookingId(null);
                    setGuestProcessingBookingId(null);
                    setFirstTripBooking(null);
                    setSecondTripBooking(null);
                } else {
                    console.log("=== UPDATING SINGLE BOOKING ===");
                    console.log("Single booking ID:", bookingId);
                    console.log("Guest processing booking ID:", guestProcessingBookingId);
                    
                    const targetBookingId = guestProcessingBookingId || bookingId;
                    
                    if (guestProcessingBookingId) {
                        // Handle single guest booking payment
                        console.log("Updating single guest booking");
                        await updateGuestBooking(targetBookingId, {
                            payment_status: "Paid",
                            status: "Confirmed",
                        });
                    } else {
                        // Handle single regular booking payment
                        console.log("Updating single regular booking");
                        await updateBookingStatus({
                            id: targetBookingId,
                            payment_status: "Paid",
                            status: "Confirmed",
                        }, user.token);
                    }
                    
                    setSelectedSeats([]);
                    setShowPayment(false);
                    toast.success("Payment successful! Booking confirmed.");
                    
                    // For display purposes, keep original format
                    const displayDate = trip.departure_date;
                    
                    setQrBookingDetails({
                        busName: busInfo?.bus_name || trip.bus_no,
                        seatNumbers: selectedSeats,
                        pickup,
                        drop,
                        price: Number(trip.price) * selectedSeats.length,
                        serialNo: targetBookingId,
                        date: displayDate,
                    });
                    setShowQRCode(true);
                    
                    // Clear booking IDs after successful payment
                    setProcessingBookingId(null);
                    setGuestProcessingBookingId(null);
                }
            } catch (err) {
                console.error("Payment update failed:", err);
                setShowPayment(false);
                toast.error("Payment update failed: " + (err.response?.data?.message || err.message));
            }
        } else if (paymentStatus === "Pending") {
            setShowPayment(false);
            toast.info("You can pay later. Booking remains pending.");
            navigate("/passengerdash");
        }
    };

    const handlePaymentSuccess = () => handlePayment("Paid");
    // const handlePaymentPayLater = () => handlePayment("Pending");

    // Return trip choice handlers
    const handleContinueOneWay = () => {
        console.log("=== HANDLE CONTINUE ONE WAY ===");
        setShowReturnChoiceModal(false);
        console.log("Calling proceedWithBooking with skipConfirmModal = true");
        // Proceed directly with booking and skip confirm modal
        proceedWithBooking(true); // Pass true to skip confirm modal
    };

    const handleBookReturn = async () => {
        setShowReturnChoiceModal(false);
        
        try {
            // First, create the booking for the current selection
            console.log("=== CREATING FIRST TRIP BOOKING ===");
            console.log("Creating booking for first trip:", trip);

            const busInfo = buses.find(bus => String(bus.bus_no) === String(trip.bus_no));
            if (!busInfo) {
                toast.error("Bus information not found.");
                return;
            }

            setIsLoading(true);

            // Create first trip booking based on user type (same logic as one-way booking)
            const now = new Date();
            const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
            const rand = Math.floor(100 + Math.random() * 900);
            const totalPrice = Number(trip.price) * selectedSeats.length;
            const formattedDepartureDate = formatDateForMySQL(trip.departure_date);

            let firstBookingResponse;

            if (!user) {
                // Guest user - create temporary booking
                const serialNo = `TEMP-${yymmdd}-${rand}`;
                const tempBookingData = {
                    name: "Temporary Guest", // Temporary placeholder name
                    phone: "0000000000", // Temporary placeholder phone
                    email: "",
                    bus_id: trip.bus_id,
                    bus_no: trip.bus_no,
                    serial_no: serialNo,
                    reserved_tickets: selectedSeats.length,
                    seat_no: selectedSeats.join(","),
                    pickup,
                    drop,
                    departure_date: formattedDepartureDate,
                    reason: null,
                    price: totalPrice,
                    status: "Processing",
                    payment_status: "Pending"
                };

                firstBookingResponse = await createGuestBooking(tempBookingData);
            } else {
                // Logged-in user (admin/agent/regular user)
                const serialNo = user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "agent" 
                    ? `BK-${yymmdd}-${rand}` 
                    : `BK-${yymmdd}-${rand}`;

                const firstBookingData = {
                    user_id: user.id,
                    bus_id: trip.bus_id,
                    bus_no: trip.bus_no,
                    serial_no: serialNo,
                    reserved_tickets: selectedSeats.length,
                    seat_no: selectedSeats.join(","),
                    pickup,
                    drop,
                    role: user.role,
                    departure_date: formattedDepartureDate,
                    reason: null,
                    price: totalPrice,
                    status: user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "agent" ? "Confirmed" : "Processing",
                    payment_status: user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "agent" ? "Not Applicable" : "Pending"
                };

                firstBookingResponse = await createBooking(firstBookingData, user.token);
            }
            console.log("First booking created with ID:", firstBookingResponse?.data?.id);

            // Store first trip booking with the booking ID and user type info
            const firstTripBookingWithId = {
                trip,
                selectedSeats: [...selectedSeats],
                isReturn: isReturn || false,
                bookingId: firstBookingResponse?.data?.id,
                userType: user ? user.role : 'guest', // Track user type for second leg
                isGuestBooking: !user // Flag to indicate if this is a guest booking
            };

            // Determine the correct date based on current trip type and what we're searching for
            let searchDate;
            let searchDirection;
            
            if (trip.journey_type === 'return') {
                // Current selection is return trip, we're searching for outbound trips
                // Use the original outbound date, not the return date
                searchDate = originalSearchParams?.date || trip.departure_date;
                searchDirection = "outbound trips (from return selection)";
            } else {
                // Current selection is outbound trip, we're searching for return trips  
                // Use the original return date, not the outbound date
                searchDate = originalSearchParams?.returnDate || trip.departure_date;
                searchDirection = "return trips (from outbound selection)";
            }
            
            const formattedSearchDate = formatDateForMySQL(searchDate);
            console.log(`Searching for ${searchDirection}:`, {
                from: trip.end_point,
                to: trip.start_point,
                date: formattedSearchDate,
                originalSearchDate: searchDate,
                currentTripType: trip.journey_type
            });
            
            const returnResults = await locationService.searchBusTripsByRoute(
                trip.end_point, // Reverse direction
                trip.start_point, // Reverse direction
                formattedSearchDate
            );
            
            console.log("Return trip search results:", returnResults);
            
            if (returnResults && returnResults.trips && returnResults.trips.length > 0) {
                setIsBookingReturnTrip(true);
                // Navigate to bus list with return trips
                navigate('/busList', {
                    state: {
                        searchResults: returnResults.trips.map(returnTrip => ({
                            ...returnTrip,
                            journey_type: isReturn || (trip.journey_type === 'return') ? 'outbound' : 'return',
                            journey_label: `${returnTrip.start_point} → ${returnTrip.end_point}`
                        })),
                        searchParams: {
                            from: trip.end_point,
                            to: trip.start_point,
                            date: formattedSearchDate,
                            isReturn: !(isReturn || (trip.journey_type === 'return')), // Opposite of first selection
                            isSecondLeg: true, // Flag to indicate this is second leg of round trip
                            firstTripBooking: firstTripBookingWithId // Pass the booking with ID and user info
                        }
                    }
                });
            } else {
                // If no return trips found, delete/cleanup the first booking
                try {
                    if (!user) {
                        // Guest booking - use guest booking service
                        await deleteGuestBooking(firstBookingResponse?.data?.id);
                    } else {
                        // Regular booking - use regular booking service
                        await deleteBooking(firstBookingResponse?.data?.id, user.token);
                    }
                } catch (deleteErr) {
                    console.error("Failed to cleanup first booking:", deleteErr);
                }
                toast.error("No return trips available for the selected route and date.");
            }
        } catch (error) {
            console.error("Error in handleBookReturn:", error);
            toast.error("Failed to create booking or fetch return trips. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Combined booking confirmation handlers
    // Cleanup function to delete both bookings when combined booking is cancelled
    const handleCombinedBookingCancel = async () => {
        try {
            console.log("=== CANCELLING COMBINED BOOKING ===");
            
            // Delete both bookings based on their types
            const deletePromises = [];
            
            if (firstTripBookingData?.bookingId) {
                console.log("Deleting first trip booking ID:", firstTripBookingData.bookingId);
                console.log("First trip is guest booking:", firstTripBookingData.isGuestBooking);
                
                if (firstTripBookingData.isGuestBooking) {
                    deletePromises.push(deleteGuestBooking(firstTripBookingData.bookingId));
                } else {
                    deletePromises.push(deleteBooking(firstTripBookingData.bookingId, user?.token));
                }
            }
            
            if (secondTripBooking?.bookingId) {
                console.log("Deleting second trip booking ID:", secondTripBooking.bookingId);
                console.log("Second trip is guest booking:", secondTripBooking.isGuestBooking);
                
                if (secondTripBooking.isGuestBooking) {
                    deletePromises.push(deleteGuestBooking(secondTripBooking.bookingId));
                } else {
                    deletePromises.push(deleteBooking(secondTripBooking.bookingId, user?.token));
                }
            }
            
            // Wait for both deletions to complete
            await Promise.all(deletePromises);
            
            console.log("Both bookings deleted successfully");
            toast.success("Booking cancelled successfully");
            
        } catch (error) {
            console.error("Error deleting bookings:", error);
            toast.error("Failed to cancel booking. Please contact support.");
        } finally {
            // Reset states and close modal
            setShowCombinedConfirmModal(false);
            setFirstTripBooking(null);
            setSecondTripBooking(null);
            setIsBookingReturnTrip(false);
            setGuestProcessingBookingId(null);
            // Refresh bookings data
            setRefreshTrigger(prev => prev + 1);
        }
    };

    const handleCombinedBookingConfirm = async () => {
        setIsLoading(true);

        try {
            const firstBookingId = firstTripBookingData?.bookingId || processingBookingId;
            const secondBookingId = secondTripBooking?.bookingId;
            
            console.log("=== COMBINED BOOKING CONFIRM ===");
            console.log("First booking ID:", firstBookingId);
            console.log("Second booking ID:", secondBookingId);
            console.log("First trip user type:", firstTripBookingData?.userType);
            console.log("First trip is guest booking:", firstTripBookingData?.isGuestBooking);
            console.log("Second trip is guest booking:", secondTripBooking?.isGuestBooking);

            // Determine the user type from first trip booking
            const userType = firstTripBookingData?.userType?.toLowerCase();
            const isGuestBooking = firstTripBookingData?.isGuestBooking;

            if (isGuestBooking) {
                // Guest user - show guest form for both bookings
                console.log("Guest booking - showing guest form");
                setShowCombinedConfirmModal(false);
                setShowGuestForm(true);
            } else if (userType === "admin" || userType === "agent") {
                // Admin/Agent users - confirm both bookings directly
                console.log("Admin/Agent booking - confirming both bookings directly");
                
                await Promise.all([
                    updateBookingStatus({
                        id: firstBookingId,
                        payment_status: "Not Applicable",
                        status: "Confirmed",
                    }, user.token),
                    updateBookingStatus({
                        id: secondBookingId,
                        payment_status: "Not Applicable", 
                        status: "Confirmed",
                    }, user.token)
                ]);

                toast.success("Both bookings confirmed successfully!");
                
                // Generate combined QR codes for both bookings
                const combinedBookingDetails = {
                    firstTrip: {
                        busName: buses.find(bus => String(bus.bus_no) === String(firstTripBookingData.trip.bus_no))?.bus_name || firstTripBookingData.trip.bus_no,
                        seatNumbers: firstTripBookingData.selectedSeats,
                        pickup: firstTripBookingData.trip.start_point,
                        drop: firstTripBookingData.trip.end_point,
                        price: Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length,
                        serialNo: firstBookingId,
                        date: firstTripBookingData.trip.departure_date,
                    },
                    secondTrip: {
                        busName: buses.find(bus => String(bus.bus_no) === String(secondTripBooking.trip.bus_no))?.bus_name || secondTripBooking.trip.bus_no,
                        seatNumbers: secondTripBooking.selectedSeats,
                        pickup: secondTripBooking.trip.start_point,
                        drop: secondTripBooking.trip.end_point,
                        price: Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length,
                        serialNo: secondBookingId,
                        date: secondTripBooking.trip.departure_date,
                    },
                    totalAmount: (
                        (Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length) +
                        (Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length)
                    ),
                    isCombined: true
                };
                
                setQrBookingDetails(combinedBookingDetails);
                setShowCombinedConfirmModal(false);
                setShowQRCode(true);
                setSelectedSeats([]);
            } else {
                // Regular logged-in users - proceed to payment
                console.log("Regular user booking - proceeding to payment for both bookings");
                setShowCombinedConfirmModal(false);
                setShowPayment(true);
            }
        } catch (err) {
            console.error("Error confirming combined booking:", err);
            toast.error("Failed to confirm booking: " + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="w-full">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-4 text-lg text-blue-600">Loading seat data...</span>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row justify-center items-stretch pt-1 sm:pt-2 gap-2 md:gap-4">
                        <div className="w-full md:w-auto">
                            <div className="p-2 sm:p-4 bg-white shadow-xl rounded-xl max-w-full md:max-w-md mx-auto">
                                <h2 className="text-base sm:text-lg font-bold mb-2 text-center">Seat Booking</h2>
                                <div className="flex justify-between items-center mb-2 px-2">
                                    <span className="text-xs sm:text-sm text-gray-500">Front</span>
                                    <span className="font-medium text-gray-600 flex items-center gap-1">
                                        Driver <span role="img"><RiSteering2Fill className="text-xl sm:text-2xl" /></span>
                                    </span>
                                </div>
                                {renderMainRows()}
                                {renderBackRow()}
                                <div className="mt-2">
                                    <div className="flex justify-evenly flex-wrap gap-1 sm:gap-2">
                                        <div className="flex gap-1 items-center">
                                            <span className="text-xs sm:text-sm">Available seats:</span>
                                            <div className="bg-gray-300 h-3 w-6 sm:h-4 sm:w-8 rounded-lg"></div>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <span className="text-xs sm:text-sm">Booked seats:</span>
                                            <div className="bg-red-600 h-3 w-6 sm:h-4 sm:w-8 rounded-lg"></div>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <span className="text-xs sm:text-sm">Processing seats:</span>
                                            <div className="bg-green-600 h-3 w-6 sm:h-4 sm:w-8 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-sm sm:text-base font-semibold">Selected Seats:</h3>
                                    <div className="mt-1 text-blue-600 font-medium text-xs sm:text-sm">
                                        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        console.log("=== BUTTON CLICKED ===");
                                        console.log("About to call createInitialBooking");
                                        // if (!pickup || !drop) {
                                        //     toast.error("Please select pickup and drop locations.", {
                                        //         position: "top-center",
                                        //         autoClose: 3000,
                                        //         hideProgressBar: false,
                                        //         closeOnClick: true,
                                        //         pauseOnHover: true,
                                        //         draggable: true,
                                        //         progress: undefined,
                                        //         theme: "colored",
                                        //     });
                                        //     return;
                                        // }
                                        createInitialBooking(); // Changed from setShowModal(true)
                                    }}
                                    className="mt-3 w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 sm:py-2 px-4 sm:px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    disabled={selectedSeats.length === 0 || isLoading}
                                >
                                    {isLoading ? "Processing..." : "Proceed to Book"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Show ConfirmBooking modal when showModal is true */}
                {showModal && (
                    <ConfirmBooking
                        selectedSeats={selectedSeats}
                        onClose={cancelProcessingBooking}
                        trip={trip}
                        isLoading={isLoading}
                        userRole={user?.role} // Pass user role to control UI elements in ConfirmBooking
                        onConfirm={async () => {
                            console.log("ConfirmBooking: onConfirm called");
                            
                            // Handle confirmation based on user type
                            if (!user && !guestDetails) {
                                console.log("No user or guest details found, showing guest form");
                                setShowModal(false);
                                setShowGuestForm(true);
                            } else if (guestDetails) {
                                console.log("Using existing guest details:", guestDetails);
                                // This case handles when we already have guest details
                                setShowModal(false);
                                // Process the booking with existing guest details
                                await handleGuestBooking(guestDetails);
                            } else {
                                console.log(`Confirming booking for ${user.role} user`);
                                
                                // For all user types, this confirms their booking
                                // For admins/agents: Updates to Confirmed + Not Applicable (bypassing payment)
                                // For regular users: Shows payment API
                                await handleBooking();
                            }
                        }}
                        onAgentBookForPassenger={async () => {
                            // This is only shown to agents who want to book for a passenger
                            if (isLoading) return;
                            
                            console.log("AGENT BOOKING FOR PASSENGER");
                            console.log("Showing guest form while keeping agent's processing booking");
                            
                            // We no longer delete the agent's booking here
                            // Instead, we just show the guest form and keep the processingBookingId for later deletion
                            
                            // Show guest form for agent to enter passenger details
                            setShowModal(false);
                            setShowGuestForm(true);
                        }}
                    />
                )}
                {/* Show GuestBookingForm as a modal, replacing seat plan, only if showGuestForm is true */}
                {showGuestForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <GuestBookingForm
                            onSubmit={async (guestForm) => {
                                console.log("Parent onSubmit called with:", guestForm, "Processing ID:", guestProcessingBookingId);
                                
                                try {
                                    // Check if this is a combined booking (return trip) - either both guest or mixed agent/guest
                                    const isCombinedBooking = firstTripBookingData && secondTripBooking;
                                    
                                    if (isCombinedBooking) {
                                        console.log("=== COMBINED BOOKING FOR PASSENGER ===");
                                        console.log("First trip is guest booking:", firstTripBookingData.isGuestBooking);
                                        console.log("Second trip is guest booking:", secondTripBooking.isGuestBooking);
                                        
                                        const deletePromises = [];
                                        const createPromises = [];
                                        
                                        // Handle first trip booking
                                        if (firstTripBookingData.isGuestBooking) {
                                            // Update existing guest booking
                                            createPromises.push(
                                                updateGuestBooking(firstTripBookingData.bookingId, {
                                                    ...guestForm,
                                                    bus_id: firstTripBookingData.trip.bus_id,
                                                    bus_no: firstTripBookingData.trip.bus_no,
                                                    reserved_tickets: firstTripBookingData.selectedSeats.length,
                                                    seat_no: firstTripBookingData.selectedSeats.join(","),
                                                    pickup: firstTripBookingData.trip.start_point,
                                                    drop: firstTripBookingData.trip.end_point,
                                                    departure_date: formatDateForMySQL(firstTripBookingData.trip.departure_date),
                                                    reason: null,
                                                    price: Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length,
                                                })
                                            );
                                        } else {
                                            // Delete agent booking and create guest booking
                                            deletePromises.push(deleteBooking(firstTripBookingData.bookingId, user?.token));
                                            
                                            // Generate unique serial number for the guest booking
                                            const now = new Date();
                                            const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
                                            const rand1 = Math.floor(100 + Math.random() * 900);
                                            const firstTripSerialNo = `BK-${yymmdd}-${rand1}`;
                                            
                                            createPromises.push(
                                                createGuestBooking({
                                                    ...guestForm,
                                                    bus_id: firstTripBookingData.trip.bus_id,
                                                    bus_no: firstTripBookingData.trip.bus_no,
                                                    serial_no: firstTripSerialNo,
                                                    reserved_tickets: firstTripBookingData.selectedSeats.length,
                                                    seat_no: firstTripBookingData.selectedSeats.join(","),
                                                    pickup: firstTripBookingData.trip.start_point,
                                                    drop: firstTripBookingData.trip.end_point,
                                                    departure_date: formatDateForMySQL(firstTripBookingData.trip.departure_date),
                                                    reason: null,
                                                    price: Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length,
                                                    status: "Confirmed",
                                                    payment_status: "Not Applicable",
                                                    agent_id: user?.id
                                                })
                                            );
                                        }
                                        
                                        // Handle second trip booking
                                        if (secondTripBooking.isGuestBooking) {
                                            // Update existing guest booking
                                            createPromises.push(
                                                updateGuestBooking(secondTripBooking.bookingId, {
                                                    ...guestForm,
                                                    bus_id: secondTripBooking.trip.bus_id,
                                                    bus_no: secondTripBooking.trip.bus_no,
                                                    reserved_tickets: secondTripBooking.selectedSeats.length,
                                                    seat_no: secondTripBooking.selectedSeats.join(","),
                                                    pickup: secondTripBooking.trip.start_point,
                                                    drop: secondTripBooking.trip.end_point,
                                                    departure_date: formatDateForMySQL(secondTripBooking.trip.departure_date),
                                                    reason: null,
                                                    price: Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length,
                                                })
                                            );
                                        } else {
                                            // Delete agent booking and create guest booking
                                            deletePromises.push(deleteBooking(secondTripBooking.bookingId, user?.token));
                                            
                                            // Generate unique serial number for the guest booking
                                            const now = new Date();
                                            const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
                                            const rand2 = Math.floor(100 + Math.random() * 900);
                                            const secondTripSerialNo = `BK-${yymmdd}-${rand2}`;
                                            
                                            createPromises.push(
                                                createGuestBooking({
                                                    ...guestForm,
                                                    bus_id: secondTripBooking.trip.bus_id,
                                                    bus_no: secondTripBooking.trip.bus_no,
                                                    serial_no: secondTripSerialNo,
                                                    reserved_tickets: secondTripBooking.selectedSeats.length,
                                                    seat_no: secondTripBooking.selectedSeats.join(","),
                                                    pickup: secondTripBooking.trip.start_point,
                                                    drop: secondTripBooking.trip.end_point,
                                                    departure_date: formatDateForMySQL(secondTripBooking.trip.departure_date),
                                                    reason: null,
                                                    price: Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length,
                                                    status: "Confirmed",
                                                    payment_status: "Not Applicable",
                                                    agent_id: user?.id
                                                })
                                            );
                                        }
                                        
                                        // First delete agent bookings, then create/update guest bookings
                                        if (deletePromises.length > 0) {
                                            console.log("Deleting agent bookings...");
                                            await Promise.all(deletePromises);
                                        }
                                        
                                        console.log("Creating/updating guest bookings...");
                                        await Promise.all(createPromises);
                                        
                                        console.log("Both passenger bookings created/updated successfully");
                                        toast.success("Agent booking for passenger confirmed!");
                                        
                                        // Generate combined QR code for confirmed passenger bookings
                                        const combinedBookingDetails = {
                                            firstTrip: {
                                                busName: buses.find(bus => String(bus.bus_no) === String(firstTripBookingData.trip.bus_no))?.bus_name || firstTripBookingData.trip.bus_no,
                                                seatNumbers: firstTripBookingData.selectedSeats,
                                                pickup: firstTripBookingData.trip.start_point,
                                                drop: firstTripBookingData.trip.end_point,
                                                price: Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length,
                                                serialNo: "Passenger Booking",
                                                date: firstTripBookingData.trip.departure_date,
                                            },
                                            secondTrip: {
                                                busName: buses.find(bus => String(bus.bus_no) === String(secondTripBooking.trip.bus_no))?.bus_name || secondTripBooking.trip.bus_no,
                                                seatNumbers: secondTripBooking.selectedSeats,
                                                pickup: secondTripBooking.trip.start_point,
                                                drop: secondTripBooking.trip.end_point,
                                                price: Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length,
                                                serialNo: "Passenger Booking",
                                                date: secondTripBooking.trip.departure_date,
                                            },
                                            totalAmount: (
                                                (Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length) +
                                                (Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length)
                                            ),
                                            isCombined: true,
                                            isAgentBooking: true
                                        };
                                        
                                        setQrBookingDetails(combinedBookingDetails);
                                        setShowGuestForm(false);
                                        setShowQRCode(true);
                                        setSelectedSeats([]);
                                        
                                        // Clear booking states
                                        setProcessingBookingId(null);
                                        setGuestProcessingBookingId(null);
                                        setFirstTripBooking(null);
                                        setSecondTripBooking(null);
                                    } else {
                                        // Single booking - original logic
                                        await handleGuestBooking(guestForm);
                                        
                                        // After successful guest booking, delete the agent's original booking if it exists
                                        if (processingBookingId && user?.role?.toLowerCase() === 'agent') {
                                            console.log("Deleting agent's original booking after successful guest booking:", processingBookingId);
                                            try {
                                                await deleteBooking(processingBookingId, user?.token);
                                                console.log("Successfully deleted agent's booking after creating guest booking");
                                            } catch (deleteErr) {
                                                console.error("Failed to delete agent's booking:", deleteErr);
                                                toast.warning("Guest booking created, but failed to clean up agent booking record.");
                                            }
                                        }
                                        
                                        // Clear the booking IDs
                                        setProcessingBookingId(null);
                                        setBookingId(null);
                                        
                                        // Close the form without cancelling the guest booking
                                        closeGuestForm();
                                    }
                                } catch (err) {
                                    console.error("Failed to complete guest booking:", err);
                                    toast.error("Failed to update guest booking: " + (err.response?.data?.message || err.message));
                                    // If guest booking fails, keep the form open and don't delete the agent's booking
                                }
                            }}
                            onLogin={() => { 
                                forceCancelGuestProcessingBooking(); // Force cancel guest booking before login
                                navigate("/login", { state: { from: location.pathname } }); 
                            }}
                            onSignup={() => { 
                                forceCancelGuestProcessingBooking(); // Force cancel guest booking before signup
                                navigate("/signup", { state: { from: location.pathname } }); 
                            }}
                            onClose={forceCancelGuestProcessingBooking} // Use force cancel function for close button
                            totalAmount={
                                firstTripBookingData && secondTripBooking 
                                    ? (Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length) + (Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length)
                                    : Number(trip.price) * selectedSeats.length
                            }
                            agentId={user?.role?.toLowerCase() === 'agent' ? user.id : null}
                            isAgentBooking={user?.role?.toLowerCase() === 'agent'}
                            processingBookingId={guestProcessingBookingId} // Pass processing booking ID for reference
                            onRefresh={() => setRefreshTrigger(prev => prev + 1)} // Pass refresh callback
                            isCombinedBooking={firstTripBookingData && secondTripBooking} // Flag to prevent automatic payment in combined bookings
                        />
                    </div>
                )}
                {showPayment && (
                    <PaymentAPI
                        amount={
                            secondTripBooking && firstTripBookingData 
                                ? (Number(firstTripBookingData.trip.price) * firstTripBookingData.selectedSeats.length) + (Number(secondTripBooking.trip.price) * secondTripBooking.selectedSeats.length)
                                : Number(trip.price) * selectedSeats.length
                        }
                        onSuccess={handlePaymentSuccess}
                        onCancel={async () => {
                            // Cancel logic: delete the booking(s) and close payment modal
                            if (secondTripBooking && firstTripBookingData) {
                                // Cancel both bookings
                                try {
                                    const firstBookingId = firstTripBookingData?.bookingId || processingBookingId;
                                    const secondBookingId = secondTripBooking?.bookingId;
                                    
                                    if (firstTripBookingData?.isGuestBooking) {
                                        // Handle guest booking cancellation
                                        await Promise.all([
                                            deleteGuestBooking(firstBookingId),
                                            deleteGuestBooking(secondBookingId)
                                        ]);
                                    } else {
                                        // Handle regular booking cancellation
                                        await Promise.all([
                                            deleteBooking(firstBookingId, user?.token),
                                            deleteBooking(secondBookingId, user?.token)
                                        ]);
                                    }
                                    
                                    toast.info("Both bookings cancelled successfully.");
                                } catch (err) {
                                    console.error("Failed to cancel bookings:", err);
                                    toast.error("Failed to cancel bookings.");
                                }
                            } else {
                                // Cancel single booking
                                try {
                                    const targetBookingId = guestProcessingBookingId || bookingId;
                                    
                                    if (guestProcessingBookingId) {
                                        // Handle single guest booking cancellation
                                        await deleteGuestBooking(targetBookingId);
                                    } else if (bookingId) {
                                        // Handle single regular booking cancellation
                                        await deleteBooking(targetBookingId, user?.token);
                                    }
                                    
                                    toast.info("Booking cancelled successfully.");
                                } catch (err) {
                                    console.error("Failed to cancel booking:", err);
                                    toast.error("Failed to cancel booking.");
                                }
                            }
                            
                            setShowPayment(false);
                            setBookingId(null);
                            setGuestProcessingBookingId(null);
                            setProcessingBookingId(null);
                            setFirstTripBooking(null);
                            setSecondTripBooking(null);
                            setSelectedSeats([]);
                            setRefreshTrigger(prev => prev + 1); // Refresh to show updated seat availability
                        }}
                    />
                )}
                {showQRCode && qrBookingDetails && (
                    <BookingQRCode bookingDetails={qrBookingDetails} onCancel={() => setShowQRCode(false)} />
                )}
                
                {/* Return Trip Choice Modal */}
                {showReturnChoiceModal && firstTripBooking && (
                    <ReturnTripChoiceModal
                        onClose={() => setShowReturnChoiceModal(false)}
                        onContinueOneWay={handleContinueOneWay}
                        onBookReturn={handleBookReturn}
                        trip={firstTripBooking.trip}
                        selectedSeats={firstTripBooking.selectedSeats}
                        isFirstTripReturn={firstTripBooking.isReturn}
                        selectedView={selectedView}
                    />
                )}

                {/* Combined Booking Confirmation Modal */}
                {showCombinedConfirmModal && firstTripBookingData && secondTripBooking && (
                    <CombinedBookingConfirmModal
                        onClose={handleCombinedBookingCancel}
                        onConfirm={handleCombinedBookingConfirm}
                        onAgentBookForPassenger={async () => {
                            // Handle agent booking for passenger in combined booking
                            console.log("AGENT COMBINED BOOKING FOR PASSENGER");
                            console.log("Showing guest form for combined booking while keeping both bookings");
                            
                            // Show guest form for agent to enter passenger details for both bookings
                            setShowCombinedConfirmModal(false);
                            setShowGuestForm(true);
                        }}
                        firstTrip={firstTripBookingData}
                        secondTrip={secondTripBooking}
                        isLoading={isLoading}
                    />
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default SeatPlanning;