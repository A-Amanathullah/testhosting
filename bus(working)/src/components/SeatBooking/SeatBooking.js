// import React, { useState } from "react";
import SeatPlanning from "./SeatPlanning";
// import FillingForm from "./FillingForm";
import SelectedCard from "./SelectedCard";

const SeatBooking = () => {
    // const [pickup, setPickup] = useState("");
    // const [drop, setDrop] = useState("");

    return (
        <div className="bg-gray-100">
            <div className="grid">
                
                <div className="container pt-1 sm:pt-3 p-2 border border-red-500 bg-red-300 rounded-xl mt-2">
                    <div className=" flex justify-self-center pb-4 text-xl  font-bold">Important Notice</div>
                    <div>
                        <p className="text-center text-sm">
                            If the cancellation is made before 02:00PM on the day of travel, 
                            the refund will be issued after deductry of booking fee of Rs.300.00 per seat.
                            If the cancellation is made after 02:00PM on the day of travel, No refund will be issued.
                        </p>
                        {/* <ul className="list-disc pl-3 text-xs">
                            <li className="pb-1">If the cancellation is made before 02:00PM on the day of travel, the refund will be issued after deductry of booking fee of Rs.300.00 per seat.</li>
                            <li>If the cancellation is made after 02:00PM on the day of travel, No refund will be issued.</li>
                        </ul> */}
                    </div>
                </div>
                <SelectedCard />
            </div>

            <div className=" w-full px-0.5 sm:px-1 md:px-2">
                <div className=" md:flex-row gap-1 md:gap-3 w-full max-w-5xl mx-auto">
                    {/* <FillingForm pickup={pickup} setPickup={setPickup} drop={drop} setDrop={setDrop} /> */}
                    <SeatPlanning />
                </div>
            </div>
        </div>
    );
};

export default SeatBooking;
