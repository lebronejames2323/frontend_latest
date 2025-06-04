import React from "react";

const DeliveryPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white max-w-xl w-full p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-themegreen">Delivery Policy</h2>

        <div className="text-sm text-gray-700 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <p>
            At <strong>CyberDrive</strong>, we aim to deliver your purchases as quickly and efficiently as possible. Below you'll find everything you need to know about our delivery process.
          </p>

          <div>
            <h3 className="font-semibold">Delivery Coverage</h3>
            <p>
              We currently offer delivery services nationwide across the Philippines. Some remote or high-risk areas may have limited coverage or longer delivery times.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Delivery Timeframe</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Metro Manila:</strong> 2–3 business days</li>
              <li><strong>Provincial Areas:</strong> 3–7 business days</li>
            </ul>
            <p className="mt-2">Delivery times begin after payment confirmation and order processing.</p>
          </div>

          <div>
            <h3 className="font-semibold">Shipping Methods</h3>
            <p>
              We partner with trusted courier services for standard and express delivery. You can choose your preferred shipping method during checkout.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Order Tracking</h3>
            <p>
              Once your order is dispatched, a tracking number will be sent to your email or account dashboard. You may use this to monitor the real-time status of your delivery.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Delivery Attempts</h3>
            <p>
              Our couriers will attempt delivery up to two (2) times. If unsuccessful, your order may be returned to our warehouse, and additional shipping fees may apply for re-delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPolicyModal;