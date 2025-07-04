import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { imageUrl1 } from '../api/configuration';
import { fetchCarts } from '../api/product-fetch';
import { deleteProductFromCart, updateProductQuantity } from '../api/product-actions';
import { index } from '../api/auth';
import { toast } from 'react-toastify';

const CartPage = () => {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [cookies, setCookie] = useCookies(["guestCart"]);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [user, setUser] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);


    const token = cookies.token;
    const isAuthenticated = token && token !== 'undefined' && token.trim() !== '';

    const refreshUsers = () => {
        if (!token || token === 'undefined' || token.trim() === '') {
            return;
        }
        index(cookies.token).then((res) => {
        setUser(res?.data || null);
        });
    };

    useEffect(refreshUsers, []);
  
    const refreshCarts = async () => {
        setLoading(true);
        const res = await fetchCarts(cookies);
        console.log(res)

        if (!isAuthenticated) {
        setCarts(
            Object.entries(res.guestCart || {}).map(([key, data]) => ({
            id: key,
            ...data,
            }))
        );
        } else {
        setCarts(res?.data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        refreshCarts();
    }, []);



    const handleDeleteFromCookies = (cartKey) => {
        console.log("Deleting product:", cartKey);
        let guestCart = { ...cookies.guestCart };
        delete guestCart[cartKey];

        setCookie("guestCart", guestCart, {
            path: "/",
            expires: new Date(Date.now() + 86400000),
        });

        setCarts(
            Object.entries(guestCart).map(([key, data]) => ({
            id: key,
            ...data,
            }))
        );
    };

    const handleUpdateQuantityInCookies = (cartKey, newQuantity) => {
        if (newQuantity < 1) return;

        let guestCart = { ...cookies.guestCart };

        if (guestCart[cartKey]) {
            guestCart[cartKey].quantity = Math.min(newQuantity, guestCart[cartKey].stock);
        }

        setCookie("guestCart", guestCart, {
            path: "/",
            expires: new Date(Date.now() + 86400000),
        });

        setCarts(
            Object.entries(guestCart).map(([key, data]) => ({
            id: key,
            ...data,
            }))
        );
    };


    const handleCheckoutOrder = async () => {
        if (carts.length > 0) {
            setShowConfirm(true);
        }else{
            toast.error("You dont have products in your cart.");
        }
    };
    
    const handleUpdateQuantity = async (cartId, productId, variationId, newQuantity) => {
        if (typeof newQuantity !== "number" || newQuantity < 1) {
            toast.error("Invalid quantity.");
            return;
        }
        console.log("Product ID:", productId, "New Quantity:", newQuantity);

        await updateProductQuantity(cartId, productId, variationId, newQuantity, cookies, refreshCarts);
    };
    
    
    const handleDeleteCart = async (cartId, productId, variationId,) => {
        await deleteProductFromCart(cartId, productId, variationId, cookies, setLoading2, refreshCarts);
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

            <div className="w-full h-[70px] sm:h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
                <div className="w-full h-full px-4 sm:px-10 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-themegreen hover:text-themeyellow"
                    >
                        <FaArrowLeft className='w-5 h-5 sm:w-[20px] sm:h-[20px]' />
                        <span className="text-sm sm:text-base font-semibold">Back</span>
                    </button>
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Cart Page</h1>
                    <div className="w-[105px]"></div>
                </div>
            </div>

            <div className="container px-4 pt-20 sm:pt-24 pb-12 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
                    <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
                            <div className="divide-y">
                                <h2 className="mb-4 text-lg sm:text-xl font-bold text-gray-900">Cart Items</h2>
                                {carts.length > 0 ? (
                                    isAuthenticated
                                        ? carts.map(cart => (
                                            <div key={cart.id}>
                                                {cart.products.map(product => {
                                                    const uniqueKey = `${product.id}-${product.pivot.variation_id ?? 'no-variation'}`;

                                                    const selectedVariation = product.variations.find(v => v.id === product.pivot.variation_id);

                                                    return (
                                                    <div key={uniqueKey} className="flex items-center gap-4 py-4 border-t">
                                                        <div className="w-[120px] h-[120px] sm:w-[10%] sm:h-[10%]">
                                                            <img
                                                                src={`${imageUrl1}/${product.id}.${product.extension}`}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                        </div>

                                                        <div className="flex-grow text-center sm:text-left">
                                                            <h3 className="text-sm sm:text-lg font-medium text-gray-800">{selectedVariation?.variation_name || product.name}</h3>
                                                            <p className="text-xs sm:text-sm text-gray-400">
                                                                ₱{selectedVariation 
                                                                    ? Number(selectedVariation.variation_price).toLocaleString() 
                                                                    : Number(product.price).toLocaleString()}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-center gap-2 sm:gap-4">
                                                            <div className="flex items-center border rounded-lg">
                                                                <button 
                                                                    className="p-2 hover:bg-gray-100"
                                                                    onClick={() => handleUpdateQuantity(cart.id, product.id, product.pivot.variation_id, Math.max(1, product.pivot.quantity - 1))}
                                                                >
                                                                    <FaMinus className="w-3 h-3" />
                                                                </button>
                                                                <span className="w-8 sm:w-12 text-center">{product.pivot.quantity}</span>
                                                                <button 
                                                                    className={`p-2 hover:bg-gray-100 ${product.pivot.quantity >= (selectedVariation?.variation_stock ?? product.stock) ? "cursor-not-allowed" : ""}`}
                                                                    onClick={() => {
                                                                        if (product.pivot.quantity < (selectedVariation?.variation_stock ?? product.stock)) {
                                                                            handleUpdateQuantity(cart.id, product.id, product.pivot.variation_id, product.pivot.quantity + 1);
                                                                        }
                                                                    }}
                                                                    disabled={product.pivot.quantity >= product.stock}
                                                                >
                                                                    <FaPlus className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                className="p-2 text-themered rounded-lg hover:text-opacity-50"
                                                                onClick={() => handleDeleteCart(cart.id, product.id, product.pivot?.variation_id ?? null)}
                                                            >
                                                                <FaTrashAlt className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    );
                                                })}
                                            </div>
                                        ))
                                        : Object.entries(cookies.guestCart || {}).map(([key, product]) => {
                                        const [productId, variationId] = key.split("_");

                                        return (
                                            <div key={key} className="flex items-center gap-4 py-4 border-t">
                                            <div className="w-[120px] h-[120px] sm:w-[10%] sm:h-[10%]">
                                                <img
                                                src={`${imageUrl1}/${productId}.${product.extension}`}
                                                alt="Product Image"
                                                />
                                            </div>

                                            <div className="flex-grow text-center sm:text-left">
                                                <h3 className="text-sm sm:text-lg font-medium text-gray-800">
                                                {product.variation_name || product.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-400">
                                                ₱{Number(product.variation_price ?? product.price).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                className="p-2 hover:bg-gray-100"
                                                onClick={() => handleUpdateQuantityInCookies(key, product.quantity - 1)}
                                                >
                                                <FaMinus className="w-3 h-3" />
                                                </button>

                                                <span className="w-8 sm:w-12 text-center">{product.quantity}</span>

                                                <button
                                                className={`p-2 hover:bg-gray-100 ${product.quantity >= product.stock ? "cursor-not-allowed" : ""}`}
                                                onClick={() => handleUpdateQuantityInCookies(key, product.quantity + 1)}
                                                disabled={product.quantity >= product.stock}
                                                >
                                                <FaPlus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <button
                                                className="p-2 text-themered rounded-lg hover:text-opacity-50"
                                                onClick={() => handleDeleteFromCookies(key)}
                                            >
                                                <FaTrashAlt className="w-5 h-5" />
                                            </button>
                                            </div>
                                        );
                                        })
                                ) : (
                                    <div className="py-8 text-center">
                                        <h2 className="mb-2 text-lg sm:text-2xl font-bold text-gray-900">Your cart is empty</h2>
                                        <p className="text-sm sm:text-base text-gray-600">Looks like you haven't added any items to your cart yet.</p>
                                        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black">
                                            Continue Shopping
                                        </button>
                                    </div>
                                )}    
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="sticky bg-white shadow-sm rounded-xl h-fit top-24">
                            <div className="p-4 sm:p-6">
                                <h2 className="mb-4 text-lg sm:text-xl font-bold text-gray-900">Order Summary</h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex justify-between text-sm sm:text-gray-600">
                                        <span>Total Items:</span>
                                        <span>
                                            {isAuthenticated
                                                ? carts.reduce((total, cart) => total + cart.products.reduce((subtotal, product) => subtotal + product.pivot.quantity, 0), 0)
                                                : Object.values(cookies.guestCart || {}).reduce((total, product) => total + product.quantity, 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-gray-600">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="pt-3 sm:pt-4 border-t">
                                        <div className="flex justify-between text-base sm:text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-themegreen">
                                                ₱{isAuthenticated
                                                    ? carts.flatMap(cart => cart.products)
                                                        .reduce((total, product) => total + (Number(product.price) || 0) * (Number(product.pivot.quantity) || 0), 0)
                                                    : Object.values(cookies.guestCart || {})
                                                        .reduce((total, product) => total + (Number(product.price) || 0) * (Number(product.quantity) || 0), 0)
                                                .toLocaleString()}
                                            </span>                                                                                                                                                                                                                                                                                                     
                                        </div>
                                    </div>
                                    {user ? (
                                    <>
                                    <button 
                                        onClick={handleCheckoutOrder}
                                        className="w-full text-base sm:text-lg py-2 sm:py-3 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Check out
                                    </button>
                                    {showConfirm && (
                                    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[1000]">
                                        <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
                                        <h2 className="text-xl font-semibold text-gray-700">Confirm Your Order</h2>
                                        <p className="text-base text-gray-600 mt-2">
                                            Are you sure this is all you want to checkout?
                                        </p>
                                        <div className="mt-4 flex justify-center gap-5">
                                            <button 
                                            className="px-4 py-2 bg-themegreen text-white rounded-lg hover:bg-themeyellow hover:text-black"
                                            onClick={() => navigate('/checkout-page')}
                                            >
                                            Confirm
                                            </button>
                                            <button 
                                            className="px-4 py-2 bg-gray-400 rounded-lg text-white hover:bg-opacity-60"
                                            onClick={() => setShowConfirm(false)}
                                            >
                                            Cancel
                                            </button>
                                        </div>
                                        </div>
                                    </div>
                                    )}
                                    </>
                                    ) : (
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="w-full text-base sm:text-lg py-2 sm:py-3 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Check out
                                    </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;