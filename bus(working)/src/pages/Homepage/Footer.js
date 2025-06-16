import logo from "../../assets/Side.png";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
const Footer = () =>{
    return(
        <>
        <div>
            <div className="w-full bg-white p-4 rounded-t-3xl">
                <div className="container flex justify-between py-4">
                    <div className="">
                        <div className="text-xl font-medium ">Useful Links</div>
                        <ul className="py-4 underline decoration-sky-500 text-lg cursor-pointer">
                            <li className="hover:text-primary">About Us</li>
                            <li className="hover:text-primary">FAQs</li>
                            <li className="hover:text-primary">Partners</li>
                            <li className="hover:text-primary">Blog</li>
                        </ul>
                    </div>
                    <div className="">
                        <div className="text-xl font-medium ">Legal</div>
                        <ul className="py-4 underline decoration-sky-500 text-lg cursor-pointer ">
                            <li className="hover:text-primary">Privacy Policy</li>
                            <li className="hover:text-primary">Terms & Conditions</li>
                            <li className="hover:text-primary">Ticket Policies</li>
                            <li className="hover:text-primary">Contact</li>
                        </ul>
                    </div>
                    <div className="">
                        <div className="text-xl font-medium ">Address</div>
                        <ul className="py-4 underline decoration-sky-500  text-lg cursor-pointer">
                            <li className="hover:text-primary">No-00 ,Main street,<br/> kalmunai.</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center">
                        <div>
                            <img src={logo} alt="RS Express"  className="max-w-64 h-28"/>
                        </div>
                        <div className="flex gap-5 text-primary text-4xl cursor-pointer">
                            <FaFacebook />
                            <FaLinkedin />
                            <FaSquareXTwitter />
                            <FaYoutube />
                        </div>
                    </div>
                </div>

                <div className="border-t border-t-black flex justify-center py-4">Copyright &copy; 2025 RS Express. All rights reserved | Developed by Imss.lk </div>
            </div>
        </div>
        </>
    )
}

export default Footer;