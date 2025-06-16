import useBusHook from "../../hooks/useBusHook";
import BusTripCard from "./BusTripCard";
import { motion } from "framer-motion";


const BusList = () => {

    const { trips, buses, loading, error } = useBusHook();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200">
                <div className="flex space-x-2">
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
                    />
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
                    />
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.6 }}
                    />
                </div>
                <p className="mt-4 text-primary text-lg font-semibold">Finding the best trips for you...</p>
            </div>
        );
    }
    if (error) return <div className="p-6 text-red-500">Failed to load trips.</div>;


    return (
        <div className="bg-slate-200 min-h-full py-2 sm:py-4">
            <div className="container flex flex-col gap-4 sm:gap-7 max-w-4xl mx-auto px-1 sm:px-2 md:px-4">
                {trips.map(trip => (
                    <BusTripCard key={trip.id} trip={trip} buses={buses} />
                ))}
            </div>
        </div>
    );
};

export default BusList;