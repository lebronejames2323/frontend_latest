import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { imageUrl } from '../api/configuration';
import { toast } from "react-toastify";

const CartPage = () => {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies();
    const [orderMessage, setOrderMessage] = useState('');

    const fetchCarts = async () => {
        try {
            setLoading(true);
            console.log("Fetching carts with token:", cookies.token);

            const response = await fetch("http://localhost:8000/api/carts", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch carts");
            }

            const res = await response.json();
            console.log("API Response:", res.data);

            setCarts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching carts:", err.message);
            setError(`Error fetching carts: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchCarts();
    }, []);

    const placeOrder = async () => {
        try {

            const products = carts
                .flatMap(cart => cart.products)
                .map(product => ({
                    id: product.id,
                    quantity: product.pivot.quantity,
                }));
    
            console.log("Placing order with products:", products);

            const response = await fetch("http://localhost:8000/api/orders", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ products }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to place order");
            }
    
            const res = await response.json();
            console.log("Order placed successfully:", res);
            toast.success("Order placed successfully:");
    
            setOrderMessage(res.message);

            for (const cart of carts) {
                console.log(`Deleting cart with ID: ${cart.id}`);
                const deleteResponse = await fetch(`http://localhost:8000/api/carts/${cart.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
    
                if (!deleteResponse.ok) {
                    const deleteError = await deleteResponse.json();
                    console.error(`Failed to delete cart with ID ${cart.id}:`, deleteError.message);
                    throw new Error(`Failed to delete cart with ID ${cart.id}`);
                }
            }

            setCarts([]);
            console.log("All carts deleted successfully.");
        } catch (err) {
            console.error("Error placing order or deleting carts:", err.message);
            setOrderMessage(`Error: ${err.message}`);
            toast.error("Your cart is empty");
        }
    };


    const updateProductQuantity = async (cartId, productId, quantity) => {
        const token = cookies.token;
        if (!token) {
            toast.error('User is not authenticated!');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/api/carts/${cartId}/update-product`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                toast.success('Product quantity updated successfully!');
                fetchCarts();
            } else {
                console.error(data.message);
                toast.error('Failed to update product quantity.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while updating the product quantity.');
        }
    };
    
    const deleteProductFromCart = async (cartId, productId) => {
        const token = cookies.token;
        if (!token) {
            toast.error('User is not authenticated!');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/api/carts/${cartId}/delete-product`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: productId }),
            });
    
            const data = await response.json();
            if (response.ok) {
                toast.success('Product deleted successfully!');
                fetchCarts();
            } else {
                console.error(data.message);
                toast.error('Failed to delete product from cart.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting the product.');
        }
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
                    <h1 className="text-xl font-bold text-gray-900">Cart Page</h1>
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

                {carts.length > 0 ? (
                    carts.map(cart => (
                        <div key={cart.id} className="bg-white shadow-sm rounded-lg mb-5 p-5">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cart ID: {cart.id}</h2>
                            <ul>
                                {cart.products.map(product => (
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
                                            <p className="text-sm text-gray-500">Quantity: {product.pivot.quantity}</p>
                                            <p className="text-sm text-gray-500">Total: ₱{(product.price * product.pivot.quantity).toFixed(2)}</p>
                                        </div>
                                        <div className="mt-2 flex items-center justify-center">
                                            <input
                                                id={`quantity-${product.id}`}
                                                type="number"
                                                defaultValue={product.pivot.quantity}
                                                min="1"
                                                className="border rounded-md p-2 w-[60px] text-center"
                                            />
                                            <button
                                                className="bg-themegreen text-white px-4 py-2 rounded-lg ml-2"
                                                onClick={() =>
                                                    updateProductQuantity(cart.id, product.id, document.getElementById(`quantity-${product.id}`).value)
                                                }
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
                                                onClick={() => deleteProductFromCart(cart.id, product.id)}
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
                    <p className="text-center text-gray-600">No carts found for this user.</p>
                )}
            </div>

            <div className="bg-white shadow-sm p-5 mb-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Cart Summary</h2>
                <div className="flex justify-between text-lg font-medium text-gray-800">
                    <span>Total Items:</span>
                    <span>
                        {carts.reduce((total, cart) => 
                        total + cart.products.reduce((subtotal, product) => subtotal + product.pivot.quantity, 0) , 0)}
                    </span>
                </div>
                <div className="flex justify-between text-lg font-medium text-gray-800 mt-2">
                    <span>Total Price:</span>
                    <span>₱{carts.flatMap(cart => cart.products).reduce((total, product) => total + product.price * product.pivot.quantity, 0).toFixed(2)}</span>
                </div>
            </div>

            <div className="w-full bg-white shadow-lg py-4">
                <button 
                    className="w-full bg-themegreen text-white py-3 font-semibold text-lg hover:bg-themeyellow transition-colors"
                    onClick={placeOrder}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default CartPage;
