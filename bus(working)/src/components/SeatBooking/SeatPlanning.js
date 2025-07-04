import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSteering2Fill } from "react-icons/ri";
import ConfirmBooking from "./ConfirmBooking";
import { createBooking, updateBookingStatus, deleteBooking } from "../../services/bookingService";
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

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const SeatPlanning = ({ pickup, drop }) => {
    const location = useLocation();
    const trip = location.state?.trip;
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { buses } = useBusHook();
    const busNo = trip?.bus_no;
    const date = trip?.departure_date;
    const busInfo = buses.find(bus => String(bus.bus_no) === String(busNo));
    const bus_id = busInfo ? busInfo.id : null;
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
        for (let i = 1; i <= totalSeats; i++) seatStatusMap[`S${i}`] = "available";
        (filteredFrozenSeats || []).forEach(frozen => {
            let seatArr = [];
            if (Array.isArray(frozen.seat_no)) {
                seatArr = frozen.seat_no;
            } else if (typeof frozen.seat_no === "string") {
                seatArr = frozen.seat_no.split(",").map(s => s.trim()).filter(Boolean);
            }
            seatArr.forEach(seat => {
                seatStatusMap[seat] = "freezed";
            });
        });
        (allBookings || []).forEach(booking => {
            let seats = [];
            if (Array.isArray(booking.seat_no)) {
                seats = booking.seat_no;
            } else if (typeof booking.seat_no === "string") {
                seats = booking.seat_no.split(",").map(s => s.trim()).filter(Boolean);
            }
            seats.forEach(seat => {
                if (String(booking.status).toLowerCase() === "confirmed") {
                    seatStatusMap[seat] = "reserved";
                } else if (String(booking.status).toLowerCase() === "processing") {
                    seatStatusMap[seat] = "processing";
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
        for (let i = 1; i <= totalSeats; i++) seatStatusMap[`S${i}`] = "available";
        (filteredFrozenSeats || []).forEach(frozen => {
            let seatArr = [];
            if (Array.isArray(frozen.seat_no)) {
                seatArr = frozen.seat_no;
            } else if (typeof frozen.seat_no === "string") {
                seatArr = frozen.seat_no.split(",").map(s => s.trim()).filter(Boolean);
            }
            seatArr.forEach(seat => {
                seatStatusMap[seat] = "freezed";
            });
        });
        (allBookings || []).forEach(booking => {
            let seats = [];
            if (Array.isArray(booking.seat_no)) {
                seats = booking.seat_no;
            } else if (typeof booking.seat_no === "string") {
                seats = booking.seat_no.split(",").map(s => s.trim()).filter(Boolean);
            }
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
            
            // If we have a guest processing booking, update it instead of creating new one
            if (guestProcessingBookingId) {
                console.log("=== UPDATING EXISTING BOOKING ===");
                
                // First, fetch the existing temporary booking to preserve its serial_no
                console.log("Fetching existing booking...");
                const existingBookingResponse = await axios.get(`${API_URL}/guest-bookings?bus_id=${trip.bus_id}&departure_date=${trip.departure_date}`);
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
                    departure_date: trip.departure_date,
                    reason: null,
                    price: totalPrice,
                };
                
                console.log("=== ABOUT TO UPDATE BOOKING ===");
                console.log("UPDATE URL:", `${API_URL}/guest-bookings/${guestProcessingBookingId}`);
                console.log("UPDATE DATA:", bookingData);
                
                const response = await axios.put(`${API_URL}/guest-bookings/${guestProcessingBookingId}`, bookingData);
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
                        const verifyResponse = await axios.get(`${API_URL}/guest-bookings?bus_id=${trip.bus_id}&departure_date=${trip.departure_date}`);
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
                
                const bookingData = {
                    ...guestForm, // This now contains status, payment_status and agent_id from the form
                    bus_id: trip.bus_id,
                    bus_no: trip.bus_no,
                    serial_no: serialNo,
                    reserved_tickets: selectedSeats.length,
                    seat_no: selectedSeats.join(","),
                    pickup,
                    drop,
                    departure_date: trip.departure_date,
                    reason: null,
                    price: totalPrice,
                    // If agent booking, set confirmed status and not applicable payment
                    ...(guestForm.agent_id && {
                        status: "Confirmed",
                        payment_status: "Not Applicable"
                    })
                };
                
                const response = await axios.post(`${API_URL}/guest-bookings`, bookingData);
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
                    date: trip.departure_date,
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
                    date: trip.departure_date,
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
                departure_date: trip.departure_date,
                reason: null,
                price: totalPrice,
                status: "Processing",
                payment_status: "Pending"
            };

            const response = await axios.post(`${API_URL}/guest-bookings`, tempBookingData);
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

    // New function to create initial booking with Processing status
    const createInitialBooking = async () => {
        if (isLoading) return; // Prevent multiple submissions
        
        if (!user) {
            // For guest users, create temporary booking to protect seats
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
            const now = new Date();
            const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
            const rand = Math.floor(100 + Math.random() * 900);
            const serialNo = `BK-${yymmdd}-${rand}`;
            const totalPrice = seatPrice * selectedSeats.length;

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
                departure_date: trip.departure_date,
                reason: null,
                price: totalPrice,
                status: "Processing",
                payment_status: "Pending"
            };

            const response = await createBooking(bookingData, user.token);
            setProcessingBookingId(response?.data?.id);
            setBookingId(response?.data?.id);
            setShowModal(true);
        } catch (err) {
            toast.error("Failed to create booking: " + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBooking = async () => {
        // This function now only handles the confirmation logic after initial booking is created
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
            if (user.role === "agent" || user.role === "admin") {
                // For agents and admins, directly confirm the booking
                await updateBookingStatus({
                    id: processingBookingId,
                    payment_status: "Not Applicable",
                    status: "Confirmed",
                }, user.token);
                
                setSelectedSeats([]);
                setShowModal(false);
                toast.success("Booking confirmed successfully!");
                
                const busInfo = buses.find(bus => String(bus.bus_no) === String(trip.bus_no));
                setQrBookingDetails({
                    busName: busInfo?.bus_name || trip.bus_no,
                    seatNumbers: selectedSeats,
                    pickup,
                    drop,
                    price: Number(trip.price) * selectedSeats.length,
                    serialNo: processingBookingId,
                    date: trip.departure_date,
                });
                setShowQRCode(true);
            } else {
                // For regular users, proceed to payment
                setShowModal(false);
                setShowPayment(true);
            }
        } catch (err) {
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
                await axios.delete(`${API_URL}/guest-bookings/${guestProcessingBookingId}`);
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
                setQrBookingDetails({
                    busName: busInfo?.bus_name || trip.bus_no,
                    seatNumbers: selectedSeats,
                    pickup,
                    drop,
                    price: Number(trip.price) * selectedSeats.length,
                    serialNo: bookingId,
                    date: trip.departure_date,
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
    const handlePaymentPayLater = () => handlePayment("Pending");

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
                                        if (!pickup || !drop) {
                                            toast.error("Please select pickup and drop locations.", {
                                                position: "top-center",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "colored",
                                            });
                                            return;
                                        }
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
                        onClose={cancelProcessingBooking} // Changed to cancel function
                        trip={trip}
                        isLoading={isLoading}
                        onConfirm={async () => {
                            if (!user && !guestDetails) {
                                setShowModal(false);
                                setShowGuestForm(true);
                            } else {
                                await handleBooking();
                            }
                        }}
                        onAgentBookForPassenger={async () => {
                            if (isLoading) return; // Prevent multiple submissions
                            
                            // Delete the processing booking from bookings table first
                            if (processingBookingId) {
                                setIsLoading(true);
                                try {
                                    await deleteBooking(processingBookingId, user?.token);
                                    setProcessingBookingId(null);
                                    setBookingId(null);
                                } catch (err) {
                                    console.error("Failed to delete processing booking:", err);
                                    toast.error("Failed to cancel current booking.");
                                    return;
                                } finally {
                                    setIsLoading(false);
                                }
                            }
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
                                await handleGuestBooking(guestForm);
                                // Close the form without cancelling the booking
                                closeGuestForm();
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
                            agentId={user?.role === 'agent' ? user.id : null}
                            isAgentBooking={user?.role === 'agent'}
                            processingBookingId={guestProcessingBookingId} // Pass processing booking ID for reference
                            onRefresh={() => setRefreshTrigger(prev => prev + 1)} // Pass refresh callback
                        />
                    </div>
                )}
                {showPayment && (
                    <PaymentAPI
                        amount={Number(trip.price) * selectedSeats.length}
                        onSuccess={handlePaymentSuccess}
                        onPayLater={handlePaymentPayLater}
                        bookingId={bookingId}
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