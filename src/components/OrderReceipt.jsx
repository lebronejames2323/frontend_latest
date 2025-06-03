import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { imageUrl1 } from '../api/configuration';
import { index } from '../api/auth';
import { useCookies } from 'react-cookie';

const OrderReceipt = ({ order, onClose }) => {
    const [user, setUser] = useState(null);
    const [cookies] = useCookies();

    const refreshUsers = () => {
    index(cookies.token).then((res) => {
    setUser(res?.data || null);
    });
    };

    useEffect(refreshUsers, []);

    const calculateTotal = () => {
        return order.products.reduce((total, product) => 
            total + (Number(product.price) * product.pivot.quantity), 0
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-lg bg-white rounded-2xl max-h-screen overflow-y-auto">
                <div className="p-3 bg-themegreen rounded-t-2xl">
                    <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-white rounded-full">
                        <FaCheckCircle className="text-2xl text-themegreen" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Thank You for Your Order!</h2>
                    <p className="text-gray-200 text-base">
                        Your order has been received and is now being processed
                    </p>
                    </div>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Date of Order</p>
                        <p className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                        </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-semibold">{order.payment_method}</p>
                    </div>
                    </div>

                    {user && (
                    <>
                    <div className="mt-4">
                    <h3 className="mb-2 font-semibold">Delivery Information</h3>
                    <div className="p-3 space-y-3 bg-gray-50 rounded-xl">
                    
                        <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-themegreen" />
                        <div>
                            <p className="text-sm text-gray-500">Delivery Address</p>
                            <p className="font-medium">{order.delivery_address || 'Default Address'}</p>
                        </div>
                        </div>
                        <div className="flex items-center gap-3">
                        <FaPhone className="text-themegreen" />
                        <div>
                            <p className="text-sm text-gray-500">Contact Number</p>
                            <p className="font-medium">{user.profile.phone_number || 'Default Phone'}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    </>
                    )}

                    <div className="mt-4">
                    <h3 className="mb-2 font-semibold">Order Items</h3>
                    <div className="space-y-3 max-h-[80px] overflow-y-auto">
                        {order.products.map(product => (
                        <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <img
                            src={`${imageUrl1}/${product.id}.${product.extension}`}
                            alt={product.name}
                            className="object-cover w-14 h-14 rounded-lg"
                            />
                            <div className="flex-grow">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">
                                Quantity: {product.pivot.quantity}
                            </p>
                            </div>
                            <div className="text-right">
                            <p className="font-medium text-themegreen">
                                ₱{Number(product.price).toLocaleString()}
                            </p>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>

                    <div className="py-2 px-3 mt-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span className="text-themegreen">₱{calculateTotal().toLocaleString()}</span>
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-5">
                    <Link 
                        to="/account" 
                        className="flex items-center justify-center gap-2 py-2 font-semibold text-white transition-colors bg-themegreen hover:bg-themeyellow hover:text-black rounded-xl"
                    >
                        Go to Orders
                    </Link>
                    <button 
                        onClick={onClose}
                        className="py-2 font-semibold bg-gray-200 rounded-xl hover:bg-gray-300"
                    >
                        Close
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderReceipt;