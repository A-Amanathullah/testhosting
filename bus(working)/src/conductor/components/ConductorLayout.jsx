import React, { useState } from "react";
import ConductorSidebar from "./ConductorSidebar";

const ConductorLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex pt-16 lg:pt-0">
      {/* Sidebar */}
      <ConductorSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 w-full min-h-[calc(100vh-4rem)] lg:min-h-screen overflow-y-auto pb-24 lg:pb-0 transition-all duration-300 ${
        isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      }`} style={{ backgroundColor: '#f9fafb' }}>
        <div className="h-full w-full py-6 px-6 lg:py-8 lg:px-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ConductorLayout;
