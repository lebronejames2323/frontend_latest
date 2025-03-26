import React, { useEffect, useState } from 'react'
import { FaSearch, FaHeart, FaShoppingCart, FaMapMarkedAlt } from 'react-icons/fa'
import { IoPerson } from 'react-icons/io5'
import { Link } from 'react-scroll'
import { FaXmark, FaBars, FaPhoneVolume } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { index, logout as Logout } from '../api/auth';
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";

function Header() {

    const [user, setUser] = useState(null);
    const [cookies, removeCookie] = useCookies();
    const navigate = useNavigate();
    const [totalProducts, setTotalProducts] = useState(0);
    
    const fetchCarts = async () => {
    const response = await fetch("http://localhost:8000/api/carts", {
      headers: {
      Authorization: `Bearer ${cookies.token}`,
      },
      });
          
      const res = await response.json();
      const productIds = res.data
      .flatMap(cart => cart.products)
      .map(product => product.id);

      const distinctProductCount = new Set(productIds).size;
      setTotalProducts(distinctProductCount);
    };
    
    const logout = () => {
        Logout(cookies.token).then((res) => {
          removeCookie("token");
          setUser(null);
          navigate(`/login`);
          toast.success('User logged out!');
        });
      };


    useEffect(() => {
    fetchCarts();
    }, []);

    const handleAccountClick = () => {
    navigate(`/account`);
    };

    const handleCartClick = () => {
    navigate(`/cart`);
    };

    const handleWishlistClick = () => {
    navigate(`/wishlist`);
    };
    
    const handleLoginClick = () => {
      navigate(`/login`);
    };
      
    const handleRegisterClick = () => {
      navigate(`/register`);
    };    

    const refreshUsers = () => {
    index(cookies.token).then((res) => {
    console.log(res);
    setUser(res?.data || null);
    });
    };

    useEffect(refreshUsers, []);

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
            link: 'Reviews', path: 'reviews'
        },
        {
            link: 'Contact', path: 'contact'
        },
    ]


    return (
        <>
            {/* <div id="header" className='w-full px-16 py-2 bg-themeyellow lg:flex hidden justify-between items-center gap-6'>
                <h1 className='text-sm font-semibold flex justify-center items-center gap-2'><FaPhoneVolume className='size-[18px]'/> <span>+09683441928</span></h1>
                <h1 className='text-sm font-semibold flex justify-center items-center gap-2'><FaMapMarkedAlt className='size-[18px]'/> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. In, illo!</span></h1>
                <h1 className='text-sm font-semibold flex justify-center items-center gap-2'><MdEmail className='size-[18px]'/> <span>guildcord23@gmail.com</span></h1>
            </div>handleWishlistClick */}

            <nav className='w-full bg-gray-100 flex justify-between items-center gap-1 lg:px-16 px-6 py-5 sticky top-0 z-50'>
                  <h1 className='text-black font-bold lg:text-[30px] text-3x1 italic'>GuildCord</h1>
                    <ul className='lg:flex justify-center items-center gap-10 hidden'>
                      {navItems.map(({link, path })=> (
                        <Link key={path} className='text-black text-sm uppercase font-semibold cursor-pointer px-4 py-2 rounded-lg hover:bg-themegreen hover:text-white' to={path} spy={true} offset={-100} smooth={true}>
                            {link}
                        </Link>
                      ))}
                    </ul>
            
                    <div id='header-icons' className='lg:flex hidden justify-center items-center gap-6 text-black'>
                        <FaSearch className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen'/>
                          <button className="relative group">
                            {user ? (
                            <>
                            <IoPerson className=" relative group w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen" />
                              <div className="absolute top-full right-0 w-25 bg-white rounded-lg mt-1 shadow-md scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200">
                                <div className='w-full bg-black p-1 rounded-t-lg'><a className="block px-2 text-xs rounded text-white">{user.username}</a></div>
                                <div className='pt-2 px-2'><a onClick={handleAccountClick} className="block px-2 py-2 hover:bg-gray-100 rounded text-base">Account</a></div>
                                <div className='pb-2 px-2'><a onClick={logout} className="block px-2 py-2 hover:bg-themeyellow hover:font-semibold rounded text-base">Logout</a></div>
                              </div>
                            </>
                            ) : (
                              <div>
                              <IoPerson className=" relative group w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen" />
                              <div className="absolute top-full right-0 w-25 bg-white rounded-lg mt-1 shadow-md scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200">
                                <div className='pt-2 px-2'><a onClick={handleLoginClick} className="block px-2 py-2 hover:bg-gray-100 rounded text-base">Login</a></div>
                                <div className='pb-2 px-2'><a onClick={handleRegisterClick} className="block px-2 py-2 hover:bg-gray-100 rounded text-base">Register</a></div>
                              </div>
                              </div>
                            )}
                          </button>
                          <FaHeart onClick={handleWishlistClick} className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen'/>
                          <div className='relative'>
                          <FaShoppingCart onClick={handleCartClick} className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen'/>
                            <div onClick={handleCartClick} className='bg-themegreen hover:bg-themeyellow cursor-pointer px-3 py-1 text-white hover:text-black rounded-full absolute -top-[24px] -right-[15px] text-[14px] font-bold'>
                              {totalProducts}
                            </div>
                          </div>
                    </div>
                </nav>
        </>
    )
}

export default Header