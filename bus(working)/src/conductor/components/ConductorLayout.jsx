import React from "react";
import ConductorSidebar from "./ConductorSidebar";

const ConductorLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex pt-16 lg:pt-0">
      {/* Sidebar */}
      <ConductorSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 w-full min-h-[calc(100vh-4rem)] lg:min-h-screen overflow-y-auto pb-24 lg:pb-0" style={{ backgroundColor: '#f9fafb' }}>
        <div className="h-full w-full py-6 px-6 lg:py-8 lg:px-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ConductorLayout;
