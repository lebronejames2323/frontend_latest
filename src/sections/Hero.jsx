import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pccase from '../assets/pccase.jpg'
import motherboard from '../assets/motherboard.jpg'
import gpu from '../assets/gpu.jpg'
import ryzen from '../assets/ryzen5.jpg'

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

    return (
        <div id='hero' className='w-full flex justify-center items-center lg:h-[700px] h-[600px]'>
            <Slider className='w-full' {...settings}>
                <div>
                    <div className='w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center' style={{backgroundImage: `url(${gpu})`}}>
                        <h1 className='text-white lg:text-[120px] text-[60px] uppercase font-bold lg:leading-[120px] leading-[70px]'>SAPPHIRE<br/>RX 6600</h1>
                        <h1 className='text-white text-2xl'>100% trusted <span className='text-themeyellow font-semibold'>Computer Parts</span></h1>
                        <button className='bg-themeyellow px-6 py-3 rounded-lg text-black font-semibold'>CASH ON DELIVERY</button>
                    </div>
                </div>

                <div>
                    <div className='w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center' style={{backgroundImage: `url(${motherboard})`}}>
                        <h1 className='text-white lg:text-[120px] text-[60px] uppercase font-bold lg:leading-[120px] leading-[70px]'>MSI MAG<br/>B650</h1>
                        <h1 className='text-white text-2xl'>100% trusted <span className='text-themeyellow font-semibold'>Computer Parts</span></h1>
                        <button className='bg-themeyellow px-6 py-3 rounded-lg text-black font-semibold'>FREE SHIPPING</button>
                    </div>
                </div>

                <div>
                    <div className='w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center' style={{backgroundImage: `url(${pccase})`}}>
                        <h1 className='text-white lg:text-[120px] text-[60px] uppercase font-bold lg:leading-[120px] leading-[70px]'>ENERMAX<br/>PC CASE</h1>
                        <h1 className='text-white text-2xl'>100% trusted <span className='text-themeyellow font-semibold'>Computer Parts</span></h1>
                        <button className='bg-themeyellow px-6 py-3 rounded-lg text-black font-semibold'>LIMITED STOCKS</button>
                    </div>
                </div>
                <div>
                    <div className='w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center' style={{backgroundImage: `url(${ryzen})`}}>
                        <h1 className='text-white lg:text-[120px] text-[60px] uppercase font-bold lg:leading-[120px] leading-[70px]'>RYZEN<br/>5600</h1>
                        <h1 className='text-white text-2xl'>100% trusted <span className='text-themeyellow font-semibold'>Computer Parts</span></h1>
                        <button className='bg-themeyellow px-6 py-3 rounded-lg text-black font-semibold'>EXCLUSIVE DEAL</button>
                    </div>
                </div>
            </Slider>
        </div>
    )
}


export default Hero