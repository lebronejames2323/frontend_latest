import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { imageUrl1 } from '../api/configuration';
import { toast } from "react-toastify";
import { fetchWishlists } from '../api/product-fetch';
import { addToCart } from '../api/product-actions';
import { deleteProductFromWishlist } from '../api/product-actions';

const WishlistPage = () => {
    const navigate = useNavigate();
    const [wishlists, setWishlists] = useState([]);
    const [cookies] = useCookies();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    
    const token = cookies.token;
    const isAuthenticated = token && token !== 'undefined' && token.trim() !== '';

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-xl font-medium mb-6">You are not logged in.</p>
                <button
                    className="bg-themegreen hover:bg-themeyellow text-white font-semibold px-6 py-2 rounded-lg"
                    onClick={() => navigate('/')}
                >
                    Go back
                </button>
            </div>
        );
    }

    const handleCartClick = () => {
        navigate(`/cart`);
    };

    const refreshWishlists = () => {
        setLoading(true);
        fetchWishlists(token)
            .then((res) => {
                setWishlists(res?.data || []);
                setLoading(false);
            })
            .catch((error) => {
                toast.error("Error fetching wishlists");
                setLoading(false);
            });
    };

    useEffect(() => {
        refreshWishlists();
    }, [token]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = async (productId, stock) => {
        await addToCart(productId, cookies, setLoading2, stock);
    };

    const handleDeleteWishlist = async (wishlistId, productId) => {
        await deleteProductFromWishlist(wishlistId, productId, cookies, setLoading2, refreshWishlists);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-themegreen border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="justify-items-center">
                <div className="w-full max-w-[1040px] p-4 sm:p-5 mx-auto">
                    <div className="w-full h-[70px] sm:h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
                        <div className="w-full h-full px-4 sm:px-10 flex items-center justify-between">
                            <button 
                                onClick={() => navigate('/')}
                                className="flex items-center gap-1 text-themegreen hover:text-themeyellow"
                            >
                                <FaArrowLeft className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                                <span className="text-sm sm:text-base font-semibold">Back</span>
                            </button>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">My Wishlist</h1>
                            <button onClick={handleCartClick} className="flex items-center gap-1 text-themegreen hover:text-themeyellow">
                                <h1 className="text-sm sm:text-base font-semibold">Cart</h1>
                                <FaShoppingCart className="w-5 h-5 sm:w-[22px] sm:h-[22px]"/>
                            </button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 pt-[80px] sm:pt-[100px] flex-grow overflow-auto">
                        {wishlists.length > 0 ? (
                            wishlists.map(wishlist => (
                                <div key={wishlist.id} className="bg-white shadow-sm hover:shadow-md cursor-pointer rounded-lg mb-4 sm:mb-5 p-4 sm:p-5">
                                    {(wishlist.products || []).map(product => (
                                        <div key={product.id} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                            <div 
                                                onClick={() => handleProductClick(product.id)} 
                                                className="w-[140px] h-[140px] sm:w-[190px] sm:h-[170px]"
                                            >
                                                <img
                                                    src={`${imageUrl1}/${product.id}.${product.extension}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </div>
                                            
                                            <div onClick={() => handleProductClick(product.id)} className="flex-grow text-center sm:text-left">
                                                <h3 className="text-base sm:text-xl font-semibold">{product.name}</h3>
                                                <p className="text-sm sm:text-lg font-semibold text-themegreen">
                                                    Price: ₱{Number(product.price).toLocaleString()}
                                                </p>
                                                <h3 className={`text-xs sm:text-sm font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                    {product.stock === 0 ? 'Out of Stock' : `(${product.stock} ${product.stock === 1 ? 'stock' : 'stocks'} left)`}
                                                </h3>
                                            </div>

                                            <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                                                <button
                                                    className={`w-full sm:w-auto bg-themegreen hover:bg-themeyellow hover:text-black text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    disabled={loading2}
                                                    onClick={() => handleAddToCart(product.id, product.stock)}
                                                >
                                                    Add to Cart
                                                </button>
                                                <button
                                                    className={`w-full sm:w-auto hover:bg-opacity-70 bg-themered text-white px-3 sm:px-4 py-2 rounded-lg transition ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    disabled={loading2}
                                                    onClick={() => handleDeleteWishlist(wishlist.id, product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center min-h-[50vh]">
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Your Wishlist is Empty</h2>
                                <p className="text-sm sm:text-gray-600 mt-2">Start adding products to keep track of what you love!</p>
                                <button 
                                    onClick={() => navigate('/')} 
                                    className="mt-4 sm:mt-5 px-4 sm:px-6 py-2 sm:py-3 bg-themegreen text-white rounded-lg hover:bg-themeyellow hover:text-black transition-all transform hover:scale-105"
                                >
                                    Explore Products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default WishlistPage;
