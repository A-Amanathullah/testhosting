import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../../context/PrivateRoute";
import Home from "./Home";
import AllTrips from "./AllTrips";
import TodayTrips from "./TodayTrips";
import TripDetails from "./TripDetails";

const ConductorRoutes = () => {
  return (
    <PrivateRoute>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<AllTrips />} />
        <Route path="/today-trips" element={<TodayTrips />} />
        <Route path="/trip/:tripId" element={<TripDetails />} />
        <Route path="/routes" element={<Home />} /> {/* Placeholder for now */}
      </Routes>
    </PrivateRoute>
  );
};

export default ConductorRoutes;
