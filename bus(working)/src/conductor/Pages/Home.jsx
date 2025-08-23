import React from "react";
import { Link } from "react-router-dom";
import { Bus, Calendar, Route } from "lucide-react";
import ConductorNavbar from "../components/ConductorNavbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <ConductorNavbar />

      {/* Main Content */}
      <div className="py-8" style={{ backgroundColor: '#f9fafb', minHeight: '500px' }}>
        {/* Quick Actions Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Today's Trips Quick Link */}
            <Link to="/conductor/today-trips">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200" style={{ minHeight: '120px' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Trips</h3>
                    <p className="text-gray-600">View and manage your trips for today</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </Link>

            {/* All Trips Quick Link */}
            <Link to="/conductor/trips">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200" style={{ minHeight: '120px' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Trips</h3>
                    <p className="text-gray-600">View your complete trip history</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Bus className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Routes Quick Link */}
            <Link to="/conductor/routes">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200" style={{ minHeight: '120px' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Routes</h3>
                    <p className="text-gray-600">Manage your assigned routes</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Route className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Welcome Message */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Conductor!</h1>
              <p className="text-gray-600">
                Use the navigation above to access your trips, routes, and other conductor functions. 
                Quick access cards are available above for your most common tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
