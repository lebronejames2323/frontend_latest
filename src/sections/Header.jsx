import React, { useEffect, useState } from 'react'
import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa'
import { IoPerson } from 'react-icons/io5'
import { Link } from 'react-scroll'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Header = () => {

    useEffect(() => {
        AOS.init({ 
            offset: 100,
            duration: 500,
            easing: 'ease-in-out',
        });

        AOS.refresh();

    }, [])

    const navItems = [
        {
            link: 'Home', path: 'hero'
        },
        {
            link: 'Category', path: 'category'
        },
        {
            link: 'Products', path: 'products'
        },
        {
            link: 'Featured', path: 'featured'
        },
        {
            link: 'Contact', path: 'contact'
        },
    ]

    return (
        <>
            <nav className='w-full bg-gray-100 flex justify-between items-center gap-1 lg:px-16 px-6 py-5 sticky top-0 z-50'>
                <h1 className='text-themepurple font-bold lg:text-[30px] text-3x1 italic'>GuildCord</h1>
                <ul className='lg:flex justify-center items-center gap-10 hidden'>
                    {navItems.map(({link, path })=> (
                        <Link key={path} className='text-black text-sm uppercase font-semibold cursor-pointer px-4 py-2 rounded-lg hover:bg-themepurple hover:text-white' to={path} spy={true} offset={-100} smooth={true}>
                            {link}
                        </Link>
                    ))}
                </ul>

                <div id='header-icons' className='lg:flex hidden justify-center items-center gap-6 text-black'>
                    <FaSearch className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themepurple'/>
                    <IoPerson className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themepurple'/>
                    <FaHeart className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themepurple'/>
                    <div className='relative'>
                        <FaShoppingCart className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themepurple'/>
                        <div className='bg-themepurple hover:bg-themeyellow px-3 py-1 text-white hover:text-black rounded-full absolute -top-[24px] -right-[15px] text-[14px] font-bold'>
                            2
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header