import React, { useState } from "react";
import SeatPlanning from "./SeatPlanning";
import FillingForm from "./FillingForm";
import SelectedCard from "./SelectedCard";

const SeatBooking = () => {
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");

    return (
        <div className="bg-gray-100">
            <SelectedCard />
            <div className="flex justify-evenly w-full px-0.5 sm:px-1 md:px-2">
                <div className="container flex flex-col md:flex-row gap-1 md:gap-3 w-full max-w-5xl mx-auto">
                    <FillingForm pickup={pickup} setPickup={setPickup} drop={drop} setDrop={setDrop} />
                    <SeatPlanning pickup={pickup} drop={drop} />
                </div>
            </div>
        </div>
    );
};

export default SeatBooking;
