import bgImage from "../../assets/image.jpeg";
import Form from "./Form";
import { motion } from 'motion/react';


const Hero= ()=>{

    return(
        <motion.div 
            className=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="">
                    {/* image section */}
                    <motion.div 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <img src={bgImage} alt="" className="w-full h-[70vh] object-cover"/>
                    </motion.div>
                    {/* form section */}
                    <motion.div 
                        className=""
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Form/>
                    </motion.div>
            </div>
        </motion.div>
    )
}

export default Hero;