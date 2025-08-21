import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bus, Calendar, Route, User } from "lucide-react";

const ConductorNavbar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/conductor/home",
      label: "Home",
      icon: <User className="w-5 h-5" />
    },
    {
      path: "/conductor/trips",
      label: "All Trips",
      icon: <Bus className="w-5 h-5" />
    },
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

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Conductor Dashboard</h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ConductorNavbar;
