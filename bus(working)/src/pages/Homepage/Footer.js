import logo from "../../assets/Side.png";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <>
        <div>
            <div className="w-full bg-white p-4 rounded-t-3xl">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
                        {/* Useful Links Section */}
                        <div>
                            <h3 className="text-xl font-medium mb-4 border-b pb-2 border-gray-200">Useful Links</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <Link to="/about-us" className="hover:text-primary transition-colors duration-300 inline-block py-1">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gallery" className="hover:text-primary transition-colors duration-300 inline-block py-1">
                                        Gallery
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/career" className="hover:text-primary transition-colors duration-300 inline-block py-1">
                                        Career
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="hover:text-primary transition-colors duration-300 inline-block py-1">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Legal Section */}
                        <div>
                            <h3 className="text-xl font-medium mb-4 border-b pb-2 border-gray-200">Legal</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-300 inline-block py-1">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms-conditions" className="hover:text-primary transition-colors duration-300 inline-block py-1">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/ticket-policy" className="hover:text-primary transition-colors duration-300 inline-block py-1">
                                        Ticket Policies
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Address & Contact Section */}
                        <div>
                            <h3 className="text-xl font-medium mb-4 border-b pb-2 border-gray-200">Contact Us</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <FaMapMarkerAlt className="text-primary mt-1 mr-3" />
                                    <span>No-00, Main Street,<br/> Kalmunai, Sri Lanka</span>
                                </li>
                                <li className="flex items-center">
                                    <FaPhoneAlt className="text-primary mr-3" />
                                    <span>+94 77 123 4567</span>
                                </li>
                                <li className="flex items-center">
                                    <FaEnvelope className="text-primary mr-3" />
                                    <span>info@rsexpress.lk</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Logo & Social Media Section */}
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="mb-4">
                                <img src={logo} alt="RS Express" className="max-w-[160px] sm:max-w-[180px] h-auto" />
                            </div>
                            <p className="text-sm text-gray-500 mb-4 text-center sm:text-left">Your trusted partner for safe and comfortable journeys across Sri Lanka.</p>
                            <div className="flex gap-4 text-primary text-2xl">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                    <FaFacebook />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                    <FaLinkedin />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                    <FaSquareXTwitter />
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                    <FaYoutube />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Copyright Section */}
                    <div className="border-t border-gray-300 py-4 text-center text-gray-500 text-sm">
                        <p>Copyright &copy; 2025 RS Express. All rights reserved | Developed by <a href="https://imss.lk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Imss.lk</a></p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Footer;