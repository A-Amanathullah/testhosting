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
            <div className="container flex justify-between gap-8 px-4 py-6 ">
                <div className=" p-6 rounded-3xl flex-col  bg-secondary place-center "> 
                    <div className="text-5xl text-white font-extrabold py-4">
                        It's never been easier to book your journey online!
                    </div>

                    <div className="text-4xl text-white font-normal py-4">
                        Reserve your tickets in 3 steps...
                    </div>

                    <div className="py-4">
                        <button className="bg-white  text-3xl border border-primary 
                             py-3 px-5 rounded-full
                        hover:bg-primary duration-200
                        hover:text-white hover:border-white  text-primary"
                            onClick={handleSearch}>

                            Book Now                     
                        </button>
                    </div>
                </div>
                

                <div className="">
                    <img src={bus} alt="bus-image" className=" rounded-3xl max-w-xl" />
                </div>
            </div>

            <div className="container px-4 py-7 ">
                <div className="flex justify-evenly gap-7">
                    <div className="text-center bg-gray-500 text-white rounded-3xl p-6 ">
                        <div className="justify-self-center -translate-y-12 bg-slate-300 p-3 w-14 rounded-lg">
                          <FaSearch className=" text-primary text-3xl "/>  
                        </div>
                        <div className="text-2xl font-semibold py-4">Search Your Transit</div>
                        <div className="p-2 text-lg">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Excepturi eligendi natus iusto minus, accusantium tenetur vel?
                            Earum quasi illum, corporis eius
                        </div>
                    </div>

                    <div className="text-center bg-gray-500 text-white rounded-3xl p-6 ">
                    <div className="justify-self-center -translate-y-12 bg-slate-300 p-3 w-14 rounded-lg">
                          <GiDiscGolfBag className=" text-primary text-3xl "/>  
                        </div>
                        <div className="text-2xl font-semibold py-4">Reserve Your Seats</div>
                        <div className="p-2 text-lg">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Excepturi eligendi natus iusto minus, accusantium tenetur vel?
                            Earum quasi illum, corporis eius
                        </div>
                    </div>

                    <div className="text-center bg-gray-500 text-white rounded-3xl p-6 ">
                        <div className="justify-self-center -translate-y-12 bg-slate-300 p-3 w-14 rounded-lg">
                            <RiMoneyDollarCircleFill className=" text-primary text-3xl "/>  
                            </div>
                            <div className="text-2xl font-semibold py-4">Complete The Payment</div>
                            <div className="p-2 text-lg">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                Excepturi eligendi natus iusto minus, accusantium tenetur vel?
                                Earum quasi illum, corporis eius
                            </div>
                        </div>
                </div>
            </div>
            </>
    )
}

export default Cards;