import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { toast } from "react-toastify";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      const formdata = new FormData(e.target);
      
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

        <div>
        <input
        required name="password"
        placeholder="Password" type="password"
        className="border rounded-md p-3 w-full"/>
        </div>

        <div>
        <input
        required
        type="password"
        name="password_confirmation"
        placeholder="Repeat Password"
        className="border rounded-md p-3 w-full"
        />
        </div>

        <div>
        <input
        required
        name="first_name"
        placeholder="First Name"
        className="border rounded-md p-3 w-full"
        />
        </div>

        <div>
        <input
        required
        name="last_name"
        placeholder="Last Name"
        className="border rounded-md p-3 w-full"
        />
        </div>

        <div>
        <input
        required
        name="phone_number"
        placeholder="Contact"
        className="border rounded-md p-3 w-full"
        />
        </div>

        <div>
        <input
        required
        name="address"
        placeholder="Address"
        className="border rounded-md p-3 w-full"
        />
        </div>

        <div className="flex justify-center">
        <button
        type="submit" disabled={loading}
        className={`w-full py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow hover:text-black ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
        {loading ? "Registering..." : "Register"}
        </button>
        </div>

        <div className="text-center">
        <Link to="/login" className="text-themegreen text-base">
        <h1 className="font-semibold hover:text-blue-400">Already have an account? Login here.</h1>
        </Link>
        </div>
        </form>
      </div>
      </div>
  );
}

export default Register;