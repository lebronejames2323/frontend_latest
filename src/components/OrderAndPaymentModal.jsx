import React from "react";

const OrderAndPaymentModal = ({ isOpen, onClose }) => {
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
        <h2 className="text-xl font-bold mb-4 text-themegreen">Order and Payment</h2>
        <div className="text-sm text-gray-700 space-y-4 max-h-[70vh] overflow-y-auto pr-2">

          <div>
            <h3 className="font-semibold">Payment Methods</h3>
            <ul className="list-disc list-inside mt-1 space-y-2">
              <li>
                <strong>Credit or Debit Card</strong><br />
                All Visa and Mastercard credit or debit cards issued in the Philippines are accepted. Transactions are processed securely via Xendit.
                <br />
                For verification, the card used must be presented along with a valid ID. If the card is under a different name, an authorization letter and ID of the cardholder may be required.
              </li>

              <li>
                <strong>eWallets</strong><br />
                Accepted wallets include GCash and GrabPay. Select Xendit at checkout and follow the wallet-specific steps.
              </li>

              <li>
                <strong>BDO Pay (Installment Option)</strong><br />
                CyberDrive offers installment payments via BDO Pay. Requirements to apply:
                <ul className="list-disc list-inside ml-4">
                  <li>1 Valid Government ID</li>
                  <li>Proof of Income</li>
                  <li>Proof of Billing Address</li>
                </ul>
              </li>

              <li>
                <strong>Cash on Delivery (COD)</strong><br />
                COD is available. Delivery typically takes 2–3 business days.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAndPaymentModal;