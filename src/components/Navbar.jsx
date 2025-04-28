import React, { useState } from "react";
import { logout as Logout } from '../api/auth';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import easypc from '../assets/logo5.png'

const Navbar = () => {
  const [cookies, removeCookie] = useCookies();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleHomeClick = () => {
  navigate(`/`);
  };

  const logout = () => {
    setLoading(true);
    Logout(cookies.token).then((res) => {
    removeCookie("token");
    setLoading(false);
    navigate(`/`);
    toast.success('User logged out!');
    });
  };


  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img onClick={handleHomeClick} className='w-[max(10%,80px)] cursor-pointer' src={easypc} alt="" />
      <button onClick={logout} className={`px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm text-white bg-themegreen hover:bg-themeyellow ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>Logout</button>
    </div>
  );
}

export default Navbar;