import React from "react";
import ChartRow from "../components/dashboard/ChartRow";
import CardGrid from "../components/dashboard/CardGrid";
import GraphRow from "../components/dashboard/GraphRow";

const DashboardPage = () => {
  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        {/* Top row of charts */}
        <ChartRow />
        
        {/* Middle grid of cards */}
        <div className="my-6">
          <CardGrid />
        </div>
        
        {/* Bottom row of graphs */}
        <GraphRow />
      </div>
    </div>
  );
};

export default DashboardPage;