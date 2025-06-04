    import React from "react";

const FAQsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-themegreen">Frequently Asked Questions</h2>

        <div className="text-sm text-gray-700 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <h3 className="font-semibold">1. How do I create an account?</h3>
            <p>Click on the "Register" button at the top of the page, fill out your details, and submit the form to get started.</p>
          </div>

          <div>
            <h3 className="font-semibold">2. What payment methods do you accept?</h3>
            <p>We accept Credit/Debit Cards, BDO Pay, GCash, and Cash on Delivery.</p>
          </div>

          <div>
            <h3 className="font-semibold">3. How long does delivery take?</h3>
            <p>Delivery takes 2–3 business days within Metro Manila and 3–7 business days for provincial areas.</p>
          </div>

          <div>
            <h3 className="font-semibold">6. Can I cancel my order?</h3>
            <p>Yes. You may cancel an order as long as it is still marked as "Pending". Cancellation is no longer available once the item is out for delivery.</p>
          </div>

          <div>
            <h3 className="font-semibold">10. Is my personal data secure?</h3>
            <p>Yes. We value your privacy and take all necessary precautions to protect your personal and payment information. Please see our Privacy Policy for more information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsModal;