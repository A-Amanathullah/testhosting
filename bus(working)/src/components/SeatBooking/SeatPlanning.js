import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSteering2Fill } from "react-icons/ri";
import ConfirmBooking from "./ConfirmBooking";
import { createBooking, updateBookingStatus } from "../../services/bookingService";
import { AuthContext } from "../../context/AuthContext";
import useBusHook from "../../hooks/useBusHook";
import useBookings from "../../hooks/useBookings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentAPI from "../PaymentAPI";
import BookingQRCode from "./BookingQRCode";

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

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrBookingDetails, setQrBookingDetails] = useState(null);

    // // Debug: Log bookings, frozenSeats, bus_id, and date to verify correct data per bus
    // console.log('bus_id:', bus_id, 'date:', date, 'bookings:', bookings, 'frozenSeats:', frozenSeats);
    // // Debug: Log detailed seat numbers and booking IDs for each bus
    // console.log('bus_id:', bus_id, 'date:', date, 'bookings:', bookings.map(b => ({id: b.id, seat_no: b.seat_no, status: b.status})), 'frozenSeats:', frozenSeats.map(f => ({id: f.id, seat_no: f.seat_no, status: f.status})));

    // Filter bookings and frozenSeats to only include those for the current bus
    const filteredBookings = (bookings || []).filter(b => String(b.bus_id) === String(bus_id));
    const filteredFrozenSeats = (frozenSeats || []).filter(f => String(f.bus_id) === String(bus_id));

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
        (filteredBookings || []).forEach(booking => {
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
        (filteredBookings || []).forEach(booking => {
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

    const handleBooking = async () => {
        if (!user) {
            navigate("/login", {
                state: {
                    from: location.pathname
                }
            });
            return;
        }
        const busInfo = buses.find(bus => String(bus.bus_no) === String(trip.bus_no));
        if (!busInfo) {
            toast.error("Bus information not found.");
            return;
        }
        let seatPrice = Number(trip.price);
        if (isNaN(seatPrice) || seatPrice <= 0) {
            toast.error("Seat price is missing or invalid. Please check trip details.");
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
            };

            if (user.role === "agent" || user.role === "admin") {
                // For agents and admins, set payment_status to "Not Applicable" and status to "Confirmed"
                bookingData.payment_status = "Not Applicable";
                bookingData.status = "Confirmed";
                await createBooking(bookingData, user.token);
                setSelectedSeats([]);
                setShowModal(false);
                toast.success("Booking confirmed successfully!");
                setQrBookingDetails({
                    busName: busInfo?.bus_name || trip.bus_no,
                    seatNumbers: selectedSeats,
                    pickup,
                    drop,
                    price: totalPrice,
                    serialNo,
                    date: trip.departure_date,
                });
                setShowQRCode(true);
                // navigate("/passengerdash"); // Optionally navigate after download
            } else {
                // For non-agents, proceed with payment flow
                bookingData.payment_status = "Pending";
                bookingData.status = "Processing";
                const response = await createBooking(bookingData, user.token);
                setBookingId(response?.data?.id);
                setShowModal(false);
                setShowPayment(true);
            }
        } catch (err) {
            toast.error("Booking failed: " + (err.response?.data?.message || err.message));
        }
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
                                        setShowModal(true);
                                    }}
                                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-xl disabled:opacity-50 text-xs sm:text-base"
                                    disabled={selectedSeats.length === 0}
                                >
                                    Proceed to Book
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showModal && (
                    <ConfirmBooking
                        selectedSeats={selectedSeats}
                        onClose={() => setShowModal(false)}
                        trip={trip}
                        onConfirm={handleBooking}
                    />
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