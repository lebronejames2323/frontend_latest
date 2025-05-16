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
        if (response.ok) {
        toast.success(result.message ?? "Profile updated successfully!");
        setOpenModal(false);
        refreshUser();
        } else if (result.errors) {
        if (result.errors.username) toast.error("Username is already taken");
        if (result.errors.email) toast.error("Email is already in use");
        } else {
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

        const handleProductClick = (productId) => {
        navigate(`/order-review/${productId}`);
        };
    

    return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
    <div className="max-w-[1500px] w-full">

        <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
            <div className="w-full h-full lg:px-10 px-5 flex items-center justify-between">
                <button 
                onClick={() => navigate('/')}
                className="w-[105px] items-center justify-center flex gap-1 text-themegreen hover:text-themeyellow"
                >
                <FaArrowLeft className='mr-1 w-[20px] h-[20px]'/>
                <h1 className='text-base font-semibold'>Back</h1>
                </button>
                <h1 className="flex-grow text-center text-2xl font-bold">Account Page</h1>
                <div className="w-[105px]"></div>
            </div>
        </div>

        <div className='flex flex-col lg:flex-row pt-20 p-7 gap-5'>
            {user && (
            <>
            <div className='w-full lg:w-[450px] h-auto bg-white flex justify-center items-center mx-auto mt-5 rounded-lg shadow-md p-5'>
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

        <div className="pt-5 px-4 sm:p-7">
            <div className="mx-auto w-full">
                <div className="bg-themegreen text-white p-3 sm:p-4 rounded-t-lg">
                    <h2 className="text-lg sm:text-2xl font-bold pl-2">Order Details</h2>
                </div>
            </div>

            <div className="p-4 sm:p-8 bg-white rounded-b-lg max-h-[700px] overflow-y-auto">
                <div className="mx-auto">
                    {orders.length > 0 ? (
                        orders.map(order => {
                            const orderTotal = order.products.reduce(
                                (total, product) =>
                                    total + Number(product.price) * product.pivot.quantity, 0
                            );

                            return (
                                <div key={order.id} className='flex flex-col mb-5 rounded-md border shadow-md'>
                                    <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-5 py-3 border-b text-center sm:text-left">
                                        <h1 className="text-sm sm:text-lg font-semibold">
                                            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}
                                        </h1>
                                        <h1 className="text-sm sm:text-lg">
                                            {order.order_status} | Total: ₱{orderTotal.toLocaleString()}
                                        </h1>
                                    </div>

                                    {order.products.map(product => (
                                        <div key={`${order.id}-${product.id}`} className="bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:space-x-4 mx-4 sm:mx-5">
                                            
                                            <div className="w-[120px] h-[120px] sm:w-28 sm:h-28 flex-shrink-0">
                                                <img
                                                    src={`${imageUrl1}/${product.id}.${product.extension}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </div>

                                            <div className="flex-1 text-center sm:text-left">
                                                <h2 className="text-base sm:text-lg font-semibold text-gray-800">{product.name}</h2>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Payment: Cash on Delivery
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600">Order ID: {order.order_id}</p>
                                            </div>

                                            <div className="w-full sm:w-[150px] text-center sm:text-left">
                                                <h2 onClick={() => handleProductClick(product.id)} className="text-sm sm:text-base font-semibold cursor-pointer">Rate this product</h2>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center sm:justify-end w-full sm:w-[200px] gap-1 sm:space-x-6">
                                                <h2 className="text-xs sm:text-base text-gray-600">Quantity: {product.pivot.quantity}</h2>
                                                <h2 className="text-sm sm:text-base font-semibold text-themegreen">
                                                    ₱{(product.price * product.pivot.quantity).toLocaleString()}
                                                </h2>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-600 text-sm sm:text-base">No orders yet for your account.</p>
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