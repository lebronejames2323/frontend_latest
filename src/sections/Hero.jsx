import React, { useEffect } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import headset from '../assets/headsett.jpg'
import earbuds from '../assets/earbudss.jpg'
import dslr from '../assets/dslr11.jpg'
import ryzen from '../assets/ryzen5.jpg'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Hero = () => {

    const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 3000,
    // pauseOnHover: true
    };

    useEffect(() => {
    AOS.init({ 
    offset: 100,
    duration: 500,
    easing: 'ease-in-out',
    });

    AOS.refresh();

    }, [])
    
    return (
        <div id='hero' className='w-full flex justify-center items-center lg:h-[700px] h-[600px]'>
            <Slider className='w-full' {...settings}>
                <div>
                    <div className='w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center' style={{backgroundImage: `url(${dslr})`}}>
                        <h1 data-aos="zoom-in" data-aos-delay="50" className='text-themeyellow border-2 rounded-lg font-semibold border-themeyellow px-7 py-2 text-xl '>Get up to 80% Discount</h1>
                        <h1 data-aos="zoom-in" data-aos-delay="100" className='text-white lg:text-[120px] text-[60px] uppercase font-bold lg:leading-[120px] leading-[70px]'>SAPPHIRE<br/>RX 6600</h1>
                        <h1 data-aos="zoom-in" data-aos-delay="100" className='text-white text-2xl'>100% trusted <span className='text-themeyellow font-semibold'>Computer Parts</span></h1>
                        <button data-aos="zoom-in" data-aos-delay="200" className='bg-themeyellow px-6 py-3 rounded-lg text-black font-semibold'>CASH ON DELIVERY</button>
                    </div>
                </div>

                <div>
                    <div className='w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center' style={{backgroundImage: `url(${earbuds})`}}>
                        <h1 data-aos="zoom-in" data-aos-delay="50" className='text-themeyellow border-2 rounded-lg font-semibold border-themeyellow px-6 py-2 text-xl'>Get up to 80% Discount</h1>
                        <h1 data-aos="zoom-in" data-aos-delay="100" className='text-white lg:text-[120px] text-[60px] uppercase font-bold lg:leading-[120px] leading-[70px]'>MSI MAG<br/>B650</h1>
                        <h1 data-aos="zoom-in" data-aos-delay="100" className='text-white text-2xl'>100% trusted <span className='text-themeyellow font-semibold'>Computer Parts</span></h1>
                        <button data-aos="zoom-in" data-aos-delay="200" className='bg-themeyellow px-6 py-3 rounded-lg text-black font-semibold'>FREE SHIPPING</button>
                    </div>
                </div>

                <div>
                    <div className='w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center' style={{backgroundImage: `url(${headset})`}}>
                        <h1 data-aos="zoom-in" data-aos-delay="50" className='text-themeyellow border-2 rounded-lg font-semibold border-themeyellow px-6 py-2 text-xl'>Get up to 80% Discount</h1>
                        <h1 data-aos="zoom-in" data-aos-delay="100" className='text-white lg:text-[120px] text-[60px] uppercase font-bold lg:leading-[120px] leading-[70px]'>ENERMAX<br/>PC CASE</h1>
                        <h1 data-aos="zoom-in" data-aos-delay="100" className='text-white text-2xl'>100% trusted <span className='text-themeyellow font-semibold'>Computer Parts</span></h1>
                        <button data-aos="zoom-in" data-aos-delay="200" className='bg-themeyellow px-6 py-3 rounded-lg text-black font-semibold'>1 YEAR WARRANTY</button>
                    </div>
                </div>
                <div>
                    <div className='w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center' style={{backgroundImage: `url(${ryzen})`}}>
                        <h1 data-aos="zoom-in" data-aos-delay="50" className='text-themeyellow border-2 rounded-lg font-semibold border-themeyellow px-6 py-2 text-xl'>Get up to 80% Discount</h1>
                        <h1 data-aos="zoom-in" data-aos-delay="100" className='text-white lg:text-[120px] text-[60px] uppercase font-bold lg:leading-[120px] leading-[70px]'>RYZEN<br/>5600</h1>
                        <h1 data-aos="zoom-in" data-aos-delay="100" className='text-white text-2xl'>100% trusted <span className='text-themeyellow font-semibold'>Computer Parts</span></h1>
                        <button data-aos="zoom-in" data-aos-delay="200" className='bg-themeyellow px-6 py-3 rounded-lg text-black font-semibold'>1 YEAR WARRANTY</button>
                    </div>
                </div>
            </Slider>
        </div>
    )
}


export default Hero
