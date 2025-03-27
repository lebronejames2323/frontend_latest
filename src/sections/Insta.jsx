import React, { useEffect } from 'react'
import insta1 from '../assets/insta-1.jpg'
import insta2 from '../assets/insta-2.jpg'
import insta3 from '../assets/insta-3.jpg'
import insta4 from '../assets/insta-4.jpg'
import insta5 from '../assets/insta-5.jpg'
import insta6 from '../assets/insta-6.jpg'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Insta = () => {

    useEffect(() => {
    AOS.init({ 
    offset: 100,
    duration: 500,
    easing: 'ease-in-out',
    });

    AOS.refresh();

    }, [])

    return (
        <div className='w-full lg:px-20 px-5 py-[80px] bg-white flex flex-col justify-center items-center gap-4'>
            <h1 data-aos="zoom-in" data-aos-delay="100" className='text-xl font-semibold capitalize text-themegreen'>
                Our Instagram Account
            </h1>
            <h1 data-aos="zoom-in" data-aos-delay="200" className='text-black font-semibold text-[42px] leading-[50px] text-center capitalize'>Follow us on Instagram</h1>
            <div data-aos="zoom-in" data-aos-delay="300" className='grid items-center justify-center w-full grid-cols-1 gap-6 mt-8 lg:grid-cols-6'>
                <img src={insta1} alt="" className='rounded-lg' />
                <img src={insta2} alt="" className='rounded-lg' />
                <img src={insta3} alt="" className='rounded-lg' />
                <img src={insta4} alt="" className='rounded-lg' />
                <img src={insta5} alt="" className='rounded-lg' />
                <img src={insta6} alt="" className='rounded-lg' />
            </div>
            <button data-aos="zoom-in" data-aos-delay="200" className='px-8 py-3 mt-12 font-semibold text-white uppercase rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black'>Instagram</button>
        </div>
    )
}

export default Insta