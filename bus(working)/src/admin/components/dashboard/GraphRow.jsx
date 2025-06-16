import React from "react";
import MonthwiseRevenueGraph from "./graphs/MonthwiseRevenueGraph";
import DaywiseRevenueGraph from "./graphs/DaywiseRevenueGraph";
import YearwiseRevenueGraph from "./graphs/YearwiseRevenueGraph";

const GraphRow = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <MonthwiseRevenueGraph />
      <DaywiseRevenueGraph />
      <YearwiseRevenueGraph />
    </div>
  );
};

export default GraphRow;