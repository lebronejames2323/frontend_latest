import deal from '../assets/deal-bg.jpg'

const Banner = () => {

    return (
        <div className='w-full lg:px-20 px-5 py-[80px]'>
            <div className='w-full h-[300px] round-lg bg-cover bg-center flex flex-col justify-center items-center gap-3' style={{backgroundImage: `url(${deal})`}}>
                <h1 className='text-yellow-300 text-2xl font-semibold'>Daily Tech Deals</h1>
                <h1 className='text-white font-bold text-[42px] leading-[50px] text-center'>Build Your Custom Rig</h1>
            </div>
        </div>
    )
}

export default Banner