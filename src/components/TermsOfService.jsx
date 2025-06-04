import { useState } from "react";

function TermsOfService({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 font-semibold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-themegreen">Terms of Service</h2>
        <div className="text-sm text-gray-700 space-y-4">
          <p>
            Welcome to our platform. By accessing or using our service, you agree to be bound by the following terms and conditions.
          </p>
          <p>
            <strong>1. Use of Service</strong><br />
            You agree not to misuse the service or help anyone else to do so. This includes activities like interfering with our services or trying to access them using a method other than the interface and the instructions we provide.
          </p>
          <p>
            <strong>2. Account Registration</strong><br />
            You must provide accurate and complete information during the registration process. You are responsible for maintaining the confidentiality of your account and password.
          </p>
          <p>
            <strong>3. Privacy</strong><br />
            We value your privacy. Please review our Privacy Policy to understand how we handle your personal data.
          </p>
          <p>
            <strong>4. Termination</strong><br />
            We may suspend or terminate your access if you violate any of the terms. Upon termination, your right to use the service will immediately cease.
          </p>
          <p>
            <strong>5. Changes to Terms</strong><br />
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
          </p>
          <p>
            By continuing to use our service, you agree to any updated terms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;