import React, { useState } from "react";
import axios from "axios";

const BusTripForm = () => {
  const [formValues, setFormValues] = useState({
    bus_no: "",
    total_seats: "",
    booked_seats: "",
    start_point: "",
    end_point: "",
    departure_date: "",
    departure_time: "",
    duration: "",
    booking_closing_time: "",
    price: "",
    conductor_name: "",
    conductor_contact: ""
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const available_seats = parseInt(formValues.total_seats) - parseInt(formValues.booked_seats);
    const formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("available_seats", available_seats);

    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:8000/api/bus-trips", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("Bus trip created successfully!");
      setFormValues({
        bus_no: "",
        total_seats: "",
        booked_seats: "",
        start_point: "",
        end_point: "",
        departure_date: "",
        departure_time: "",
        duration: "",
        booking_closing_time: "",
        price: "",
        conductor_name: "",
        conductor_contact: ""
      });
      setImage(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create bus trip.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 max-w-lg mx-auto">
      <input type="text" name="bus_no" placeholder="Bus No" onChange={handleChange} value={formValues.bus_no} required />
      <input type="number" name="total_seats" placeholder="Total Seats" onChange={handleChange} value={formValues.total_seats} required />
      <input type="number" name="booked_seats" placeholder="Booked Seats" onChange={handleChange} value={formValues.booked_seats} required />
      <input type="text" name="start_point" placeholder="From" onChange={handleChange} value={formValues.start_point} required />
      <input type="text" name="end_point" placeholder="To" onChange={handleChange} value={formValues.end_point} required />
      <input type="date" name="departure_date" onChange={handleChange} value={formValues.departure_date} required />
      <input type="time" name="departure_time" onChange={handleChange} value={formValues.departure_time} required />
      <input type="text" name="duration" placeholder="Duration (e.g. 5 hours)" onChange={handleChange} value={formValues.duration} required />
      <input type="time" name="booking_closing_time" placeholder="Booking Closing Time" onChange={handleChange} value={formValues.booking_closing_time} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} value={formValues.price} required />
      <input type="text" name="conductor_name" placeholder="Conductor Name" onChange={handleChange} value={formValues.conductor_name} required />
      <input type="text" name="conductor_contact" placeholder="Conductor Contact" onChange={handleChange} value={formValues.conductor_contact} required />
      
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button type="submit">Submit</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default BusTripForm;
