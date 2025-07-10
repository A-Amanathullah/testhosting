import bus from "../../assets/bus.jpg";
import { FaSearch } from "react-icons/fa";
import { GiDiscGolfBag } from "react-icons/gi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'


const Cards = () => {
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/bus-search');
        
    };

    return(
        <>
            <div className="container flex flex-col md:flex-row justify-between gap-4 md:gap-8 px-4 py-6">
                <div className="p-4 md:p-6 rounded-3xl flex-col bg-secondary place-center order-2 md:order-1"> 
                    <div className="text-3xl sm:text-4xl md:text-5xl text-white font-extrabold py-2 md:py-4">
                        It's never been easier to book your journey online!
                    </div>

                    <div className="text-xl sm:text-2xl md:text-4xl text-white font-normal py-2 md:py-4">
                        Reserve your tickets in 3 steps...
                    </div>

                    <div className="py-3 md:py-4">
                        <button className="bg-white text-xl sm:text-2xl md:text-3xl border border-primary 
                             py-2 md:py-3 px-4 md:px-5 rounded-full
                        hover:bg-primary duration-200
                        hover:text-white hover:border-white text-primary"
                            onClick={handleSearch}>
                            Book Now                     
                        </button>
                    </div>
                </div>
                
                <div className="order-1 md:order-2 flex justify-center">
                    <img 
                        src={bus} 
                        alt="bus-image" 
                        className="rounded-3xl w-auto md:max-w-xl object-cover h-48 sm:h-64 md:h-auto" 
                    />
                </div>
            </div>

            <div className="container px-4 py-7">
                <div className="flex flex-col md:flex-row justify-evenly gap-5 md:gap-7">
                    <div className="text-center bg-gray-500 text-white rounded-3xl p-4 md:p-6 mb-8 md:mb-0">
                        <div className="mx-auto -translate-y-8 md:-translate-y-12 bg-slate-300 p-2 md:p-3 w-12 md:w-14 rounded-lg flex justify-center">
                          <FaSearch className="text-primary text-2xl md:text-3xl"/>  
                        </div>
                        <div className="text-xl md:text-2xl font-semibold py-2 md:py-4">Search Your Transit</div>
                        <div className="p-2 text-base md:text-lg">
                            Search for available buses by selecting your departure and 
                            destination locations. Choose your preferred date and view 
                            all available options with real-time schedules.
                        </div>
                    </div>

                    <div className="text-center bg-gray-500 text-white rounded-3xl p-4 md:p-6 mb-8 md:mb-0">
                        <div className="mx-auto -translate-y-8 md:-translate-y-12 bg-slate-300 p-2 md:p-3 w-12 md:w-14 rounded-lg flex justify-center">
                          <GiDiscGolfBag className="text-primary text-2xl md:text-3xl"/>  
                        </div>
                        <div className="text-xl md:text-2xl font-semibold py-2 md:py-4">Reserve Your Seats</div>
                        <div className="p-2 text-base md:text-lg">
                            Select your preferred seats from our interactive seating chart.
                            Choose the most comfortable options for your journey and add
                            any special requirements or preferences.
                        </div>
                    </div>

                    <div className="text-center bg-gray-500 text-white rounded-3xl p-4 md:p-6">
                        <div className="mx-auto -translate-y-8 md:-translate-y-12 bg-slate-300 p-2 md:p-3 w-12 md:w-14 rounded-lg flex justify-center">
                            <RiMoneyDollarCircleFill className="text-primary text-2xl md:text-3xl"/>  
                        </div>
                        <div className="text-xl md:text-2xl font-semibold py-2 md:py-4">Complete The Payment</div>
                        <div className="p-2 text-base md:text-lg">
                            Finalize your booking with our secure payment options.
                            Receive instant confirmation and e-tickets directly to
                            your email or mobile device for a hassle-free journey.
                        </div>
                    </div>
                </div>
            </div>
            </>
    )
}

export default Cards;