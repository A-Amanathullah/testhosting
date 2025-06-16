import React from "react";
import{motion,AnimatePresence} from "framer-motion";

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
              <li onClick={onMenuClick} className="cursor-pointer">About Us</li>
              <li onClick={onMenuClick} className="cursor-pointer">Galley</li>
              <li onClick={onMenuClick} className="cursor-pointer">Career</li>
              <li onClick={onMenuClick} className="cursor-pointer">Contact</li>
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
                <li onClick={() => { onMenuClick(); handleLogout(); }} className="cursor-pointer">
                  <span className="block w-full text-center py-2 px-4 bg-white text-primary rounded-md border-2 border-primary font-semibold">Logout</span>
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResponsiveMenu;