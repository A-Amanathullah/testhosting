import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Bus, AlertTriangle } from 'lucide-react';
import ConductorLayout from '../components/ConductorLayout';

const ConductorNotFound = () => {
  return (
    <ConductorLayout>
      <div className="flex items-center justify-center min-h-full">
        <div className="max-w-md w-full text-center">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 animate-pulse">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-20 animate-ping"></div>
            </div>
          </div>

          {/* Warning Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg mb-6">
            <AlertTriangle className="w-8 h-8 text-white animate-bounce" />
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Route Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The conductor page you're looking for doesn't exist or may have been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mb-8">
            <Link 
              to="/conductor"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 group"
            >
              <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Back to Conductor Dashboard
            </Link>
            
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-gray-200 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Main Website
            </Link>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conductor Quick Links
            </h3>
            <div className="space-y-2">
              <Link 
                to="/conductor/today-trips" 
                className="flex items-center p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
              >
                <Bus className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Today's Trips
              </Link>
              <Link 
                to="/conductor/trips" 
                className="flex items-center p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
              >
                <Bus className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                All Trips
              </Link>
              <Link 
                to="/conductor/routes" 
                className="flex items-center p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Routes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ConductorLayout>
  );
};

export default ConductorNotFound;
