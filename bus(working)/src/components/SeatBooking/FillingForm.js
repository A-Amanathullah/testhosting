import AutocompleteInput from "../Other/AutocompleteInput";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const FillingForm = ({ pickup, setPickup, drop, setDrop }) => {
    const [loyaltyPoints, setLoyaltyPoints] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    
    const location = useLocation();
    const trip = location.state?.trip;
    
    // Log changes to user and loyalty points for debugging
    useEffect(() => {
        console.log("User state:", user ? `ID: ${user.id}, Name: ${user.name}` : "No user");
        console.log("Loyalty points:", loyaltyPoints);
    }, [user, loyaltyPoints]);
    
    // Fetch loyalty points directly from the loyalty_members table in the backend
    useEffect(() => {
        const fetchLoyaltyPoints = async () => {
            if (!user) {
                return; // Don't fetch if no user is logged in
            }
            
            setLoading(true);
            try {
                // Get API URL from environment or use default
                const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
                
                console.log(`Fetching loyalty points for user ID: ${user.id}`);
                
                // Set authentication headers
                const headers = {};
                if (user.token) {
                    headers.Authorization = `Bearer ${user.token}`;
                }
                
                // The backend doesn't have a direct endpoint for getting loyalty by user ID,
                // so we need to get all loyalty members and filter by user_id
                const response = await axios.get(`${API_URL}/loyalty-members`, { headers });
                console.log('All loyalty members response:', response.data);
                
                let memberData = null;
                
                // Check if the response has data property (paginated response)
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    // Find the loyalty member with matching user_id
                    memberData = response.data.data.find(member => member.user_id === user.id);
                } else if (response.data && Array.isArray(response.data)) {
                    // Direct array response
                    memberData = response.data.find(member => member.user_id === user.id);
                }
                
                if (memberData) {
                    // The field in the loyalty_members table is total_points not points
                    setLoyaltyPoints(memberData.total_points);
                    console.log(`Found loyalty points: ${memberData.total_points} for user ${user.id}`);
                } else {
                    console.log(`No loyalty record found for user ${user.id}`);
                }
            } catch (error) {
                console.error("Error fetching loyalty points:", error);
                
                // If the first approach fails, try the index endpoint with filtering
                try {
                    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
                    console.log("Trying alternative approach with filtering");
                    
                    // Get all members and manually filter
                    const allResponse = await axios.get(`${API_URL}/loyalty-members`);
                    
                    let memberData = null;
                    if (allResponse.data && allResponse.data.data) {
                        // Paginated response
                        memberData = allResponse.data.data.find(m => Number(m.user_id) === Number(user.id));
                    } else if (allResponse.data && Array.isArray(allResponse.data)) {
                        // Direct array response
                        memberData = allResponse.data.find(m => Number(m.user_id) === Number(user.id));
                    }
                    
                    if (memberData && memberData.total_points !== undefined) {
                        setLoyaltyPoints(memberData.total_points);
                        console.log(`Found points from alternative approach: ${memberData.total_points}`);
                    }
                } catch (fallbackError) {
                    console.error("Alternative approach also failed:", fallbackError);
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchLoyaltyPoints();
    }, [user]);

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
                            {/* Show loading indicator while fetching loyalty points */}
                            {user && loading && (
                                <div className="border border-gray-300 p-2 rounded-xl text-gray-500 flex-col justify-items-center text-xs">
                                    <div className="text-sm pb-1">Loyalty Points</div>
                                    <div className="text-base font-bold flex items-center">
                                        <span className="mr-2">Loading</span>
                                        <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
                                    </div>
                                </div>
                            )}
                            {/* Only show loyalty points if the user has actual points from the database */}
                            {user && !loading && loyaltyPoints !== null && loyaltyPoints > 0 && (
                                <div className="border border-primary p-2 rounded-xl text-primary flex-col justify-items-center hover:bg-primary hover:text-white text-xs">
                                    <div className="text-sm pb-1">Loyalty Points</div>
                                    <div className="text-base font-bold">
                                        {loyaltyPoints}
                                    </div>
                                </div>
                            )}
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