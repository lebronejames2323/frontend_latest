import gallery1 from '../assets/pcc1.jpg'
import gallery2 from '../assets/insta-3.jpg'
import gallery3 from '../assets/pcc2.jpg'
import gallery4 from '../assets/insta-4.jpg'
import gallery5 from '../assets/insta-5.jpg'
import gallery6 from '../assets/pcc3.jpg'

const Gallery = () => {

    return (
        <div className='w-full lg:px-20 px-5 py-[80px] bg-white flex flex-col justify-center items-center gap-4 mb-20'>
            <h1 className='text-themegreen text-xl font-semibold capitalize'>
            Stay Inspired by Tech
            </h1>
            <h1 className='text-black font-semibold text-[40px] leading-[50px] text-center capitalize'>Discover Limitless Possibilities</h1>
            <div className='w-full grid lg:grid-cols-6 grid-cols-1 justify-center items-center gap-6 mt-8'>
                <img src={gallery1} alt="" className='rounded-lg' />
                <img src={gallery2} alt="" className='rounded-lg' />
                <img src={gallery3} alt="" className='rounded-lg' />
                <img src={gallery4} alt="" className='rounded-lg' />
                <img src={gallery5} alt="" className='rounded-lg' />
                <img src={gallery6} alt="" className='rounded-lg' />
            </div>
        </div>
    )
}

export default Gallery