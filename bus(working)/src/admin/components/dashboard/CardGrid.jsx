import React from "react";
import TodayBookingCard from "./cards/TodayBookingCard";
import TodayCancellationCard from "./cards/TodayCancellationCard";
import AgentwiseBookingCard from "./cards/AgentwiseBookingCard";
import RegisterAgentCard from "./cards/RegisterAgentCard";
import WebAppUserCard from "./cards/WebAppUserCard";
import StaffCard from "./cards/StaffCard";

const CardGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <TodayBookingCard />
      <TodayCancellationCard />
      <AgentwiseBookingCard />
      <RegisterAgentCard />
      <WebAppUserCard />
      <StaffCard />
    </div>
  );
};

export default CardGrid;