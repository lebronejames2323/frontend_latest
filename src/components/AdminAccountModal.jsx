import { useState } from "react";
import instructionImage from "../assets/Admin-Info.png";
import { MdClose } from "react-icons/md";

const AdminAccountModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[450px] max-w-full relative">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold text-themegreen">Admin Account</h3>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-themered text-2xl"
          >
            <MdClose />
          </button>
        </div>

        <div className="mb-5">
          <div>
            <strong>Username:</strong> admin
          </div>
          <div>
            <strong>Password:</strong> 123123123
          </div>
        </div>

        <div className="rounded-md w-full">
          <img
            src={instructionImage}
            alt="Instructions"
            className="rounded-md w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAccountModal;