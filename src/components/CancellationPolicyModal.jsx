import { useState } from "react";

const CancellationPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-themegreen">Cancellation Policy</h2>
        <div className="text-sm text-gray-700 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          <p>
            At <strong>CyberDrive</strong>, customers may cancel their orders while the status remains <strong>“Order Placed.”</strong> The cancel option will appear under <strong>“Order Details.”</strong>
          </p>
          <p>
            Once an order is <strong>“Packed,”</strong> it can't be cancelled online. Customers can reach out to support for further assistance.
          </p>
          <p>
            Cancellation is not allowed once the item is <strong>out for delivery</strong>. Delivery rescheduling may be possible on special request.
          </p>
          <p>Orders may be cancelled by CyberDrive for reasons such as:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Item is out of stock</li>
            <li>Failed delivery</li>
            <li>Suspected fraud</li>
            <li>Other unfulfillable circumstances</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyModal;