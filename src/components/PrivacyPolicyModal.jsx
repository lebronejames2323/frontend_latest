import React from "react";

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
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
        <h2 className="text-xl font-bold mb-4 text-themegreen">Privacy Policy</h2>
        <div className="text-sm text-gray-700 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          <p>
            At <strong>CyberDrive</strong>, we are committed to protecting your privacy. This policy outlines how we collect, use, and protect your personal data.
          </p>
          <p>
            <strong>Information We Collect:</strong> We collect personal details such as your name, email, shipping address, and payment information when you place an order or create an account.
          </p>
          <p>
            <strong>Use of Information:</strong> Your data is used solely for processing orders, improving our services, and communicating relevant updates such as order confirmations or service announcements.
          </p>
          <p>
            <strong>Cookies:</strong> We use cookies to enhance your experience on our website. These help remember your preferences and optimize website performance.
          </p>
          <p>
            <strong>Data Protection:</strong> All user data is securely stored and safeguarded against unauthorized access. We do not sell or rent your personal information to third parties.
          </p>
          <p>
            <strong>User Rights:</strong> You have the right to access, update, or delete your personal information by accessing your account settings or contacting our support team.
          </p>
          <p>
            By using our website, you consent to the terms outlined in this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;