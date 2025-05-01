import React, { useEffect } from 'react'
import banner1 from '../assets/banner1.jpg'
import banner2 from '../assets/banner2.jpg'
import banner3 from '../assets/banner3.jpg'

const Types = () => {

    return (
        <div className='w-full lg:px-20 px-5 py-[80px] grid lg:grid-cols-3 grid-cols-1 justify-center items-start gap-10'>
            <div className='h-[265px] flex flex-col justify-center items-end gap-6 bg-cover bg-center p-10 rounded-lg' style={{backgroundImage: `url(${banner1})`}}>
                <h1 className='text-4xl text-end text-white font-semibold '>Seagate HDD</h1>
            </div>
            <div className='h-[265px] flex flex-col justify-center items-end gap-6 bg-cover bg-center p-10 rounded-lg' style={{backgroundImage: `url(${banner2})`}}>
                <h1 className='text-4xl text-end text-white font-semibold '>Sata SSD</h1>
            </div>
            <div className='h-[265px] flex flex-col justify-center items-end gap-6 bg-cover bg-center p-10 rounded-lg' style={{backgroundImage: `url(${banner3})`}}>
                <h1 className='text-4xl text-end text-white font-semibold '>NVME</h1>
            </div>
        </div>
    )
}

export default Types