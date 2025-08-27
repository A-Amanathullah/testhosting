import React, { createContext, useContext, useState } from 'react';

const ConductorSidebarContext = createContext();

export const ConductorSidebarProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ConductorSidebarContext.Provider value={{
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      closeSidebar
    }}>
      {children}
    </ConductorSidebarContext.Provider>
  );
};

export const useConductorSidebar = () => {
  const context = useContext(ConductorSidebarContext);
  if (!context) {
    throw new Error('useConductorSidebar must be used within a ConductorSidebarProvider');
  }
  return context;
};
