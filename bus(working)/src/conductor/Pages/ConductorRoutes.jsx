import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../../context/PrivateRoute";
import Home from "./Home";
import AllTrips from "./AllTrips";

const ConductorRoutes = () => {
  return (
    <PrivateRoute>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<AllTrips />} />
        <Route path="/today-trips" element={<Home />} /> {/* Placeholder for now */}
        <Route path="/routes" element={<Home />} /> {/* Placeholder for now */}
      </Routes>
    </PrivateRoute>
  );
};

export default ConductorRoutes;
