import loyal from "../../assets/loyal.jpg";
import logo from "../../assets/Side.png";
import { motion } from 'framer-motion';

const Loyalty = () => {
    const color = '#8f8f8f'; // Example color, can be dynamic

    const hexToRgb = (hex) => {
    // Remove the # character if present
    hex = hex.replace('#', '');
    
    // Convert HEX to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  };
    const generateStyles = (hexColor) => {
        const rgb = hexToRgb(hexColor);
        // Create a lighter variant for gradients
        const lightRgb = {
            r: Math.min(255, rgb.r + 40),
            g: Math.min(255, rgb.g + 40),
            b: Math.min(255, rgb.b + 40)
        };

        // Create a darker variant for text
        const darkRgb = {
            r: Math.max(0, rgb.r - 70),
            g: Math.max(0, rgb.g - 70),
            b: Math.max(0, rgb.b - 70)
        };

        return {
            bg: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`,
            lightBg: `rgba(${lightRgb.r}, ${lightRgb.g}, ${lightRgb.b}, 0.5)`,
            borderColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            textColor: `rgb(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b})`,
        };
    };
    const customStyle = generateStyles(color);
    return (
        <>

            <div className="container mx-auto p-3 md:p-6 bg-cover bg-center w-full rounded-xl md:rounded-3xl my-3 md:my-5"
                style={{ backgroundImage: `url(${loyal})` }}>
                <div className="flex flex-col lg:flex-row justify-center items-center gap-5 md:gap-8 max-w-7xl mx-auto">
                    {/* Loyalty Card Section - Enhanced for responsiveness */}
                    <div className="w-full sm:w-auto max-w-sm sm:max-w-md mx-auto lg:mx-0 my-4 lg:my-0">
                        <motion.div
                            style={{
                                background: `linear-gradient(135deg, ${customStyle.lightBg}, ${customStyle.bg})`,
                                borderColor: customStyle.borderColor
                            }}
                            className={`relative overflow-hidden border-2 rounded-2xl shadow-lg mx-auto`}
                            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Card header */}
                            <div className="p-3 sm:p-4">
                                <div className="flex flex-col items-center mb-2 relative">
                                    <div className="flex items-center justify-center mb-2">
                                        <img src={logo} alt="Logo" className="w-full max-w-xs sm:max-w-sm" />
                                    </div>
                                    <span className="px-3 py-1 text-xs font-bold uppercase rounded-full z-20 absolute top-2 left-2 bg-white/40 backdrop-blur-sm">
                                        Silver
                                    </span>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2" style={{ fontFamily: 'Zen Dots' }}>
                                        1234 5432 7654 3210
                                    </h3>
                                </div>

                                <div className="font-bold text-gray-900 flex items-center justify-between mt-3 px-2">
                                    <div className="text-sm text-gray-800" style={{ fontFamily: 'Zen Dots' }}>User's name</div>
                                    <div className="text-sm sm:text-base" style={{ fontFamily: 'Zen Dots' }}>0000 Points</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Benefits Section - Enhanced for responsiveness */}
                    <div className="text-white bg-black/60 backdrop-blur-sm w-full lg:w-1/2 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center sm:text-left mb-4">Benefits of Being a Loyalty Member</h2>
                        <ol className="list-decimal pl-5 sm:pl-7 space-y-3 sm:space-y-4">
                            <li className="font-semibold text-lg sm:text-xl">Discounts & Cashback on Bookings</li>
                            <ul className="list-disc pl-5 text-base sm:text-lg space-y-1">
                                <li>Get exclusive discount codes, cashback offers, or lower service fees for members.</li>
                                <li>Earn reward points on each booking that can be redeemed later.</li>
                            </ul>
                            <li className="font-semibold text-lg sm:text-xl">Priority Booking Access</li>
                            <ul className="list-disc pl-5 text-base sm:text-lg space-y-1">
                                <li>Book seats before public release during peak seasons or holidays.</li>
                                <li>Reserve favorite seats in advance.</li>
                            </ul>
                            <li className="font-semibold text-lg sm:text-xl">Faster Bookings</li>
                            <ul className="list-disc pl-5 text-base sm:text-lg space-y-1">
                                <li>Save passenger details, routes, and payment info for 1-click booking.</li>
                                <li>Express checkout for repeat users.</li>
                            </ul>
                            <li className="font-semibold text-lg sm:text-xl">Dedicated Customer Support</li>
                            <ul className="list-disc pl-5 text-base sm:text-lg space-y-1">
                                <li>Access to a priority helpline or live chat for faster issue resolution.</li>
                            </ul>
                            <li className="font-semibold text-lg sm:text-xl">App-Only or Member-Only Offers</li>
                            <ul className="list-disc pl-5 text-base sm:text-lg space-y-1">
                                <li>Special deals only visible to loyalty members through the app or member login.</li>
                            </ul>
                        </ol>
                    </div>
                </div>

                {/* Join Loyalty Program Section */}
                <div className="mt-8 mb-2 text-center">
                    <button 
                    className="bg-gradient-to-r from-yellow-400 to-amber-600
                     hover:from-amber-600 hover:to-yellow-400 text-white font-bold py-2 px-6 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg">
                        Join Our Loyalty Program
                    </button>
                    <p className="text-white mt-2 px-4 py-2 rounded-lg bg-black/40 inline-block">Start earning rewards with every journey</p>
                </div>
            </div>
        </>
    );
};

export default Loyalty;