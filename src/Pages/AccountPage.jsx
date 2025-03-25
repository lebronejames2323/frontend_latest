import React, { useEffect, useState } from 'react'
import withAuth from "../high-order-component/withAuth";
import { useCookies } from 'react-cookie';
import { FaArrowLeft } from 'react-icons/fa';
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import profiles from '../assets/profilepic.png'
import CustomModal from "../components/Modal"
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";
import { imageUrl } from '../api/configuration';
import { index } from "../api/auth";

function AccountPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [cookies] = useCookies();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});

    const fetchOrders = async () => {
        try {
            console.log("Fetching orders with token:", cookies.token);

            const response = await fetch("http://localhost:8000/api/orders", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch orders");
            }

            const res = await response.json();
            console.log("API Response:", res.data);

            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err.message);
            setError(`Error fetching orders: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    
    const refreshUser = async () => {
            setLoading(true);
            try {
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
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
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
                const response = await fetch(`http://localhost:8000/api/user/${user.id}`, {
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
                    setOpenModal(false); // Close the modal
                    refreshUser(); // Refresh user data
                } else {
                    toast.error(result.message ?? "Failed to update profile!");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                toast.error("An error occurred while updating the profile.");
            } finally {
                setLoading(false);
            }
        };
    
        const openUpdateModal = () => setOpenModal(true);
        const closeUpdateModal = () => setOpenModal(false);
    
        if (loading) {
            return <p>Loading...</p>;
        }
    
        if (!user) {
            return <p>User not found.</p>;
        }
    

    return (
    <div className="min-h-screen bg-gray-100">
        <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
            <div className="w-full h-full lg:px-10 px-5 flex items-center">
                <button 
                onClick={() => navigate('/')}
                className="flex items-center text-themegreen hover:text-themeyellow transition-colors"
                >
                <FaArrowLeft className='mr-1 w-[20px] h-[20px]'/>
                <h1 className='text-base font-semibold'>Back</h1>
                </button>
                <h1 className=" flex-grow text-center text-2xl font-bold">Account</h1>
            </div>
        </div>

        <div className='flex pt-20 p-7 gap-5'>
            {user && (
            <>
            <div className='w-1/4 h-[309px] bg-white flex justify-center items-center mx-auto mt-5 rounded-lg'>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 bg-white rounded-b-lg">
            <div className="font-bold">Full Name:</div>
            <div>{user.profile.first_name} {user.profile.last_name}</div>

            <div className="font-bold">Username:</div>
            <div>{user.username}</div>

            <div className="font-bold">Email:</div>
            <div>{user.email}</div>

            <div className="font-bold">Phone:</div>
            <div>{user.profile.phone_number}</div>

            <div className="font-bold">Address:</div>
            <div>{user.profile.address}</div>
            
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

            <div className="p-8 bg-white rounded-b-lg">
                <div className="mx-auto p-4">
                    {orders.length > 0 ? (
                    orders.map(order => (
                        <ul key={order.id}>
                        {order.products.map(product => (
                            <div key={`${order.id}-${product.id}`} className="bg-white rounded-lg shadow-md border p-4 flex items-center space-x-4 m-5">
                            <div className="w-32 h-32 flex-shrink-0">
                                <img
                                src={`${imageUrl}/${product.id}.${product.extension}`}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md"
                                />
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                <p className="text-sm text-gray-600">Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">Order ID: ZB22WSAOFC</p>
                            </div>

                            <div className="flex flex-grow items-center space-x-1">
                                <GoDotFill className="w-[13px] h-[13px] fill-themegreen"/>
                                <h2 className="text-base font-semibold">Order Delivered</h2>
                            </div>

                            <div className="flex items-center space-x-4">
                                <h2 className="text-base text-gray-600">Quantity: {product.pivot.quantity}</h2>
                            </div>
                            <div className="flex items-center space-x-4">
                                <h2 className="text-lg font-semibold text-gray-900">₱{(product.price * product.pivot.quantity).toFixed(2)}</h2>
                            </div>
                            </div>
                        ))}
                        </ul>
                    ))
                    ) : (
                    <p className="text-center text-gray-600">No orders found for this user.</p>
                    )}
                </div>
            </div>

        </div>
        <CustomModal open={openModal} handleClose={closeUpdateModal}>
            <div className="w-full">
                <div className="bg-themegreen text-white p-4 rounded-t-xl">
                    <h2 className="text-xl font-bold">Profile Update</h2>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg w-full">
                    <form onSubmit={onFormSubmit} className="flex flex-col gap-5">
                        <Input
                            required
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Input
                            required
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Input
                            required
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Input
                            required
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Input
                            required
                            name="phone_number"
                            placeholder="Contact"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Input
                            required
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
                        />
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={loading}
                                className={`w-full text-base py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Updating..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </CustomModal>
    </div>
  )
}

export default withAuth(AccountPage)