import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies();
  const onFormSubmit = (e) => {
  e.preventDefault();
  if (!loading) {
  setLoading(true);
  const formdata = new FormData(e.target);
  login(formdata)
  .then((res) => {
  if (res?.ok) {
  setCookie("token", res?.others?.token);
  navigate("/");
  } else {toast.error(res?.message ?? "Something went wrong!");}
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
        <Input
        name="username"
        placeholder="Username"
        className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>
        <div>
        <Input
        name="password"
        type="password"
        placeholder="Password"
        className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>
        <div className="flex justify-center">
        <Button
        type="submit"
        className={`w-full py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
        >
        {loading ? "Logging In..." : "Login"}
        </Button>
        </div>
        <div className="text-center mt-4">
        <Link to="/register" className="text-themegreen text-sm">
        <h1 className="font-semibold hover:text-blue-400">Don't have an account yet? Register here.</h1>
        </Link>
        </div>

      </form>
    </div>
    </div>
  );
}

export default Login;