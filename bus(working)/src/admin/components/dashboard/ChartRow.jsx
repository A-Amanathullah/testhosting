import React from "react";
import MonthwiseBookingChart from "./charts/MonthwiseBookingChart";
import YearwiseBookingChart from "./charts/YearwiseBookingChart";
import CurrentMonthBookingChart from "./charts/CurrentMonthBookingChart";

const ChartRow = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <MonthwiseBookingChart />
      <YearwiseBookingChart />
      <CurrentMonthBookingChart />
    </div>
  );
};

export default ChartRow;