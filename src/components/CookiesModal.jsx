import React, { useState } from "react";

export default function CookiesModal() {
  const [isVisible, setIsVisible] = useState(true);

  const handleAcceptCookies = () => {
    document.cookie = "userConsent=true; path=/; max-age=" + 365 * 24 * 60 * 60;
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-xl text-center relative">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
          onClick={handleAcceptCookies}
        >
          &times;
        </button>
        <div className="flex justify-center mb-5">
          <span className="text-5xl">🍪</span>
        </div>
        <h2 className="text-xl font-semibold mb-3">We use cookies</h2>
        <p className="text-base text-gray-600 mb-6">
          Cookies enhance your browsing experience and help us improve our website.
        </p>
        <button
          className="bg-black text-white w-full py-3 rounded-md mb-4 text-base hover:bg-gray-800 transition"
          onClick={handleAcceptCookies}
        >
          Okay
        </button>
      </div>
    </div>
  );
}