import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import withAuth from "../high-order-component/withAuth";
import { useCookies } from 'react-cookie';
import { imageUrl } from '../api/configuration';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import { BiSupport } from 'react-icons/bi';
import { RiSecurePaymentLine } from 'react-icons/ri';
import RecommendedProducts from '../components/RecommendedProducts';

const ProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [cookies] = useCookies();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }

                const data = await response.json();
                setProduct(data.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, cookies.token]);

    const addToCart = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.token}`,
                },
                body: JSON.stringify({
                    products: [{ id: productId, quantity }],
                }),
            });

            if (response.ok) {
                alert('Product added to cart successfully!');
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            alert('Error adding to cart');
            console.error('Error:', error);
        }
    };

    const addToWishlist = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/wishlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.token}`,
                },
                body: JSON.stringify({
                    products: [{ id: productId, quantity: 1 }],
                }),
            });

            if (response.ok) {
                alert('Product added to wishlist successfully!');
            } else {
                throw new Error('Failed to add to wishlist');
            }
        } catch (error) {
            alert('Error adding to wishlist');
            console.error('Error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Elegant Header */}
            <div className="w-full h-[80px] bg-white shadow-sm fixed top-0 left-0 z-50">
                <div className="flex items-center w-full h-full px-5 mx-auto lg:px-10 max-w-7xl">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-700 transition-colors hover:text-themegreen"
                    >
                        <FaArrowLeft className='w-5 h-5 mr-2'/>
                        <span className='text-base font-medium'>Back</span>
                    </button>
                    <h1 className="flex-grow text-xl font-semibold text-center text-gray-900">Product Details</h1>
                    <div className="w-[100px]"></div>
                </div>
            </div>

            {!product ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-4 rounded-full border-themegreen border-t-transparent animate-spin"></div>
                </div>
            ) : (
                <div className="container px-4 pb-12 mx-auto pt-28 max-w-7xl">
                    <div className="overflow-hidden bg-white shadow-sm rounded-2xl">
                        <div className="grid gap-0 md:grid-cols-2">
                            {/* Product Image Section */}
                            <div className="flex items-center justify-center p-8 bg-gray-50">
                                <div className="relative w-full max-w-lg aspect-square">
                                    <img
                                        src={`${imageUrl}/${product.id}.${product.extension}`}
                                        alt={product.name}
                                        className="object-contain w-full h-full rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Product Info Section */}
                            <div className="p-8 lg:p-12">
                                <div className="space-y-6">
                                    <div>
                                        <p className="mb-2 font-medium text-themegreen">{product.category?.name}</p>
                                        <h1 className="mb-4 text-3xl font-bold text-gray-900">{product.name}</h1>
                                        <div className="flex items-center gap-4">
                                            <div className="flex">
                                                {[...Array(5)].map((_, index) => (
                                                    <FaStar key={index} className="w-5 h-5 text-themeyellow" />
                                                ))}
                                            </div>
                                            <span className="text-gray-500">(5.0)</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t">
                                        <p className="text-4xl font-bold text-gray-900">₱{Number(product.price).toFixed(2)}</p>
                                        <p className="mt-2 text-sm text-gray-500">Inclusive of all taxes</p>
                                    </div>

                                    <div className="prose-sm prose text-gray-600">
                                        <p>{product.description || 'No description available'}</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                                            <MdLocalShipping className="w-6 h-6 mb-2 text-themegreen" />
                                            <p className="text-xs font-medium text-center">Free Shipping</p>
                                        </div>
                                        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                                            <BiSupport className="w-6 h-6 mb-2 text-themegreen" />
                                            <p className="text-xs font-medium text-center">24/7 Support</p>
                                        </div>
                                        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                                            <RiSecurePaymentLine className="w-6 h-6 mb-2 text-themegreen" />
                                            <p className="text-xs font-medium text-center">Secure Payment</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border-2 rounded-lg">
                                            <button 
                                                className="flex items-center justify-center w-12 h-12 text-lg hover:bg-gray-50"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            >
                                                -
                                            </button>
                                            <span className="flex items-center justify-center w-12 h-12 font-medium border-x-2">
                                                {quantity}
                                            </span>
                                            <button 
                                                className="flex items-center justify-center w-12 h-12 text-lg hover:bg-gray-50"
                                                onClick={() => setQuantity(quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            onClick={addToWishlist}
                                            className="flex items-center justify-center w-12 h-12 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            <FaRegHeart className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={addToCart}
                                        className="flex items-center justify-center w-full h-12 gap-2 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black"
                                    >
                                        <MdAddShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <RecommendedProducts 
                            categoryName={product.category?.name} 
                            excludeProductId={parseInt(productId)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAuth(ProductPage);