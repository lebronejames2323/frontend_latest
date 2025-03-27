import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { toast } from "react-toastify";
import withoutAuth from "../high-order-component/withoutAuth";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      const formdata = new FormData(e.target);
      register(formdata)
      .then((res) => {
      if (res?.ok) {
      toast.success(res?.message ?? "Registered!");
      navigate("/login");
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md h-[91vh]">
        <form onSubmit={onFormSubmit} className="flex flex-col gap-5">
        <div className="mb-2 text-3xl font-semibold text-center text-themegreen">Register</div>

        <div>
        <Input
        required name="username"
        placeholder="Username" 
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        </div>

        <div>
        <Input
        required
        name="email"
        placeholder="Email Address"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>

        <div>
        <Input
        required name="password"
        placeholder="Password" type="password"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        </div>

        <div>
        <Input
        required
        type="password"
        name="password_confirmation"
        placeholder="Repeat Password"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>

        <div>
        <Input
        required
        name="first_name"
        placeholder="First Name"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>

        <div>
        <Input
        required
        name="last_name"
        placeholder="Last Name"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>

        <div>
        <Input
        required
        name="phone_number"
        placeholder="Contact"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>

        <div>
        <Input
        required
        name="address"
        placeholder="Address"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen"
        />
        </div>

        <div className="flex justify-center">
        <Button
        type="submit" disabled={loading}
        className={`w-full py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
        {loading ? "Registering..." : "Register"}
        </Button>
        </div>

        <div className="text-center">
        <Link to="/login" className="text-sm text-themegreen">
        <h1 className="font-semibold hover:text-blue-400">Already have an account? Login here.</h1>
        </Link>
        </div>
        </form>
      </div>
      </div>
  );
}

export default withoutAuth(Register);