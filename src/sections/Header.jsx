import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaRegHeart, FaBars, FaTimes } from 'react-icons/fa'
import { IoPerson } from 'react-icons/io5'
import { Link as ScrollLink } from 'react-scroll'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { index } from '../api/auth';
import { useCookies } from 'react-cookie';
import { AuthContext } from "../contexts/AuthContext";
import { imageUrl } from '../api/configuration';

function Header() {
    const [user, setUser] = useState(null);
    const [cookies] = useCookies();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchError, setSearchError] = useState('');
    const searchDebounceRef = useRef(null);

    const fetchCarts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/carts", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });
            
            if (!response.ok) throw new Error('Failed to fetch cart');

            const res = await response.json();
            const productIds = res.data
                .flatMap(cart => cart.products)
                .map(product => product.id);

            const distinctProductCount = new Set(productIds).size;
            setTotalProducts(distinctProductCount);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        if (cookies.token) {
            fetchCarts();
        }
    }, [cookies.token, fetchCarts]);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSearchError('');
        
        // Clear previous debounce
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        if (query.length > 2) {
            // Debounce search request
            searchDebounceRef.current = setTimeout(async () => {
                setIsSearching(true);
                try {
                    const response = await fetch(`http://localhost:8000/api/products`, {
                        headers: {
                            Authorization: `Bearer ${cookies.token}`,
                        },
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to search products');
                    }

                    const data = await response.json();
                    // Filter products based on search query
                    const filteredProducts = data.data.filter(product => 
                        product.name.toLowerCase().includes(query.toLowerCase()) ||
                        (product.category?.name || '').toLowerCase().includes(query.toLowerCase())
                    );
                    
                    setSearchResults(filteredProducts);
                    setShowSearchResults(true);
                } catch (error) {
                    console.error('Error searching products:', error);
                    setSearchError('Failed to search products. Please try again.');
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            }, 300); // 300ms debounce
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container')) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Clear search when changing routes
    useEffect(() => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleClickProduct = (productId) => {
        setShowSearchResults(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    const handleAccountClick = () => {
        navigate(`/account`);
    };

    const handleCartClick = () => {
        navigate(`/cart`);
    };

    const handleWishlistClick = () => {
        navigate(`/wishlist`);
    };  

    const refreshUsers = useCallback(() => {
        index(cookies.token).then((res) => {
            setUser(res?.data || null);
        });
    }, [cookies.token]);

    useEffect(() => {
        if (cookies.token) {
            refreshUsers();
        }
    }, [cookies.token, refreshUsers]);

    const navItems = [
        { link: 'Home', path: 'hero' },
        { link: 'Category', path: 'category' },
        { link: 'Products', path: 'products' },
        { link: 'Reviews', path: 'reviews' },
        { link: 'Contact', path: 'contact' },
    ];

    return (
        <nav className='sticky top-0 z-50 bg-white shadow-lg'>
            <div className='flex items-center justify-between w-full gap-1 px-4 py-4 lg:px-16'>
                <Link to="/" className='text-black font-bold lg:text-[30px] text-2xl italic'>GuildCord</Link>
                
                {/* Mobile Menu Button */}
                <button 
                    className="p-2 text-gray-600 lg:hidden hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <FaTimes className="w-6 h-6" />
                    ) : (
                        <FaBars className="w-6 h-6" />
                    )}
                </button>

                {/* Desktop Navigation */}
                <ul className='items-center justify-center hidden gap-8 lg:flex'>
                    {navItems.map(({link, path}) => (
                        <ScrollLink 
                            key={path} 
                            className='px-4 py-2 text-sm font-semibold text-gray-700 uppercase transition-all rounded-lg cursor-pointer hover:bg-themegreen hover:text-white' 
                            to={path} 
                            spy={true} 
                            offset={-100} 
                            smooth={true}
                        >
                            {link}
                        </ScrollLink>
                    ))}
                </ul>
        
                {/* Desktop Search and Icons */}
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
                                    <FaSearch className='w-5 h-5 text-gray-400' />
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
                                                        src={`${imageUrl}/${product.id}.${product.extension}`}
                                                        alt={product.name}
                                                        className="object-cover w-12 h-12 rounded-lg"
                                                    />
                                                    <div className="flex-grow">
                                                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <p className="text-sm text-gray-500">{product.category?.name}</p>
                                                            <p className="text-sm font-medium text-themegreen">₱{Number(product.price).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : searchQuery.length > 2 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No products found
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            Type at least 3 characters to search
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {user && (
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <button className="flex items-center gap-2 p-2 text-gray-700 rounded-lg group-hover:bg-gray-50">
                                    <IoPerson className="w-5 h-5" />
                                    <span className="text-sm font-medium capitalize">
                                        {user.profile?.first_name || user.username}
                                    </span>
                                </button>
                                <div className="absolute right-0 invisible mt-1 transition-all duration-200 origin-top scale-95 opacity-0 top-full group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                                    <div className="w-48 overflow-hidden bg-white shadow-lg rounded-xl">
                                        <div className='w-full p-3 bg-gradient-to-r from-themegreen to-themeyellow'>
                                            <p className="text-sm font-medium text-white capitalize">
                                                {user.profile?.first_name} {user.profile?.last_name}
                                            </p>
                                            <p className="text-xs text-white/80 mt-0.5">{user.email}</p>
                                        </div>
                                        <div className='p-2'>
                                            <button onClick={handleAccountClick} className="flex items-center w-full gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                                                <FaUser className="w-4 h-4" />
                                                Account
                                            </button>
                                            <button onClick={logout} className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50">
                                                <FaRegHeart className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleWishlistClick} className="relative p-2 text-gray-700 rounded-lg hover:bg-gray-50">
                                <FaHeart className="w-5 h-5" />
                            </button>

                            <button onClick={handleCartClick} className="relative p-2 text-gray-700 rounded-lg hover:bg-gray-50">
                                <FaShoppingCart className="w-5 h-5" />
                                {totalProducts > 0 && (
                                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 rounded-full bg-themegreen">
                                        {totalProducts}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="px-4 py-3 space-y-3 bg-gray-50">
                        {/* Mobile Search */}
                        <div className="relative search-container">
                            <div className="flex items-center px-4 py-2.5 bg-white rounded-xl">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full text-sm outline-none"
                                />
                                {isSearching ? (
                                    <div className="w-5 h-5 border-2 rounded-full border-themegreen border-t-transparent animate-spin"></div>
                                ) : (
                                    <FaSearch className='w-5 h-5 text-gray-400' />
                                )}
                            </div>
                            
                            {/* Mobile Search Results */}
                            {showSearchResults && (
                                <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden bg-white shadow-xl rounded-xl">
                                    {/* ... Same search results content as desktop ... */}
                                </div>
                            )}
                        </div>

                        {/* Mobile Navigation */}
                        {navItems.map(({link, path}) => (
                            <ScrollLink 
                                key={path} 
                                className='block px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100' 
                                to={path} 
                                spy={true} 
                                offset={-100} 
                                smooth={true}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link}
                            </ScrollLink>
                        ))}

                        {user && (
                            <>
                                <hr className="border-gray-200" />
                                <button onClick={handleAccountClick} className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                                    <FaUser className="w-4 h-4" />
                                    Account
                                </button>
                                <button onClick={handleWishlistClick} className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                                    <FaHeart className="w-4 h-4" />
                                    Wishlist
                                </button>
                                <button onClick={handleCartClick} className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                                    <FaShoppingCart className="w-4 h-4" />
                                    Cart ({totalProducts})
                                </button>
                                <button onClick={logout} className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50">
                                    <FaRegHeart className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Header;