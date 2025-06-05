import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { transferGuestDataToUser } from '../api/product-actions';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();

  const onFormSubmit = (e) => {
  e.preventDefault();
  if (!loading) {
  setLoading(true);
  const formdata = new FormData(e.target);

  login(formdata)
  .then(async (res) => {
  if (res?.ok) {
    const token = res?.others?.token;
    setCookie("token", token);
    await transferGuestDataToUser(res?.others?.token, cookies, setCookie);
    console.log("Cookies after transferGuestDataToUser:", cookies);
    navigate("/");
  } else {
    if (res?.message?.toLowerCase().includes("unauthorized")) {
      toast.error("Incorrect Username or Password");
    } else if (res?.message?.toLowerCase().includes("unauthorized")) {
      toast.error("Incorrect password");
    } else {
      toast.error(res?.message ?? "Something went wrong!");
    }
  }
  })
  .finally(() => {
  setLoading(false);
  });
  }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
      <form onSubmit={onFormSubmit} className="flex flex-col gap-5">

        <div className="text-3xl font-semibold text-center text-themegreen mb-5">Login</div>
        <div>
        <input
        name="username"
        placeholder="Username"
        className="border rounded-md p-3 w-full"
        />
        </div>
        <div className="relative">
        <input
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        className="border rounded-md p-3 w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        </div>
        <div className="flex justify-center">
        <button
        type="submit"
        className={`w-full py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
        >
        {loading ? "Logging In..." : "Login"}
        </button>
        </div>
        <div className="text-center mt-1">
        <Link to="/register" className="text-themegreen text-base">
        <h1 className="font-semibold hover:text-blue-400">Don't have account yet? Register here.</h1>
        </Link>
        <Link to="/" className="text-themegreen text-base mt-1">
        <h1 className="font-semibold hover:text-blue-400">Home Page</h1>
        </Link>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Login;