import React from "react";
import ResponsiveMenu from "./Other/ResponsiveMenu";
import logo from "../assets/Side.png"
import { FaHome } from "react-icons/fa";
// import { LiaLanguageSolid } from "react-icons/lia";
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


    return (
        <div className="w-full bg-white sticky top-0 z-50">
            <nav className="shadow-md">
                <div className="container flex justify-between items-center bg-white ">
                    {/* logo section */}
                    <div className="flex items-center gap-2 relative ">
                        <img src={logo} alt="RS Express" className="max-w-48 h-15" />
                    </div>
                    {/* menu items*/}
                    {!navAdmin &&
                        <div className="hidden md:block cursor-pointer">
                            <ul className="flex items-center gap-6">
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">About us</li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">Galley</li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">Career</li>
                                <li className="inline-block py-1 px-3 hover:text-primary font-semibold">Contact</li>
                                {/* <li className="inline-block py-1 px-3 hover:text-primary font-semibold">Help</li> */}
                            </ul>
                        </div>}

                    {/* icon section */}
                    <div className="flex items-center gap-4">
                        <button className="text-xl hover:bg-primary hover:text-white
                    rounded-full p-2 duration-200 mx-2 "
                            onClick={() => navigate("/")}>
                            <FaHome className="" />
                        </button>
                        {user && user.role === "admin" ? (
                            <Link to="/admin">
                                <button className="text-xl hover:bg-primary hover:text-white
                                rounded-full p-2 duration-200">
                                    <BsFillGrid1X2Fill className="p-0.5" />
                                </button>
                            </Link>
                        ) : (
                            <Link to="/passengerdash">
                                <button className="text-xl hover:bg-primary hover:text-white
                    rounded-full p-2 duration-200">
                                    <BsFillGrid1X2Fill className="p-0.5" />
                                </button>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-5">
                                
                                    <div className="hover:bg-transparent text-lg font-bold
                                        text-primary px-6 py-2 duration-200 hidden md:block">
                                        {(user.name).toUpperCase()}
                                    </div>


                                <button className="hover:bg-primary text-primary font-semibold
                                hover:text-white rounded-md border-2 broder-primary
                                px-6 py-2 duration-200 hidden md:block "
                                    onClick={handleLogout}>
                                    <FiLogOut className="text-xl" />
                                </button>

                            </div>

                        ) : (
                            <div className="flex items-center gap-5">
                                <Link to="/login">
                                    <button className="hover:bg-primary text-primary font-semibold
                                     hover:text-white rounded-md border-2 broder-primary
                                    px-6 py-2 duration-200 hidden md:block">
                                        Login
                                    </button>
                                </Link>

                                <Link to="/signup">
                                    <button className="hover:bg-primary text-primary font-semibold
                                        hover:text-white rounded-md border-2 broder-primary
                                        px-3 py-2 duration-200 hidden md:block text-2xl">
                                        <IoIosPersonAdd />
                                    </button>
                                </Link>
                            </div>
                        )}

                    </div>

                    {/* mobile hamburger btn section */}

                    <div className="md:hidden" onClick={() =>
                        setOpen(!open)}>
                        <TiThMenu className="text-3xl" />
                    </div>

                </div>
            </nav>

            {/* mobile side section */}
            <ResponsiveMenu open={open} />

        </div>
    );
}

export default Navbar;