import React from "react";
import{motion,AnimatePresence} from "framer-motion";
import { Link } from "react-router-dom";

function ResponsiveMenu({ open, onMenuClick, user, navAdmin, handleLogout }) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-full h-screen z-20 bg-white md:hidden"
        >
          <div className="text-xl font-semibold uppercase bg-primary text-white py-10 m-6 rounded-xl">
            <ul className="flex flex-col justify-center items-center gap-10">
              <li onClick={onMenuClick} className="cursor-pointer">
                <Link to="/about-us" className="text-white">About Us</Link>
              </li>
              <li onClick={onMenuClick} className="cursor-pointer">
                <Link to="/gallery" className="text-white">Gallery</Link>
              </li>
              <li onClick={onMenuClick} className="cursor-pointer">
                <Link to="/career" className="text-white">Career</Link>
              </li>
              <li onClick={onMenuClick} className="cursor-pointer">
                <Link to="/contact" className="text-white">Contact</Link>
              </li>
              {/* Auth buttons for mobile */}
              {!user && (
                <>
                  <li onClick={onMenuClick} className="cursor-pointer">
                    <a href="/login" className="block w-full text-center py-2 px-4 bg-white text-primary rounded-md border-2 border-primary font-semibold">Login</a>
                  </li>
                  <li onClick={onMenuClick} className="cursor-pointer">
                    <a href="/signup" className="block w-full text-center py-2 px-4 bg-white text-primary rounded-md border-2 border-primary font-semibold">Sign Up</a>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li className="cursor-default text-center">
                    <div className="bg-white text-primary rounded-xl p-4 border-2 border-white">
                      <div className="text-lg font-bold mb-1">{user.name}</div>
                      <div className="text-sm opacity-80">{user.email}</div>
                      <div className="text-xs opacity-60 capitalize">{user.role}</div>
                    </div>
                  </li>
                  <li onClick={() => { onMenuClick(); handleLogout(); }} className="cursor-pointer">
                    <span className="block w-full text-center py-2 px-4 bg-white text-primary rounded-md border-2 border-primary font-semibold">Logout</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResponsiveMenu;