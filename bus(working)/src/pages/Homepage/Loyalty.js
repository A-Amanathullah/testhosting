import loyal from "../../assets/loyal.jpg";
import logo from "../../assets/Side.png"

const Loyalty = () => {
    return(
        <>
        
            <div className="container p-6 bg-cover bg-center w-full rounded-3xl my-5"
                style={{ backgroundImage: `url(${loyal})` }}>
                <div className="flex justify-between items-center gap-5">
                    <div className=" w-1/2 ">
                        <div className="border border-black w-3/4 bg-stone-50 
                            shadow-md rounded-3xl justify-self-center">
                            <div className="flex items-center   justify-between p-7 py-6">
                                <div className="text-3xl">SURNAME</div>
                                <img src={logo} alt="RS Express"  className="max-w-48 h-15"/>
                            </div>

                            <div className=" p-7 text-4xl font-extrabold tracking-wide">Loyalty MEMBER</div>
                            <div className="justify-self-center text-2xl tracking-wide p-7 py-6 font-semibold">9 9 9 9 - 9 9 9 9 - 9 9 9 9 - 9 9 9 9</div>
                        </div>
                        
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