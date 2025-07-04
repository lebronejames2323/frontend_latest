import React from "react";
import { imageUrl1 } from "../api/configuration";

const OrderModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Order #{order.order_id}</h2>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              order.deleted_at 
                ? "bg-red-100 text-red-700" 
                : ["Order Placed", "Delivered"].includes(order.order_status) 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.deleted_at ? "Cancelled" : order.order_status}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Information</h3>
      <div className="text-sm text-gray-800 space-y-1">
        <p><span className="font-medium text-gray-600">Name:</span> {order.full_name}</p>
        <p><span className="font-medium text-gray-600">Phone:</span> {order.phone_number}</p>
        <p>Payment: {order.payment_method}</p>
        <p><span className="font-medium text-gray-600">Address:</span> {order.delivery_address}</p>
      </div>
    </div>

    <div className="border-t pt-4 mb-4">
      <h4 className="text-sm font-semibold mb-3">Order items</h4>
      <ul className="space-y-3">
        {order.products.map((product) => (
          <li key={product.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <img
                src={`${imageUrl1}/${product.id}.${product.extension}`}
                alt={product.name}
                className="w-10 h-10 rounded object-cover"
              />
              <span>{product.name}</span>
            </div>
            <span className="font-semibold">₱{product.price} x{product.pivot.quantity}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex justify-between font-semibold text-base border-t pt-4">
      <span>Total</span>
      <span>
        ₱
        {order.products.reduce(
          (total, product) => total + product.price * product.pivot.quantity,
          0
        )}
      </span>
    </div>

    <button
      className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
      onClick={onClose}
    >
      Close
    </button>
  </div>
</div>
  );
};

export default OrderModal;