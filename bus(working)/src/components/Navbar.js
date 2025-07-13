import React from "react";
import ResponsiveMenu from "./Other/ResponsiveMenu";
import UserProfileDropdown from "./UserProfileDropdown";
import logo from "../assets/Side.png"
import { FaHome, FaUser } from "react-icons/fa";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { IoIosPersonAdd } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { Link, useLocation } from 'react-router-dom';
import { useState } from "react";
import { useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionsContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [open, setOpen] = useState(false)
    const [navAdmin, setNavAdmin] = useState(false)
    const { user, setUser } = useContext(AuthContext);
    const { permissions } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if current path is admin panel
    const isOnAdminPanel = location.pathname.startsWith('/admin');

    // Helper function to check if user has any admin permissions
    const hasAnyAdminPermissions = useCallback(() => {
        if (!permissions || !user) return false;
        
        // Simple check: if the permissions object has any keys at all, user has permissions
        return Object.keys(permissions).length > 0;
    }, [permissions, user]);

    useEffect(() => {
        setNavAdmin(hasAnyAdminPermissions());
    }, [user, permissions, hasAnyAdminPermissions]);

    const handleLogout = () => {
        navigate("/");
        localStorage.removeItem("token");
        setUser(null);
    };

    // Close mobile menu on navigation
    const handleMenuClick = () => setOpen(false);

    return (
        <div className="w-full bg-white sticky top-0 z-50">
            <nav className="shadow-md">
                <div className="container flex justify-between items-center bg-white px-2 md:px-0 ">
                    {/* logo section */}
                    <div className=" flex items-center gap-2 relative ">
                        <img src={logo} alt="RS Express" className="w-36 h-16 ml-4 md:w-48 md:h-15 object-contain" />
                    </div>
                    {/* menu items - hide when on admin panel */}
                    {!isOnAdminPanel &&
                        <div className="hidden md:block cursor-pointer">
                            <ul className="flex items-center gap-6">
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">
                                    <Link to="/about-us">About us</Link>
                                </li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">
                                    <Link to="/gallery">Gallery</Link>
                                </li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">
                                    <Link to="/career">Career</Link>
                                </li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">
                                    <Link to="/contact">Contact</Link>
                                </li>
                            </ul>
                        </div>}

                    {/* icon section */}
                    <div className="flex items-center mr-5 gap-4">
                        <button className="text-xl hover:bg-primary hover:text-white rounded-full p-2 duration-200 mx-2 "
                            onClick={() => { handleMenuClick(); navigate("/"); }}>
                            <FaHome className="" />
                        </button>
                        {user && hasAnyAdminPermissions() ? (
                            <div className="flex items-center">
                                <Link to="/admin" onClick={handleMenuClick}>
                                    <button className="text-xl hover:bg-primary hover:text-white rounded-full p-2 duration-200 mr-1" title="Admin Dashboard">
                                        <BsFillGrid1X2Fill className="p-0.5" />
                                    </button>
                                </Link>
                                <Link to="/passengerdash" onClick={handleMenuClick}>
                                    <button className="text-xl hover:bg-primary hover:text-white rounded-full p-2 duration-200" title="Passenger Dashboard">
                                        <FaUser className="p-0.5" />
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <Link to="/passengerdash" onClick={handleMenuClick}>
                                <button className="text-xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
                                    <BsFillGrid1X2Fill className="p-0.5" />
                                </button>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-5">
                                <UserProfileDropdown user={user} onLogout={handleLogout} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-5">
                                <Link to="/login" onClick={handleMenuClick}>
                                    <button className="hover:bg-primary text-primary font-semibold hover:text-white rounded-md border-2 border-primary px-3 py-1 duration-200 hidden md:block text-base">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/signup" onClick={handleMenuClick}>
                                    <button className="hover:bg-primary text-primary font-semibold hover:text-white rounded-md border-2 border-primary px-2 py-1 duration-200 hidden md:block text-xl">
                                        <IoIosPersonAdd />
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* mobile hamburger btn section */}
                    <div className="md:hidden" onClick={() => setOpen(!open)}>
                        <TiThMenu className="text-3xl" />
                    </div>
                </div>
            </nav>
            {/* mobile side section */}
            <ResponsiveMenu open={open} onMenuClick={handleMenuClick} user={user} navAdmin={navAdmin} handleLogout={handleLogout} />
            {/* Backdrop for mobile menu */}
            {open && <div className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden" onClick={handleMenuClick}></div>}
        </div>
    );
}

export default Navbar;