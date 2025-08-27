import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bus, Calendar, Route, User, QrCode } from "lucide-react";
import QRScannerSimple from './QRScannerSimple';

const ConductorSidebar = () => {
  const location = useLocation();
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const navItems = [
    {
      path: "/conductor",
      label: "Home",
      icon: <User className="w-5 h-5" />
    },
    {
      path: "/conductor/trips",
      label: "All Trips",
      icon: <Bus className="w-5 h-5" />
    },
    // QR Scanner will be in the center - handled separately
    {
      path: "/conductor/today-trips",
      label: "Today's Trips",
      icon: <Calendar className="w-5 h-5" />
    },
    {
      path: "/conductor/routes",
      label: "Routes",
      icon: <Route className="w-5 h-5" />
    }
  ];

  const handleQRScannerClick = () => {
    setIsQRScannerOpen(true);
  };

  const handleQRScanResult = (result) => {
    console.log('QR Scan Result:', result);
    // Handle the QR scan result here
    // You can add logic to process ticket/boarding pass data
    alert(`Scanned: ${result}`);
  };

  const handleCloseQRScanner = () => {
    setIsQRScannerOpen(false);
  };

  return (
    <>
      {/* Modern Mobile & Tablet Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-2xl z-40">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
        
        <div className="relative flex items-center justify-between h-20 px-4">
          {/* Left side navigation items */}
          <div className="flex flex-1 justify-around">
            {navItems.slice(0, 2).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ease-out group min-w-[60px] ${
                    isActive
                      ? "text-blue-600 scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:scale-105 active:scale-95"
                  }`}
                >
                  {/* Icon with enhanced styling */}
                  <div className={`relative mb-1 p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-50 text-blue-600" 
                      : "group-hover:bg-blue-50/50 group-hover:text-blue-600"
                  }`}>
                    <span className={`block transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110 group-active:scale-95"
                    }`}>
                      {React.cloneElement(item.icon, {
                        className: `w-5 h-5 ${isActive ? 'text-blue-600' : 'text-current'}`
                      })}
                    </span>
                  </div>
                  
                  {/* Label with improved typography */}
                  <span className={`text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? "text-blue-600" 
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Center QR Scanner Button */}
          <div className="flex justify-center px-4">
            <button
              onClick={handleQRScannerClick}
              className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 transition-all duration-300 group"
            >
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 animate-ping opacity-20"></div>
              
              {/* Icon */}
              <QrCode className="w-8 h-8 text-white drop-shadow-sm" />
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Right side navigation items */}
          <div className="flex flex-1 justify-around">
            {navItems.slice(2).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ease-out group min-w-[60px] ${
                    isActive
                      ? "text-blue-600 scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:scale-105 active:scale-95"
                  }`}
                >
                  {/* Icon with enhanced styling */}
                  <div className={`relative mb-1 p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-50 text-blue-600" 
                      : "group-hover:bg-blue-50/50 group-hover:text-blue-600"
                  }`}>
                    <span className={`block transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110 group-active:scale-95"
                    }`}>
                      {React.cloneElement(item.icon, {
                        className: `w-5 h-5 ${isActive ? 'text-blue-600' : 'text-current'}`
                      })}
                    </span>
                  </div>
                  
                  {/* Label with improved typography */}
                  <span className={`text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? "text-blue-600" 
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}>
                    {item.label === "Today's Trips" ? "Today" : item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Bottom safe area for modern phones */}
        <div className="h-2 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Enhanced Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-2xl border-r border-gray-100 z-30 lg:static lg:top-0 lg:h-screen lg:mt-0">
        <div className="flex flex-col h-full">
          {/* Modern Header with gradient */}
          <div className="relative p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
            <h2 className="relative text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Conductor Dashboard
            </h2>
            <p className="relative text-sm text-gray-600 mt-1 font-medium">
              Manage your trips and routes
            </p>
          </div>

          {/* Enhanced Navigation Items */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center space-x-4 px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 transform translate-x-1"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:translate-x-1 hover:shadow-md"
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                    )}
                    
                    {/* Enhanced icon */}
                    <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-white/20" 
                        : "group-hover:bg-blue-100 group-hover:scale-110"
                    }`}>
                      <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        {React.cloneElement(item.icon, {
                          className: `w-5 h-5 ${isActive ? 'text-white' : 'text-current'}`
                        })}
                      </span>
                    </div>
                    
                    <span className="relative">
                      {item.label}
                    </span>
                    
                    {/* Hover glow effect */}
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-100" 
                        : "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100"
                    }`}></div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Enhanced Footer */}
          <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Conductor Panel v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerSimple
        isOpen={isQRScannerOpen}
        onClose={handleCloseQRScanner}
        onScanResult={handleQRScanResult}
      />
    </>
  );
};

export default ConductorSidebar;
