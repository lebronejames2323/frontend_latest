import React from "react";

const OurCompanyModal = ({ isOpen, onClose }) => {
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

        <h2 className="text-2xl font-bold mb-4 text-themegreen">About CyberDrive</h2>

        <div className="text-sm text-gray-700 space-y-4 max-h-[70vh] overflow-y-auto pr-2">

          <div>
            <h3 className="font-semibold text-lg mb-1">Our Mission</h3>
            <p>To empower Filipino communities by making quality technology more accessible, affordable, and impactful.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Our Vision</h3>
            <p>
              To revolutionize the way individuals and businesses access cutting-edge technology—delivering high-performance computing solutions with convenience, reliability, and expert guidance.
            </p>
            <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
              <li>Empower every user to build their ideal setup through seamless digital shopping.</li>
              <li>Offer an unmatched selection of premium PC components, systems, and accessories.</li>
              <li>Foster a community where knowledge meets innovation, helping customers make informed tech decisions.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Our Core Values</h3>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Integrity in every action</li>
              <li>Unshakable focus on customer needs</li>
              <li>Openness to evolve and adapt</li>
              <li>Data-guided decisions, driven by purpose</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurCompanyModal;