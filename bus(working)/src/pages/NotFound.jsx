import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Bus, Search, RefreshCw } from 'lucide-react';

const NotFound = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>

        {/* Bus Icon Animation */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-6">
            <Bus className="w-10 h-10 text-white animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The page you're looking for seems to have taken a different route. 
            Don't worry, even our buses sometimes take unexpected detours!
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <p className="text-sm text-gray-500 mb-4">
              <strong>What happened?</strong> The URL may be mistyped, or the page may have been moved or deleted.
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Error Code: 404 - Route Not Found</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Back to Home
          </Link>
          
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-white/20 group"
          >
            <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Destinations
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/bus-search" 
              className="flex items-center p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
            >
              <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Search Buses
            </Link>
            <Link 
              to="/about-us" 
              className="flex items-center p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
            >
              <Bus className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Contact
            </Link>
            <Link 
              to="/login" 
              className="flex items-center p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
            >
              <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Login
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Need help? <Link to="/contact" className="text-blue-500 hover:text-blue-600 font-medium">Contact our support team</Link>
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '6s'}}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '6s'}}></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '3s', animationDuration: '8s'}}></div>
      </div>
    </div>
  );
};

export default NotFound;
