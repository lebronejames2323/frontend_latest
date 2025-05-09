import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageUrl1 } from "../api/configuration";
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

                if (excludeProductId) {
                    filteredProducts = filteredProducts.filter(product => 
                        product.id !== excludeProductId
                    );
                }

                const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
                setProducts(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendedProducts();
    }, [excludeProductId, cookies.token]);

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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-[1050px] mx-auto">
                {products.map((product) => (
                    <div 
                        key={product.id} 
                        className="p-3 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-lg cursor-pointer"
                        onClick={() => viewProduct(product.id)}
                    >
                        <div className="relative">
                            <img
                                src={`${imageUrl1}/${product.id}.${product.extension}`}
                                alt={product.name}
                                className="p-4 object-cover w-full h-48 mb-4 rounded-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">{product.category?.name}</p>
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-themegreen">₱{Number(product.price).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecommendedProducts;