import AutocompleteInput from "../Other/AutocompleteInput";
import { useLocation, } from "react-router-dom";

const FillingForm = ({ pickup, setPickup, drop, setDrop }) => {

    const location = useLocation();
    const trip = location.state?.trip;

    return (
        <div className="pr-1 sm:pr-2 pt-2 sm:pt-3">
            <div className="bg-white rounded-2xl shadow-xl">
                <div className="bg-primary rounded-t-2xl border border-black p-1 sm:p-2 px-1 sm:px-2 text-white text-xs sm:text-sm font-medium">
                    <div className="font-semibold text-sm pb-1">Journey Date: <span>{trip.departure_date}</span></div>
                    <p className="text-xs">Please fill out the form below to request for a seat booking</p>
                </div>
                <div className="rounded-b-2xl p-2">
                    <div>
                        <div className="text-center font-bold text-base pb-2">Booking Information</div>
                        <div className="font-medium text-sm">Select PickUp & Drop Destinations:</div>
                        <div className="pb-2">
                            <fieldset className="w-32 sm:w-40">
                                <legend className="font-semibold text-xs">PickUp location :</legend>
                                <AutocompleteInput className="input-form rounded-lg text-xs border border-black" value={pickup} setValue={setPickup} />
                            </fieldset>
                        </div>
                        <div className="pb-2">
                            <fieldset className="w-32 sm:w-40">
                                <legend className="font-semibold text-xs">Drop location :</legend>
                                <AutocompleteInput className="input-form rounded-lg text-xs border border-black" value={drop} setValue={setDrop} />
                            </fieldset>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-evenly items-center gap-1">
                            <div className="border border-primary p-2 rounded-xl text-primary flex-col justify-items-center hover:bg-primary hover:text-white text-xs">
                                <div className="text-sm pb-1">Loyalty Points</div>
                                <div className="text-base font-bold">15</div>
                            </div>
                            <div className="border border-primary p-2 rounded-xl text-primary flex-col justify-items-center hover:bg-primary hover:text-white text-xs">
                                <div className="text-sm pb-1">Cost per seat</div>
                                <div className="text-base font-bold">Rs.{trip.price}</div>
                            </div>
                        </div>
                        <div>
                            <div className="p-2 border border-red-500 bg-red-300 rounded-xl mt-2">
                                <div className="text-sm font-bold">Important Notice</div>
                                <div>
                                    <ul className="list-disc pl-3 text-xs">
                                        <li className="pb-1">If the cancellation is made before 02:00PM on the day of travel, the refund will be issued after deductry of booking fee of Rs.300.00 per seat.</li>
                                        <li>If the cancellation is made after 02:00PM on the day of travel, No refund will be issued.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FillingForm;