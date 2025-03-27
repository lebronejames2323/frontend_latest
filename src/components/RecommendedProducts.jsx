import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { imageUrl } from "../api/configuration";
import { useCookies } from "react-cookie";

function RecommendedProducts({ excludeProductId = null }) {
    const [products, setProducts] = useState([]);
    const [cookies] = useCookies();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/products', {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations');
                }

                const data = await response.json();
                let filteredProducts = data.data;

                // Exclude current product if provided
                if (excludeProductId) {
                    filteredProducts = filteredProducts.filter(product => 
                        product.id !== excludeProductId
                    );
                }

                // Randomly select up to 4 products
                const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
                setProducts(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendedProducts();
    }, [excludeProductId, cookies.token]);

    const addToCart = async (productId) => {
        try {
            const response = await fetch('http://localhost:8000/api/carts', {
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
                alert('Product added to cart successfully!');
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            alert('Error adding to cart');
            console.error('Error:', error);
        }
    };

    const addToWishlist = async (productId) => {
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

    const viewProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="py-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                You May Also Like
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <div 
                        key={product.id} 
                        className="p-4 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
                        role="article"
                    >
                        <div className="relative">
                            <img
                                src={`${imageUrl}/${product.id}.${product.extension}`}
                                alt={product.name}
                                className="object-cover w-full h-48 mb-4 rounded-lg"
                                onClick={() => viewProduct(product.id)}
                            />
                            <div 
                                className="absolute inset-0 transition-opacity rounded-lg opacity-0 bg-black/50 hover:opacity-100"
                                role="group"
                                aria-label="Product actions"
                            >
                                <div className="flex items-center justify-center h-full gap-2">
                                    <button 
                                        onClick={() => viewProduct(product.id)}
                                        className="p-2 transition-colors bg-white rounded-full hover:bg-themegreen hover:text-white"
                                        aria-label="View product details"
                                    >
                                        <MdOutlineRemoveRedEye className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => addToWishlist(product.id)}
                                        className="p-2 transition-colors bg-white rounded-full hover:bg-themegreen hover:text-white"
                                        aria-label="Add to wishlist"
                                    >
                                        <FaRegHeart className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => addToCart(product.id)}
                                        className="p-2 transition-colors bg-white rounded-full hover:bg-themegreen hover:text-white"
                                        aria-label="Add to cart"
                                    >
                                        <MdAddShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">{product.category?.name}</p>
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-themegreen">₱{Number(product.price).toFixed(2)}</p>
                                <div 
                                    className="flex text-yellow-400" 
                                    role="img" 
                                    aria-label="5 out of 5 stars"
                                >
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecommendedProducts;