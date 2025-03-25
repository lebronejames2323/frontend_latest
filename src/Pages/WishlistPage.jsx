import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import withAuth from "../high-order-component/withAuth";
import { useCookies } from 'react-cookie';
import { imageUrl } from '../api/configuration';

const WishlistPage = () => {
    const navigate = useNavigate();
    const [wishlists, setWishlists] = useState([]);
    const [error, setError] = useState(null);
    const [cookies] = useCookies();

    const fetchWhislists = async () => {
        try {
            console.log("Fetching wishlists with token:", cookies.token);

            const response = await fetch("http://localhost:8000/api/wishlists", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch wishlists");
            }

            const res = await response.json();
            console.log("API Response:", res.data);

            setWishlists(res.data);
        } catch (err) {
            console.error("Error fetching wishlists:", err.message);
            setError(`Error fetching wishlists: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchWhislists();
    }, []);


    

    
    const deleteProductFromWishlist = async (wishlistId, productId) => {
        const token = cookies.token;
        if (!token) {
            alert('User is not authenticated!');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/api/wishlists/${wishlistId}/delete-product`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: productId }),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Product deleted successfully!');
                fetchWhislists();
            } else {
                console.error(data.message);
                alert('Failed to delete product from wishlist.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting the product.');
        }
    };
    


    return (
        <div className="min-h-screen bg-gray-50">

            <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
                <div className="w-full h-full lg:px-10 px-5 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center text-themegreen hover:text-themeyellow transition-colors"
                    >
                        <FaArrowLeft className='mr-2 w-[20px] h-[20px]' />
                        <span className="text-base font-semibold">Home</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Wishlist Page</h1>
                    <div></div>
                </div>
            </div>

            <div className="p-5 pt-[100px] flex-grow overflow-auto">
                {error && (
                    <div className="bg-red-100 text-red-700 px-5 py-3 mb-5 rounded-md">
                        <h2 className="text-lg font-semibold">Error</h2>
                        <p>{error}</p>
                    </div>
                )}

                {wishlists.length > 0 ? (
                    wishlists.map(wishlist => (
                        <div key={wishlist.id} className="bg-white shadow-sm rounded-lg mb-5 p-5">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Wishlist ID: {wishlist.id}</h2>
                            <ul>
                                {wishlist.products.map(product => (
                                    <li key={product.id} className="flex items-center mb-4 border-b pb-4">
                                        <div className="w-[60px] h-[60px] mr-4">
                                            <img
                                                src={`${imageUrl}/${product.id}.${product.extension}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                                            <p className="text-sm text-gray-500">Price: ₱{product.price}</p>
                                        </div>
                                        <div className="mt-2 flex items-center justify-center">
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
                                                onClick={() => deleteProductFromWishlist(wishlist.id, product.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No wishlists found for this user.</p>
                )}
            </div>
        </div>
    );
};

export default withAuth(WishlistPage);
