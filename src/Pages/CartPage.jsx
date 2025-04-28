import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { imageUrl1 } from '../api/configuration';
import { toast } from "react-toastify";
import { fetchCarts } from '../api/product';
import OrderReceipt from '../components/OrderReceipt';

const CartPage = () => {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [cookies] = useCookies();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

    const refreshCarts = () => {
        setLoading(true);
        fetchCarts(cookies.token).then((res) => {
        setCarts(res?.data);
        setLoading(false);
        })
      };
    
    useEffect(refreshCarts, []);


    const placeOrder = async () => {
        try {
        setLoading2(true);
        const products = carts
        .flatMap(cart => cart.products)
        .map(product => ({
        id: product.id,
        quantity: product.pivot.quantity,
        }));

        console.log("Placing order with products:", products);

        const response = await fetch("http://localhost:8000/api/orders",{
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
        setLastOrder(res.data);
        toast.success("Order placed successfully:");

        for (const cart of carts) {
        console.log(`Deleting cart with ID: ${cart.id}`);
        const deleteResponse = await fetch(`http://localhost:8000/api/carts/${cart.id}`,{
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
        }catch (err){
        console.error("Error placing order or deleting carts:", err.message);
        toast.error("Your cart is empty");
        }finally{
        setLoading2(false);
        setShowReceipt(true);
        }
    };

    const closeReceipt = () => {
        setShowReceipt(false);
    };


    const updateProductQuantity = async (cartId, productId, quantity) => {    
        try {
        const response = await fetch(`http://localhost:8000/api/carts/${cartId}/update-product`,{
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
        }),
        });

        const data = await response.json();
        if (response.ok){
        refreshCarts();
        }else{
        console.error(data.message);
        toast.error('Failed to update product quantity.');
        }
        }catch (error){
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
    
        try{
        const response = await fetch(`http://localhost:8000/api/carts/${cartId}/delete-product`,{
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
        });

        const data = await response.json();
        if(response.ok){
        toast.success('Product deleted successfully!');
        refreshCarts();
        }else{
        console.error(data.message);
        toast.error('Failed to delete product from cart.');
        }
        }catch (error){
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
                                                            onClick={() => updateProductQuantity(cart.id, product.id, Math.max(1, product.pivot.quantity - 1))}
                                                        >
                                                            <FaMinus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-12 text-center">{product.pivot.quantity}</span>
                                                        <button 
                                                            className="p-2 hover:bg-gray-100"
                                                            onClick={() => updateProductQuantity(cart.id, product.id, product.pivot.quantity + 1)}
                                                        >
                                                            <FaPlus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="p-2 text-themered rounded-lg hover:text-opacity-50"
                                                        onClick={() => deleteProductFromCart(cart.id, product.id)}
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
                                        onClick={placeOrder}
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