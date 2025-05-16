import React, { useEffect, useState, useRef} from 'react'
import { FaSearch, FaHeart, FaShoppingCart, FaBars } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5'
import { Link as ScrollLink } from 'react-scroll'
import { useNavigate, useLocation } from 'react-router-dom'
import { index, logout as Logout } from '../api/auth';
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";
import { imageUrl1 } from '../api/configuration';
import { getProducts } from "../api/product-fetch";

function Header() {

    const [user, setUser] = useState(null);
    const [cookies, removeCookie] = useCookies();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchError, setSearchError] = useState('');
    const searchDebounceRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const logout = () => {
        Logout(cookies.token).then((res) => {
        removeCookie("token");
        setUser(null);
        navigate(`/login`);
        toast.success('User logged out!');
      });
    };

    const refreshUsers = () => {
    const token = cookies.token
        if (!token || token === 'undefined' || token.trim() === '') {
            return;
        }
        index(cookies.token).then((res) => {
        setUser(res?.data || null);
        });
    };

    useEffect(refreshUsers, []);


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
    const handleAdminClick = () => {
    navigate(`/add-product`);
    };        


    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSearchError('');
      
        if (searchDebounceRef.current) {
          clearTimeout(searchDebounceRef.current);
        }
      
        if (query.length > 1) {
          searchDebounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
            const response = await getProducts();
    
            const filteredProducts = response?.data.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            (product.category?.name || '').toLowerCase().includes(query.toLowerCase())
            );
    
            setSearchResults(filteredProducts);
            setShowSearchResults(true);
            }catch(error) {
                console.error('Error searching products:', error.message);
                setSearchError('Failed to search products. Please try again.');
                setSearchResults([]);
            }finally{
                setIsSearching(false);
            }
          }, 300);
        }else{
          setSearchResults([]);
          setShowSearchResults(false);
        }
      };      


    useEffect(() => {
    const handleClickOutside = (event) => {
        if (!event.target.closest('.search-container')) {
            setShowSearchResults(false);
            setIsSearchFocused(false);
        }
    };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    useEffect(() => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
    }, [location.pathname]);

    const handleClickProduct = (productId) => {
        setShowSearchResults(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    return (
        <>
        <nav className='w-full flex justify-between items-center gap-4 lg:px-16 px-4 py-5 sticky top-0 z-50 shadow-lg'>
            <h1 className='text-black font-bold lg:text-[30px] text-3xl italic cursor-pointer hidden lg:block'>CyberDrive</h1>
            <ul className='lg:flex justify-center items-center gap-10 hidden'>
                {['Home', 'Category', 'Featured', 'Contact'].map((item, index) => (
                    <li key={index}>
                        <ScrollLink
                            to={item.toLowerCase()}
                            spy={true}
                            smooth={true}
                            offset={-100}
                            className="text-black text-sm uppercase font-semibold px-3 py-2 rounded-lg hover:bg-themegreen hover:text-white cursor-pointer"
                        >
                            {item}
                        </ScrollLink>
                    </li>
                ))}
                <li>
                    <a
                        href="/all-products"
                        className="text-black text-sm uppercase font-semibold px-3 py-2 rounded-lg hover:bg-themegreen hover:text-white"
                    >
                        Products
                    </a>
                </li>
            </ul>

    
            <div id='header-icons' className='lg:flex hidden justify-center items-center gap-6 text-black'>
                <div className='relative items-center justify-center hidden gap-8 lg:flex'>
                <div className="relative search-container">
                    <div className={`relative transition-all duration-200 ${isSearchFocused ? 'w-[400px]' : 'w-[250px]'}`}>
                        <div className={`flex items-center px-4 py-2.5 bg-gray-50 rounded-xl transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-themegreen' : 'hover:bg-gray-100'}`}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearch}
                                onFocus={() => setIsSearchFocused(true)}
                                className="w-full text-sm bg-transparent outline-none"
                            />
                            {isSearching ? (
                                <div className="w-5 h-5 border-2 rounded-full border-themegreen border-t-transparent animate-spin"></div>
                            ) : (
                                <FaSearch className='w-5 h-5' />
                            )}
                        </div>
                        
                        {showSearchResults && (
                            <div className="absolute left-0 right-0 mt-2 overflow-hidden bg-white shadow-xl rounded-xl">
                                {searchError ? (
                                    <div className="p-4 text-center text-red-500">
                                        {searchError}
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {searchResults.map(product => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 p-3 transition-colors border-b cursor-pointer hover:bg-gray-50"
                                                onClick={() => handleClickProduct(product.id)}
                                            >
                                                <img 
                                                    src={`${imageUrl1}/${product.id}.${product.extension}`}
                                                    alt={product.name}
                                                    className="object-cover w-12 h-12 rounded-lg"
                                                />
                                                <div className="flex-grow">
                                                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-sm text-gray-500">{product.category?.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : searchQuery.length > 1 ? (
                                  <div className="p-4 text-center text-gray-500">
                                      No products found
                                  </div>
                              ) : (
                                  <div className="p-4 text-center text-gray-500">
                                      Type at least 2 characters to search
                                  </div>
                              )}
                            </div>
                        )}
                    </div>
                </div>
                </div>

                <button className="relative group">
                {user ? (
                <>
                <div>
                  <IoPerson className="w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen" />
                </div>
                <div className="absolute top-full right-0 w-25 bg-white rounded-lg mt-1 shadow-md scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200">
                <div className='w-full p-3 bg-gradient-to-r bg-themegreen2  rounded-t-lg'>
                    <p className="text-sm font-medium text-white capitalize">{user.username}</p>
                </div>
                  {user.username.toLowerCase()  === "admin" && (
                    <div className="pt-2 px-2"><a onClick={handleAdminClick} className="block px-2 py-2 hover:bg-gray-100 rounded text-sm">AdminPage</a></div>
                  )}
                  <div className='pt-2 px-2'><a onClick={handleAccountClick} className="block px-2 py-2 hover:bg-gray-100 rounded text-sm">Account</a></div>
                  <div className='pb-2 px-2'><a onClick={logout} className="block px-2 py-2 hover:bg-themeyellow hover:font-semibold rounded text-sm">Logout</a></div>
                </div>
                </>
                ) : (
                  <div>
                  <IoPerson className=" relative group w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen" />
                    <div className="absolute top-full right-0 w-25 bg-white rounded-lg mt-1 shadow-md scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200">
                      <div className='pt-2 px-2'><a onClick={handleLoginClick} className="block px-2 py-2 hover:bg-gray-100 rounded text-sm">Login</a></div>
                      <div className='pb-2 px-2'><a onClick={handleRegisterClick} className="block px-2 py-2 hover:bg-gray-100 rounded text-sm">Register</a></div>
                    </div>
                  </div>
                )}
                </button>
              <FaHeart onClick={handleWishlistClick} className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen'/>
              <FaShoppingCart onClick={handleCartClick} className='w-[20px] h-[20px] transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:text-themegreen'/>
            </div>


            <div className="mobile-search-container w-full lg:hidden relative">
                <div className="relative flex items-center border-2 border-themegreen rounded-lg p-2 bg-white w-full">
                    <FaSearch className="absolute left-3 text-black" />

                    <input 
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 bg-white text-black rounded-b-lg text-sm outline-none"
                    />
                </div>

                {showSearchResults && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-lg shadow-md">
                    {searchError ? (
                        <div className="p-4 text-center text-red-500">{searchError}</div>
                    ) : searchResults.length > 0 ? (
                        <div className="max-h-[250px] overflow-y-auto w-full">
                            {searchResults.map(product => (
                                <div 
                                    onClick={() => handleClickProduct(product.id)} 
                                    key={product.id} 
                                    className="flex items-center gap-2 px-2 py-2 border-b cursor-pointer hover:bg-gray-50"
                                >
                                    <img src={`${imageUrl1}/${product.id}.${product.extension}`} alt={product.name} className="w-12 h-12 rounded-lg"/>
                                    <div className="flex-grow">
                                        <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                                        <p className="text-xs text-gray-500">{product.category?.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-2 text-center text-gray-500 text-sm">No products found</div>
                    )}
                </div>
                )}
            </div>

            <div className='lg:hidden flex justify-center items-center' onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes className='text-themegreen text-3xl cursor-pointer' /> : <FaBars className='text-themegreen text-3xl cursor-pointer' />}
            </div>

            <div className={`${isMenuOpen ? 'flex' : 'hidden'} w-full bg-themegreen2 p-4 absolute top-[80px] left-0`}>
                <ul className='flex flex-col justify-center items-center gap-2 w-full'>
                    <li className='w-full text-center'>
                        <a href="/all-products" className="text-white uppercase font-semibold p-3 rounded-lg hover:bg-themeyellow hover:text-black w-full block">
                            All Products
                        </a>
                    </li>
                    {['Products'].map((item, index) => (
                        <ScrollLink key={index} className='text-white uppercase font-semibold p-3 rounded-lg hover:bg-themeyellow hover:text-black w-full text-center' to={item.toLowerCase()} spy={true} offset={-100} smooth={true}>
                            {item}
                        </ScrollLink>
                    ))}
                    {user ? (
                        <>
                            {user.username.toLowerCase() === "admin" && (
                                <li className='w-full text-center'>
                                    <a onClick={handleAdminClick} className="text-white uppercase font-semibold p-3 rounded-lg hover:bg-themeyellow hover:text-black w-full block">
                                        Admin Page
                                    </a>
                                </li>
                            )}
                            <li className='w-full text-center'>
                                <a onClick={handleAccountClick} className="text-white uppercase font-semibold p-3 rounded-lg hover:bg-themeyellow hover:text-black w-full block">
                                    Account
                                </a>
                            </li>
                            <li className='w-full text-center'>
                                <a onClick={logout} className="text-white uppercase font-semibold p-3 rounded-lg hover:bg-themeyellow hover:text-black w-full block">
                                    Logout
                                </a>
                            </li>
                        </>
                    ) : (
                        <li className='w-full text-center'>
                            <a onClick={handleLoginClick} className="text-white uppercase font-semibold p-3 rounded-lg hover:bg-themeyellow hover:text-black w-full block">
                                Login
                            </a>
                        </li>
                    )}
                    <li className='w-full text-center'>
                        <a onClick={handleWishlistClick} className="text-white uppercase font-semibold p-3 rounded-lg hover:bg-themeyellow hover:text-black w-full block">
                            Wishlist
                        </a>
                    </li>
                    <li className='w-full text-center'>
                        <a onClick={handleCartClick} className="text-white uppercase font-semibold p-3 rounded-lg hover:bg-themeyellow hover:text-black w-full block">
                            Cart
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        </>
    )
}

export default Header