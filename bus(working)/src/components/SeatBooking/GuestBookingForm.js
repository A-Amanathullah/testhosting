import React, { useState } from "react";
import axios from "axios";
import PaymentAPI from "../PaymentAPI";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const GuestBookingForm = ({ onSubmit, onLogin, onSignup, onClose, totalAmount = 0, agentId = null, isAgentBooking = false, processingBookingId = null, onRefresh = null }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    
    if (!form.name || !form.phone) {
      setError("Name and phone are required.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    try {
      // For agent bookings, skip payment and directly confirm
      if (isAgentBooking && agentId) {
        const guestData = {
          ...form,
          status: "Confirmed",
          payment_status: "Not Applicable",
          agent_id: agentId
        };
        
        // Always use onSubmit to let parent handle the API calls
        if (onSubmit) {
          console.log("Agent booking: Passing data to parent via onSubmit");
          await onSubmit(guestData);
          // Don't call onClose() here - let the parent handle closing after successful booking
        } else {
          // Only make direct API call if no onSubmit callback
          console.log("Agent booking: Creating new booking directly");
          await axios.post(`${API_URL}/guest-bookings`, guestData);
          // Only close if we're handling the booking directly (fallback case)
          onClose();
        }
        return;
      }
      
      // For regular guest bookings, prepare data for payment flow
      const guestData = {
        ...form,
        status: "Processing",
        payment_status: "Pending",
        agent_id: agentId // This will be null for non-agent bookings
      };

      // Store booking data for later use in payment flow
      setBookingData({ ...guestData, processingBookingId });

      // Show payment component for regular guest bookings
      setShowPayment(true);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async () => {
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);
    
    try {
      if (!bookingData) return;

      // Update booking data with paid status
      const updatedData = {
        ...bookingData,
        status: "Confirmed",
        payment_status: "Paid"
      };

      // If we have a processing booking ID, update it, otherwise submit new booking
      if (onSubmit) {
        console.log("Payment Success: Passing data to parent via onSubmit");
        await onSubmit(updatedData);
        // Don't call onClose() here - let the parent handle closing after successful booking
      } else {
        console.log("Payment Success: Creating new booking directly");
        await axios.post(`${API_URL}/guest-bookings`, updatedData);
        // Only close if we're handling the booking directly (fallback case)
        onClose();
      }

      // Close payment modal only (parent will handle form closing)
      setShowPayment(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pay later option
  const handlePayLater = async () => {
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);
    
    try {
      if (!bookingData) return;

      // Keep processing status but mark payment as pending
      const pendingData = {
        ...bookingData,
        status: "Processing",
        payment_status: "Pending"
      };

      // If we have a processing booking ID, update it, otherwise submit new booking
      if (onSubmit) {
        console.log("Pay Later: Passing data to parent via onSubmit");
        await onSubmit(pendingData);
        // Don't call onClose() here - let the parent handle closing after successful booking
      } else {
        console.log("Pay Later: Creating new booking directly");
        await axios.post(`${API_URL}/guest-bookings`, pendingData);
        // Only close if we're handling the booking directly (fallback case)
        onClose();
      }

      // Close payment modal only (parent will handle form closing)
      setShowPayment(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to process booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-4 bg-white rounded-xl shadow max-w-md mx-auto mt-6">
      {showPayment ? (
        <PaymentAPI 
          amount={totalAmount} 
          onSuccess={handlePaymentSuccess} 
          onPayLater={handlePayLater} 
        />
      ) : (
        <>
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-lg font-bold mb-2 text-center">
            {isAgentBooking ? "Agent Booking - Passenger Details" : "Guest Booking"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (isAgentBooking ? "Confirm Booking" : "Continue to Payment")}
            </button>
          </form>
          <div className="mt-4 flex flex-col gap-2 text-center">
            <button className="text-blue-600 underline" onClick={onLogin}>Already have an account? Log in</button>
            <button className="text-blue-600 underline" onClick={onSignup}>Create an account</button>
          </div>
        </>
      )}
    </div>
  );
};

export default GuestBookingForm;
