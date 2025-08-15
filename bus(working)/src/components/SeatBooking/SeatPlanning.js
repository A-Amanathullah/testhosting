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
import axios from "axios";
import { formatDateForMySQL, formatDateForDisplay } from "../../utils/dateUtils";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const SeatPlanning = ( ) => {
    const location = useLocation();
    const trip = location.state?.trip;
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
            
            // All user types see the ConfirmBooking modal
            setShowModal(true);
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
                await updateBookingStatus({
                    id: bookingId,
                    payment_status: "Paid",
                    status: "Confirmed",
                }, user.token);
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
                    serialNo: bookingId,
                    date: displayDate,
                });
                setShowQRCode(true);
                // navigate("/passengerdash"); // Optionally navigate after download
            } catch (err) {
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
                                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
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
                                    // First, create/update the guest booking
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
                                } catch (err) {
                                    console.error("Failed to complete guest booking:", err);
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
                            totalAmount={Number(trip.price) * selectedSeats.length}
                            agentId={user?.role?.toLowerCase() === 'agent' ? user.id : null}
                            isAgentBooking={user?.role?.toLowerCase() === 'agent'}
                            processingBookingId={guestProcessingBookingId} // Pass processing booking ID for reference
                            onRefresh={() => setRefreshTrigger(prev => prev + 1)} // Pass refresh callback
                        />
                    </div>
                )}
                {showPayment && (
                    <PaymentAPI
                        amount={Number(trip.price) * selectedSeats.length}
                        onSuccess={handlePaymentSuccess}
                        onCancel={async () => {
                            // Cancel logic: delete the booking and close payment modal
                            if (bookingId) {
                                try {
                                    await deleteBooking(bookingId, user?.token);
                                    toast.info("Booking cancelled successfully.");
                                } catch (err) {
                                    toast.error("Failed to cancel booking.");
                                }
                            }
                            setShowPayment(false);
                            setBookingId(null);
                            setSelectedSeats([]);
                        }}
                    />
                )}
                {showQRCode && qrBookingDetails && (
                    <BookingQRCode bookingDetails={qrBookingDetails} onCancel={() => setShowQRCode(false)} />
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default SeatPlanning;