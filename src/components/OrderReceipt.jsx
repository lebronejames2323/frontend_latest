import React from 'react';
import { FaCheckCircle, FaDownload, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { imageUrl } from '../api/configuration';
import OrderTimeline from './OrderTimeline';

const OrderReceipt = ({ order, onClose }) => {
    const calculateTotal = () => {
        return order.products.reduce((total, product) => 
            total + (Number(product.price) * product.pivot.quantity), 0
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-3xl bg-white rounded-2xl">
                {/* Header with gradient background */}
                <div className="p-6 bg-gradient-to-r from-themegreen to-themeyellow rounded-t-2xl">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full">
                            <FaCheckCircle className="text-3xl text-themegreen" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-white">Thank You for Your Order!</h2>
                        <p className="text-white/80">Your order has been received and is now being processed</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Order Timeline */}
                    <OrderTimeline status={order.status || 'pending'} />

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Order Number</p>
                            <p className="font-semibold">#{order.id}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-semibold">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-semibold text-themegreen">₱{calculateTotal().toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-semibold">Cash on Delivery</p>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="mt-8">
                        <h3 className="mb-4 font-semibold">Delivery Information</h3>
                        <div className="p-4 space-y-3 bg-gray-50 rounded-xl">
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
                                    <p className="font-medium">{order.contact_number || 'Default Phone'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-8">
                        <h3 className="mb-4 font-semibold">Order Items</h3>
                        <div className="space-y-4">
                            {order.products.map(product => (
                                <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <img
                                        src={`${imageUrl}/${product.id}.${product.extension}`}
                                        alt={product.name}
                                        className="object-cover w-16 h-16 rounded-lg"
                                    />
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                                        <p className="text-sm text-gray-500">Quantity: {product.pivot.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-themegreen">₱{Number(product.price).toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">
                                            Subtotal: ₱{(Number(product.price) * product.pivot.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Summary */}
                    <div className="p-4 mt-6 bg-gray-50 rounded-xl">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₱{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fee</span>
                                <span>Free</span>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-themegreen">₱{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <Link 
                            to="/account" 
                            className="flex items-center justify-center gap-2 py-3 font-semibold text-white transition-colors bg-themegreen hover:bg-themeyellow hover:text-black rounded-xl"
                        >
                            <FaDownload className="w-4 h-4" />
                            Download Receipt
                        </Link>
                        <button 
                            onClick={onClose}
                            className="py-3 font-semibold transition-colors border-2 border-gray-200 rounded-xl hover:bg-gray-50"
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