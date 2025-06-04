import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import TermsOfService from '../components/TermsOfService';

function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      const formdata = new FormData(e.target);
      
      if (!acceptTerms) {
        toast.error("You must accept the Terms of Service.");
        setLoading(false);
        return;
      }
      
      const password = formdata.get("password");
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        setLoading(false);
        return;
      }

      register(formdata)
      .then((res) => {
      if (res?.ok) {
          toast.success(res?.message ?? "Registered!");
          navigate("/login");
      } else if (res?.errors) {
          if (res.errors.username) toast.error("Username is already taken");
          if (res.errors.email) toast.error("Email is already in use");
      } else {
          toast.error(res?.message ?? "Something went wrong!");
      }
      })
      .finally(() => {
      setLoading(false);
      });
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md h-auto">
        <form onSubmit={onFormSubmit} className="flex flex-col gap-5">
        <div className="text-3xl font-semibold text-center text-themegreen mb-2">Register</div>

        <div>
        <input
        required name="username"
        placeholder="Username" 
        className="border rounded-md p-3 w-full"/>
        </div>

        <div>
        <input
        required
        name="email"
        placeholder="Email Address"
        className="border rounded-md p-3 w-full"
        />
        </div>

        <div className="relative">
        <input
        required name="password"
        placeholder="Password" type={showPassword1 ? "text" : "password"}
        className="border rounded-md p-3 w-full"/>
        <button
          type="button"
          onClick={() => setShowPassword1((prev) => !prev)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          {showPassword1 ? <FaEyeSlash /> : <FaEye />}
        </button>
        </div>

        <div className="relative">
        <input
        required
        type={showPassword2 ? "text" : "password"}
        name="password_confirmation"
        placeholder="Repeat Password"
        className="border rounded-md p-3 w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword2((prev) => !prev)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          {showPassword2 ? <FaEyeSlash /> : <FaEye />}
        </button>
        </div>

        <div className="flex justify-center">
        <button
        type="submit" disabled={loading}
        className={`w-full py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow hover:text-black ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
        {loading ? "Registering..." : "Register"}
        </button>
        </div>
        
        <div className="flex items-center justify-center text-sm">
          <input
            id="terms"
            type="checkbox"
            className="mr-2"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
          />
          <label htmlFor="terms" className="text-gray-700">
            I accept the{" "}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-themegreen hover:underline"
            >
              Terms of Service
            </button>
          </label>
        </div>

        <div className="text-center">
        <Link to="/login" className="text-themegreen text-base">
        <h1 className="font-semibold hover:text-blue-400">Already have an account? Login here.</h1>
        </Link>
        </div>
        </form>
      </div>
      <TermsOfService isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      </div>
  );
}

export default Register;