import React, { useEffect } from 'react'
import banner1 from '../assets/banner11.jpg'
import banner2 from '../assets/banner222.jpg'
import banner3 from '../assets/banner22.jpg'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Types = () => {

    useEffect(() => {
    AOS.init({ 
    offset: 100,
    duration: 500,
    easing: 'ease-in-out',
    });
    
    AOS.refresh();
    
    }, [])

    return (
        <div className='w-full lg:px-20 px-5 py-[80px] grid lg:grid-cols-3 grid-cols-1 justify-center items-start gap-10'>
            <div data-aos="zoom-in" data-aos-delay="100" className='flex flex-col items-end justify-center gap-6 p-10 bg-center bg-cover rounded-lg' style={{backgroundImage: `url(${banner1})`}}>
                <h1 className='px-6 py-2 text-xl font-semibold border-2 rounded-lg text-themeyellow border-themeyellow'>Storage</h1>
                <h1 className='text-4xl font-semibold text-white text-end '>Seagate HDD</h1>
                <button className='px-6 py-3 font-semibold text-black rounded-lg bg-themeyellow'>SHOP NOW</button>
            </div>
            <div data-aos="zoom-in" data-aos-delay="100" className='flex flex-col items-end justify-center gap-6 p-10 bg-center bg-cover rounded-lg' style={{backgroundImage: `url(${banner2})`}}>
                <h1 className='px-6 py-2 text-lg font-semibold border-2 rounded-lg text-themeyellow border-themeyellow'>Storage</h1>
                <h1 className='text-4xl font-semibold text-white text-end '>Sata SSD</h1>
                <button className='px-6 py-3 font-semibold text-black rounded-lg bg-themeyellow'>SHOP NOW</button>
            </div>
            <div data-aos="zoom-in" data-aos-delay="100" className='flex flex-col items-end justify-center gap-6 p-10 bg-center bg-cover rounded-lg' style={{backgroundImage: `url(${banner3})`}}>
                <h1 className='px-6 py-2 text-lg font-semibold border-2 rounded-lg text-themeyellow border-themeyellow'>Storage</h1>
                <h1 className='text-4xl font-semibold text-white text-end '>NVME</h1>
                <button className='px-6 py-3 font-semibold text-black rounded-lg bg-themeyellow'>SHOP NOW</button>
            </div>
        </div>
    )
}

export default Types