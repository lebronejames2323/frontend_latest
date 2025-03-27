import React, { useEffect } from 'react'
import client1 from '../assets/client1.png'
import client2 from '../assets/client2.png'
import client3 from '../assets/client3.png'
import client4 from '../assets/client4.png'
import client5 from '../assets/client5.jpg'
import client6 from '../assets/client6.png'
import google from '../assets/google.jpg'
import apple from '../assets/apple.jpg'
import pay1 from '../assets/pay-1.jpg'
import pay2 from '../assets/pay-2.jpg'
import pay3 from '../assets/pay-3.jpg'
import pay4 from '../assets/pay-4.jpg'
import { Link } from 'react-scroll';
import { FaArrowUp } from 'react-icons/fa'
import AOS from 'aos';
import 'aos/dist/aos.css';


const Footer = () => {
    
    useEffect(() => {
    AOS.init({ 
    offset: 100,
    duration: 500,
    easing: 'ease-in-out',
    });

    AOS.refresh();

    }, [])

    return (
        <div id='contact' className='flex flex-col items-center justify-center w-full'>

            <div data-aos="zoom-in" data-aos-delay="100" className='grid items-center justify-center w-full grid-cols-2 gap-10 px-10 py-8 bg-themegreen lg:px-20 lg:grid-cols-6'>
                <img src={client1} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                <img src={client2} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                <img src={client3} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                <img src={client4} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                <img src={client5} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                <img src={client6} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
            </div>


            <div className='w-full lg:px-20 px-5 py-[32px] bg-gray-100 grid lg:grid-cols-[auto,auto,auto,auto,auto] grid-cols-1 justify-between items-start lg:gap-3 gap-10'>
                <div data-aos="zoom-in" data-aos-delay="200" className='flex flex-col justify-center gap-10 item-start grow'>
                    <div className='flex flex-col items-start justify-center gap-4'>
                        <h1 className='text-4xl italic font-bold underline text-themegreen'>GuildCord Shop</h1>
                        <p className='text-justify text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit<br/> vero laudantium quis,<br /> provident ducimus rem saepe accusantium tempore eos modi?</p>
                    </div>
                    <div className='flex flex-col items-start justify-center gap-4'>
                        <h1 className='text-xl font-semibold text-black capitalize'> Download our App</h1>
                        <div className='flex items-center justify-center gap-4'>
                        <img src={google} alt=""/>
                        <img src={apple} alt=""/>
                        </div>
                    </div>
                </div>

                <div data-aos="zoom-in" data-aos-delay="200">
                    <h1 className='text-xl font-semibold text-black capitalize'>Useful Links</h1>
                    <ul className='flex flex-col items-start justify-center gap-2 mt-8'>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                    </ul>
                </div>
                <div data-aos="zoom-in" data-aos-delay="200">
                    <h1 className='text-xl font-semibold text-black capitalize'>Useful Links</h1>
                    <ul className='flex flex-col items-start justify-center gap-2 mt-8'>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                    </ul>
                </div>
                <div data-aos="zoom-in" data-aos-delay="200">
                    <h1 className='text-xl font-semibold text-black capitalize'>Useful Links</h1>
                    <ul className='flex flex-col items-start justify-center gap-2 mt-8'>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                    </ul>
                </div>
                <div data-aos="zoom-in" data-aos-delay="200">
                    <h1 className='text-xl font-semibold text-black capitalize'>Useful Links</h1>
                    <ul className='flex flex-col items-start justify-center gap-2 mt-8'>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                        <li className='text-gray-500 cursor-pointer hover:text-black'>Home</li>
                    </ul>
                </div>
            </div>


            <div className='w-full lg:px-20 px-5 py-[30px] bg-gray-100'>
                <hr className='py-3 border-t border-gray-300'/>
                <div className='flex flex-col items-center justify-between w-full gap-10 lg:flex-row lg:gap-4'>
                    <div className='lg:w-[20%] w-full flex justify-center items-center gap-4'>
                        <img src={pay1} alt="" className='w-[50px] rounded-lg'/>
                        <img src={pay2} alt="" className='w-[50px] rounded-lg'/>
                        <img src={pay3} alt="" className='w-[50px] rounded-lg'/>
                        <img src={pay4} alt="" className='w-[50px] rounded-lg'/>
                    </div>
                    <div className='lg:w-[60%] w-full flex lg:flex-row flex-col justify-center items-center gap-4 flex-grow'>
                        <h1 className='text-2xl font-semibold text-black'>Subscribe Newsletter</h1>
                        <div>
                        <input type="email" placeholder='Enter valid email' className='w-full px-6 py-3 capitalize rounded-l-lg lg:w-auto'/>
                        <button className='w-full px-6 py-3 font-semibold text-white rounded-r-lg bg-themegreen lg:w-auto hover:bg-themeyellow hover:text-black'>SUBMIT</button>
                        </div>
                    </div>

                    <div className='lg:w-[20%] w-full'>
                    <p className='text-center text-gray-500 lg:text-end'>2025 Powered by MFI Polytechnic</p>
                    </div>
                </div>
            </div>


            <div id='icon-box' className='fixed p-3 text-white rounded-full cursor-pointer bg-themegreen hover:bg-themeyellow hover:text-black lg:bottom-6 right-6 bottom-6'>
                <Link to="hero" spy={true} offset={-100} smooth={true}>
                <FaArrowUp className='w-[35px] h-[35px]'/>
                </Link>
            </div>
        </div>
    )
}

export default Footer