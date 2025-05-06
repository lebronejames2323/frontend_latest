import React, { useEffect } from 'react'
import payment from '../assets/payment.png'
import shipping from '../assets/shipping1.jpg'
import refund from '../assets/return.png'
import gift from '../assets/gift.png'

const Services = () => {

    return (
        <div className='w-full lg:px-20 px-5 pt-[0px] pb-[80px] grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-10'>
            <div className='flex flex-col justify-center items-center gap-2'>
                <img src={shipping} alt="" className='mb-[20px] w-[60px]'/>
                <h1 className='text-xl text-black font-semibold'>Nationwide Shipping</h1>
                <h1 className='text-[17px] text-gray-500'>Enjoy seamless shopping at home.</h1>
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
                <img src={payment} alt="" className='mb-[20px] w-[60px]'/>
                <h1 className='text-xl text-black font-semibold'>100% Secure Payment</h1>
                <h1 className='text-[17px] text-gray-500'>Shop safely and confidently.</h1>
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
                <img src={refund} alt="" className='mb-[20px] w-[60px]'/>
                <h1 className='text-xl text-black font-semibold'>Fast & Reliable Delivery</h1>
                <h1 className='text-[17px] text-gray-500'>Experience dependable service.</h1>
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
                <img src={gift} alt="" className='mb-[20px] w-[60px]'/>
                <h1 className='text-xl text-black font-semibold'>Hassle-Free Returns</h1>
                <h1 className='text-[17px] text-gray-500'>Easy and stress-free returns.</h1>
            </div>
        </div>
    )
}

export default Services