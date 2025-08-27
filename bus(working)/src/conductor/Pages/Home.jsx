import React from "react";
import { Link } from "react-router-dom";
import { Bus, Calendar, Route } from "lucide-react";
import ConductorLayout from "../components/ConductorLayout";

const Home = () => {
  return (
    <ConductorLayout>
      {/* Quick Actions Section */}
      <div className="w-full max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Today's Trips Quick Link */}
          <Link to="/conductor/today-trips">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 transform hover:-translate-y-1" style={{ minHeight: '160px' }}>
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Today's Trips</h3>
                  <p className="text-gray-600 text-base leading-relaxed">View and manage your trips for today</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl ml-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* All Trips Quick Link */}
          <Link to="/conductor/trips">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 transform hover:-translate-y-1" style={{ minHeight: '160px' }}>
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">All Trips</h3>
                  <p className="text-gray-600 text-base leading-relaxed">View your complete trip history</p>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl ml-4">
                  <Bus className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* Routes Quick Link */}
          <Link to="/conductor/routes">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 transform hover:-translate-y-1" style={{ minHeight: '160px' }}>
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Routes</h3>
                  <p className="text-gray-600 text-base leading-relaxed">Manage your assigned routes</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl ml-4">
                  <Route className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Welcome Message */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, Conductor!</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Use the sidebar to navigate to your trips, routes, and other conductor functions. 
              Quick access cards are available above for your most common tasks.
            </p>
          </div>
        </div>
      </div>
    </ConductorLayout>
  );
};

export default Home;
