import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaUser, FaEnvelope, FaIdBadge } from "react-icons/fa";

function ResponsiveMenu({ open, onMenuClick, user, navAdmin, handleLogout }) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 left-0 w-full h-screen z-20 bg-white/95 backdrop-blur-sm md:hidden overflow-y-auto"
        >
          <div className="relative min-h-screen flex flex-col">
            {/* Header with close button */}
            <div className="bg-primary text-white p-6 flex justify-between items-center shadow-lg">
              <h2 className="text-xl font-bold">Menu</h2>
              <button 
                onClick={onMenuClick}
                className="p-2 rounded-full hover:bg-white/20 transition-all"
                aria-label="Close menu"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            
            {/* Navigation links */}
            <div className="p-6">
              <nav className="mb-8">
                <ul className="space-y-4">
                  <li onClick={onMenuClick} className="transform transition hover:translate-x-2">
                    <Link to="/about-us" className="block text-lg font-medium text-gray-800 hover:text-primary px-2 py-2 border-b border-gray-100">
                      About Us
                    </Link>
                  </li>
                  <li onClick={onMenuClick} className="transform transition hover:translate-x-2">
                    <Link to="/gallery" className="block text-lg font-medium text-gray-800 hover:text-primary px-2 py-2 border-b border-gray-100">
                      Gallery
                    </Link>
                  </li>
                  <li onClick={onMenuClick} className="transform transition hover:translate-x-2">
                    <Link to="/career" className="block text-lg font-medium text-gray-800 hover:text-primary px-2 py-2 border-b border-gray-100">
                      Career
                    </Link>
                  </li>
                  <li onClick={onMenuClick} className="transform transition hover:translate-x-2">
                    <Link to="/contact" className="block text-lg font-medium text-gray-800 hover:text-primary px-2 py-2 border-b border-gray-100">
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
              
              {/* Auth section */}
              <div className="mt-auto">
                {!user ? (
                  <div className="flex flex-col gap-3 mt-6">
                    <Link 
                      to="/login" 
                      onClick={onMenuClick}
                      className="w-full py-3 px-4 bg-primary text-white text-center font-medium rounded-md shadow-md hover:bg-primary/90 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={onMenuClick}
                      className="w-full py-3 px-4 bg-white text-primary border border-primary text-center font-medium rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg overflow-hidden">
                    <div className="bg-primary text-white p-4">
                      <div className="text-lg font-semibold mb-1">User Profile</div>
                    </div>
                    <div className="bg-white shadow-md rounded-b-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 py-2">
                        <FaUser className="text-primary" />
                        <div className="font-medium">{user.name}</div>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-t border-gray-100">
                        <FaEnvelope className="text-primary" />
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-t border-gray-100">
                        <FaIdBadge className="text-primary" />
                        <div className="text-sm capitalize text-gray-600">{user.role}</div>
                      </div>
                      <button 
                        onClick={() => { onMenuClick(); handleLogout(); }}
                        className="w-full mt-4 py-2 px-4 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResponsiveMenu;