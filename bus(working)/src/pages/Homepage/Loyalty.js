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

            <div className="container p-6 bg-cover bg-center w-full rounded-3xl my-5"
                style={{ backgroundImage: `url(${loyal})` }}>
                <div className="flex justify-evenly items-center gap-5">
                    <div className=" w-auto justify-self-center">
                        <motion.div
                            style={{
                                background: `linear-gradient(135deg, ${customStyle.lightBg}, ${customStyle.bg})`,
                                borderColor: customStyle.borderColor
                            }}
                            className={`relative overflow-hidden border-2 rounded-2xl shadow-lg`}
                            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Card header */}
                            <div className="p-2">
                                <div className="flex flex-col items-center mb-2">
                                    <div className="flex items-center justify-center mb-1">
                                        <img src={logo} alt="Logo" className="w-80 justify-self-center " />

                                    </div>
                                    <span className="px-3 py-1 text-xs font-bold justify-self-start uppercase rounded-full z-20 absolute bg-white/40">
                                        Silver
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Zen Dots' }}>
                                        1234 5432 7654 3210
                                    </h3>
                                </div>

                                <div className="font-bold text-gray-900 flex items-center justify-between m-1">
                                    <div className="text-sm text-gray-800" style={{ fontFamily: 'Zen Dots' }}>User's name</div>
                                    <div style={{ fontFamily: 'Zen Dots' }}>0000 Points</div>
                                </div>
                            </div>
                            {/* Edit button */}
                            {/* <button

                                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button> */}
                        </motion.div>
                    </div>

                    <div className="text-white bg-black/50 w-1/2 p-9 rounded-3xl">
                        <div className="text-5xl">Benefits of Being a Loyalty Member</div>
                        <ol className="list-decimal p-6 px-7">
                            <li className="font-semibold text-xl">Discounts & Cashback on Bookings</li>
                            <ul className="list-disc p-2 text-lg">
                                <li>Get exclusive discount codes, cashback offers, or lower service fees for members.</li>
                                <li>Earn reward points on each booking that can be redeemed later.</li>
                            </ul>
                            <li className="font-semibold text-xl">Priority Booking Access</li>
                            <ul className="list-disc p-2 text-lg">
                                <li>Book seats before public release during peak seasons or holidays.</li>
                                <li>Reserve favorite seats in advance.</li>
                            </ul>
                            <li className="font-semibold text-xl">Discounts & Cashback on Bookings</li>
                            <ul className="list-disc p-2 text-lg">
                                <li>GSave passenger details, routes, and payment info for 1-click booking.</li>
                                <li>Express checkout for repeat users.</li>
                            </ul>
                            <li className="font-semibold text-xl">Dedicated Customer Support</li>
                            <ul className="list-disc p-2 text-lg">
                                <li>Access to a priority helpline or live chat for faster issue resolution.</li>
                            </ul>
                            <li className="font-semibold text-xl">App-Only or Member-Only Offers</li>
                            <ul className="list-disc p-2 text-lg">
                                <li>Special deals only visible to loyalty members through the app or member login</li>
                            </ul>
                        </ol>
                    </div>
                </div>

                <div className="">

                </div>
            </div>
        </>
    )
}

export default Loyalty;