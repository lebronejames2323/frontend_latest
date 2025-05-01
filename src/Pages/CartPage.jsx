import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { imageUrl1 } from '../api/configuration';
import { fetchCarts } from '../api/product-fetch';
import { deleteProductFromCart, placeOrder, updateProductQuantity } from '../api/product-actions';
import OrderReceipt from '../components/OrderReceipt';

const CartPage = () => {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [cookies] = useCookies();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

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

    const refreshCarts = () => {
        setLoading(true);
        fetchCarts(cookies.token).then((res) => {
        setCarts(res?.data);
        setLoading(false);
        })
      };
    
    useEffect(refreshCarts, []);

    const closeReceipt = () => {
        setShowReceipt(false);
    };

    const handlePlaceOrder = async () => {
        await placeOrder(carts, cookies, setLoading2, setLastOrder, setCarts, setShowReceipt);
    };
    
    const handleUpdateQuantity = async (cartId, productId, newQuantity) => {
        await updateProductQuantity(cartId, productId, newQuantity, cookies, refreshCarts);
    };
    
    
    const handleDeleteCart = async (cartId, productId) => {
        await deleteProductFromCart(cartId, productId, cookies, setLoading2, refreshCarts);
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
                    <FaArrowLeft className='mr-1 w-[20px] h-[20px]' />
                    <span className="text-base font-semibold">Back</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Cart Page</h1>
                <div className="w-[105px]"></div>
                </div>
            </div>

            <div className="container px-4 pt-24 pb-12 mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-[1fr,400px] gap-6">
                    <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                        <div className="px-6 pt-6 pb-2">
                            <div className="divide-y">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">Cart Items</h2>
                            {carts.length > 0 ? (
                                carts.map(cart => (
                                    <div key={cart.id}>
                                        {cart.products.map(product => (
                                            <div key={product.id} className="flex items-center gap-4 py-4">
                                                <div className="w-[10%] h-[10%] mr-4">
                                                    <img
                                                        src={`${imageUrl1}/${product.id}.${product.extension}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                                                    <p className="text-sm text-gray-400">₱{Number(product.price).toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center justify-center gap-4">
                                                    <div className="flex items-center border rounded-lg">
                                                        <button 
                                                            className="p-2 hover:bg-gray-100"
                                                            onClick={() => handleUpdateQuantity(cart.id, product.id, Math.max(1, product.pivot.quantity - 1))}
                                                        >
                                                            <FaMinus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-12 text-center">{product.pivot.quantity}</span>
                                                        <button 
                                                            className="p-2 hover:bg-gray-100"
                                                            onClick={() => handleUpdateQuantity(cart.id, product.id, product.pivot.quantity + 1)}
                                                        >
                                                            <FaPlus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="p-2 text-themered rounded-lg hover:text-opacity-50"
                                                        onClick={() => handleDeleteCart(cart.id, product.id)}
                                                    >
                                                        <FaTrashAlt className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                            <div className="py-12 text-center">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
                            <p className="mb-6 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
                            <button onClick={() => navigate('/')} className="px-4 py-2 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black">
                                Continue Shopping
                            </button>
                            </div>
                            )}
                            </div>
                        </div>
                    </div>
            

                    <div className="space-y-6">
                        <div className="sticky bg-white shadow-sm rounded-xl h-fit top-24">
                            <div className="p-6">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Total Items:</span>
                                        <span>{carts.reduce((total, cart) => 
                                        total + cart.products.reduce((subtotal, product) => subtotal + product.pivot.quantity, 0) , 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-themegreen">₱{carts.flatMap(cart => cart.products).reduce((total, product) => total + product.price * product.pivot.quantity, 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handlePlaceOrder}
                                        disabled={loading2}
                                        className="w-full text-lg py-3 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading2 ? "Processing..." : "Place order"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {showReceipt && lastOrder && (
                <OrderReceipt order={lastOrder} onClose={closeReceipt} />
            )}

        </div>
    );
};

export default CartPage;