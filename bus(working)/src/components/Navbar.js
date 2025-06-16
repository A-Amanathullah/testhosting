import React from "react";
import ResponsiveMenu from "./Other/ResponsiveMenu";
import logo from "../assets/Side.png"
import { FaHome } from "react-icons/fa";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { IoIosPersonAdd } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [open, setOpen] = useState(false)
    const [navAdmin, setNavAdmin] = useState(false)
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === "admin") {
            setNavAdmin(true);
        } else {
            setNavAdmin(false);
        }
    }, [user]);

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
                    <div className="flex items-center gap-2 relative ">
                        <img src={logo} alt="RS Express" className="w-32 h-10 md:w-48 md:h-15 object-contain" />
                    </div>
                    {/* menu items*/}
                    {!navAdmin &&
                        <div className="hidden md:block cursor-pointer">
                            <ul className="flex items-center gap-6">
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">About us</li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">Galley</li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">Career</li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">Contact</li>
                            </ul>
                        </div>}

                    {/* icon section */}
                    <div className="flex items-center gap-4">
                        <button className="text-xl hover:bg-primary hover:text-white rounded-full p-2 duration-200 mx-2 "
                            onClick={() => { handleMenuClick(); navigate("/"); }}>
                            <FaHome className="" />
                        </button>
                        {user && user.role === "admin" ? (
                            <Link to="/admin" onClick={handleMenuClick}>
                                <button className="text-xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
                                    <BsFillGrid1X2Fill className="p-0.5" />
                                </button>
                            </Link>
                        ) : (
                            <Link to="/passengerdash" onClick={handleMenuClick}>
                                <button className="text-xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
                                    <BsFillGrid1X2Fill className="p-0.5" />
                                </button>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-5">
                                <div className="hover:bg-transparent text-lg font-bold text-primary px-6 py-2 duration-200 hidden md:block">
                                    {(user.name).toUpperCase()}
                                </div>
                                <button className="hover:bg-primary text-primary font-semibold hover:text-white rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block "
                                    onClick={() => { handleMenuClick(); handleLogout(); }}>
                                    <FiLogOut className="text-xl" />
                                </button>
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