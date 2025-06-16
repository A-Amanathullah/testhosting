import bgImage from "../../assets/image.jpeg";
import Form from "./Form";


const Hero= ()=>{



    return(
        <>
        <div className="">
            <div className="">
                    {/* image section */}
                    <div >
                        <img src={bgImage} alt="" className="w-full h-[70vh]"/>

                    </div>
                    {/* form section */}
                    <div className="">
                        <Form/>
                    </div>
            </div>
        </div>
        </>
    )
}

export default Hero;