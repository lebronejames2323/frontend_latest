import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { FaArrowLeft } from 'react-icons/fa';
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import profiles from '../assets/profilepic.png'
import CustomModal from "../components/Modal"
import { toast } from "react-toastify";
import { imageUrl1 } from '../api/configuration';
import { index } from "../api/auth";
import { fetchOrders } from '../api/product-fetch';
import { url } from "../api/configuration";

function AccountPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [cookies] = useCookies();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({});

    const refreshOrders = () => {
    fetchOrders(cookies.token).then((res) => {
        setOrders(res?.data);
    })
    };

    useEffect(refreshOrders, []);

    
    const refreshUser = async () => {
        setLoading(true);
        try{
        const response = await index(cookies.token);
        setUser(response.data);
        setFormData({
        username: response.data.username,
        email: response.data.email,
        first_name: response.data.profile.first_name,
        last_name: response.data.profile.last_name,
        phone_number: response.data.profile.phone_number,
        address: response.data.profile.address,
        });
        }catch (error){
        }finally{
        setLoading(false);
        }
        };
    
        useEffect(() => {
        refreshUser();
        }, [cookies.token]);
    
        const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
        };
    
        const onFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        const response = await fetch(`${url}/user/${user.id}`,{
        method: "PATCH",
        headers: {
        "Authorization": `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok){
        toast.success(result.message ?? "Profile updated successfully!");
        setOpenModal(false);
        refreshUser();
        }else{
        toast.error(result.message ?? "Failed to update profile!");
        }
        }catch (error){
        toast.error("An error occurred while updating the profile.");
        }finally{
        setLoading(false);
        }
        };
    
        const openUpdateModal = () => setOpenModal(true);
        const closeUpdateModal = () => setOpenModal(false);
    
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-themegreen border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-lg">Loading...</p>
                    </div>
                </div>
            );
        }
    
        if (!user) {
            return <p>User not found.</p>;
        }
    

    return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
    <div className="max-w-[1500px] w-full">

        <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
            <div className="w-full h-full lg:px-10 px-5 flex items-center justify-between">
                <button 
                onClick={() => navigate('/')}
                className="flex items-center text-themegreen hover:text-themeyellow transition-colors"
                >
                <FaArrowLeft className='mr-1 w-[20px] h-[20px]'/>
                <h1 className='text-base font-semibold'>Back</h1>
                </button>
                <h1 className="flex-grow text-center text-2xl font-bold">Account Page</h1>
                <div className="w-[105px]"></div>
            </div>
        </div>

        <div className='flex pt-20 p-7 gap-5'>
            {user && (
            <>
            <div className='w-[450px] h-[309px] bg-white flex justify-center items-center mx-auto mt-5 rounded-lg shadow-md'>
                <div className="">
                    <div className='flex justify-center items-center'>
                    <img src={profiles} className='h-[100px] w-[100px]'/> 
                    </div>
                <h1 className='text-2xl text-center font-semibold mt-5'>{user.username}</h1>
                <h1 className='text-[18px] text-center font-semibold mt-1'>{user.email}</h1>
                <button onClick={openUpdateModal} className='bg-themegreen hover:bg-themeyellow hover:text-black font-semibold text-white w-full rounded-lg p-1 mt-6'>Edit Profile</button>
                </div>
            </div>

            <div className="container mx-auto mt-5">
                <div className="bg-themegreen text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Account Overview</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 p-9 bg-white rounded-b-lg shadow-md">
                    <div>
                    <p className="font-bold text-gray-700">Full Name:</p>
                    <p className="text-gray-600">{user.profile.first_name} {user.profile.last_name}</p>
                    </div>

                    <div>
                    <p className="font-bold text-gray-700">Username:</p>
                    <p className="text-gray-600">{user.username}</p>
                    </div>

                    <div>
                    <p className="font-bold text-gray-700">Email:</p>
                    <p className="text-gray-600">{user.email}</p>
                    </div>

                    <div>
                    <p className="font-bold text-gray-700">Phone:</p>
                    <p className="text-gray-600">{user.profile.phone_number}</p>
                    </div>

                    <div className="sm:col-span-2">
                    <p className="font-bold text-gray-700">Address:</p>
                    <p className="text-gray-600">{user.profile.address}</p>
                    </div>
                </div>
            </div>
            </>
            )
            }
        </div>

        <div className='pt-5 p-7'>
            <div className="mx-auto">
                <div className="bg-themegreen text-white p-4 rounded-t-lg">
                <h2 className="text-2xl font-bold pl-2">Order Details</h2>
                </div>
            </div>

            <div className="p-8 bg-white rounded-b-lg max-h-[700px] overflow-y-auto">
                <div className="mx-auto p-4">
                    {orders.length > 0 ? (
                    orders.map(order => {
                        const orderTotal = order.products.reduce(
                        (total, product) =>
                        total + Number(product.price) * product.pivot.quantity, 0
                        );
                    return (
                        <div key={order.id} className='flex-col p-5 mb-5 rounded-md'>
                        <div className="flex justify-between px-5">
                            <h1 className="text-lg font-semibold">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</h1>
                            <h1 className="text-lg font-semibold">Total: ₱{orderTotal.toLocaleString()}</h1>
                        </div>
                        {order.products.map(product => (
                            <div key={`${order.id}-${product.id}`} className="bg-white rounded-lg shadow-md border p-4 flex items-center justify-between space-x-4 m-5">
                                
                                <div className="flex items-center space-x-4 w-[350px]">
                                    <div className="w-28 h-28 flex-shrink-0">
                                        <img
                                        src={`${imageUrl1}/${product.id}.${product.extension}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                        <p className="text-sm text-gray-600">
                                            Payment: Cash on Delivery
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 w-[150px] justify-center">
                                    <GoDotFill className="w-[13px] h-[13px] fill-themegreen2"/>
                                    <h2 className="text-base font-semibold">{order.order_status}</h2>
                                </div>

                                <div className="flex items-center space-x-6 w-[200px] justify-end">
                                    <h2 className="text-base text-gray-600">Quantity: {product.pivot.quantity}</h2>
                                    <h2 className="text-lg font-semibold text-themegreen">₱{(product.price * product.pivot.quantity).toLocaleString()}</h2>
                                </div>

                            </div>
                        ))}
                        </div>
                        );
                    })
                    ) : (
                    <p className="text-center text-gray-600">No orders yet for your account.</p>
                    )}
                </div>
            </div>

        </div>
        <CustomModal open={openModal} handleClose={closeUpdateModal}>
            <div className="w-full">
                <div className="bg-themegreen text-white p-4 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-center">Profile Update</h2>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg w-full">
                    <form onSubmit={onFormSubmit} className="flex flex-col gap-5">
                        <input
                            required
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
                        />
                        <input
                            required
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
                        />
                        <input
                            required
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
                        />
                        <input
                            required
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
                        />
                        <input
                            required
                            name="phone_number"
                            placeholder="Contact"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
                        />
                        <input
                            required
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
                        />
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full text-base py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Updating..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CustomModal>
    </div>
    </div>
  )
}

export default AccountPage