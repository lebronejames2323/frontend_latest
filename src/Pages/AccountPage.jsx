import { useEffect, useState, useCallback } from 'react'
import withAuth from "../high-order-component/withAuth";
import { useCookies } from 'react-cookie';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaUser, FaBox, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import profiles from '../assets/profilepic.png'
import CustomModal from "../components/Modal"
import OrderReceipt from '../components/OrderReceipt';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";
import { imageUrl } from '../api/configuration';
import { index } from "../api/auth";

// Export the base component
export function AccountPage() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        user: null,
        orders: [],
        loading: {
            user: true,
            orders: true
        },
        error: null
    });
    const [cookies] = useCookies();
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: { ...prev.loading, orders: true } }));
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
            setState(prev => ({ 
                ...prev, 
                orders: res.data,
                loading: { ...prev.loading, orders: false }
            }));
        } catch (err) {
            console.error("Error fetching orders:", err.message);
            setState(prev => ({ 
                ...prev, 
                error: `Error fetching orders: ${err.message}`,
                loading: { ...prev.loading, orders: false }
            }));
            toast.error(`Error fetching orders: ${err.message}`);
        }
    }, [cookies.token]);

    const refreshUser = useCallback(async () => {
        setState(prev => ({ ...prev, loading: { ...prev.loading, user: true } }));
        try {
            const response = await index(cookies.token);
            const userData = response.data;
            setState(prev => ({ 
                ...prev, 
                user: userData,
                loading: { ...prev.loading, user: false }
            }));
            setFormData({
                username: userData.username,
                email: userData.email,
                first_name: userData.profile.first_name,
                last_name: userData.profile.last_name,
                phone_number: userData.profile.phone_number,
                address: userData.profile.address,
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            setState(prev => ({ 
                ...prev, 
                error: "Error fetching user data",
                loading: { ...prev.loading, user: false }
            }));
        }
    }, [cookies.token]);

    useEffect(() => {
        refreshUser();
        fetchOrders();
    }, [refreshUser, fetchOrders]);

    const getOrderStatus = (order) => {
        const statusConfig = {
            'pending': {
                icon: FaClock,
                text: 'Order Pending',
                color: 'text-orange-500',
                bgColor: 'bg-orange-100'
            },
            'processing': {
                icon: FaBox,
                text: 'Processing',
                color: 'text-blue-500',
                bgColor: 'bg-blue-100'
            },
            'shipping': {
                icon: FaTruck,
                text: 'On the Way',
                color: 'text-purple-500',
                bgColor: 'bg-purple-100'
            },
            'delivered': {
                icon: FaCheckCircle,
                text: 'Delivered',
                color: 'text-themegreen',
                bgColor: 'bg-green-100'
            }
        };

        const status = order.status || 'pending';
        return statusConfig[status.toLowerCase()];
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        setState(prev => ({ ...prev, loading: { ...prev.loading, user: true } }));
        try {
            const response = await fetch(`http://localhost:8000/api/user/${state.user.id}`, {
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
            setState(prev => ({ ...prev, loading: { ...prev.loading, user: false } }));
        }
    };

    const openUpdateModal = () => setOpenModal(true);

    if (state.loading.user && state.loading.orders) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-themegreen border-t-transparent animate-spin"></div>
                    <p className="text-gray-600">Loading your account...</p>
                </div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">
                    <p>{state.error}</p>
                    <button 
                        onClick={() => {
                            setState(prev => ({ ...prev, error: null }));
                            refreshUser();
                            fetchOrders();
                        }}
                        className="px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!state.user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">User not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-gray-50">
            <div className="w-full h-[80px] bg-white shadow-sm fixed top-0 left-0 z-50">
                <div className="flex items-center w-full h-full px-5 mx-auto lg:px-10 max-w-7xl">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-700 transition-colors hover:text-themegreen"
                    >
                        <FaArrowLeft className='w-5 h-5 mr-2'/>
                        <span className='text-base font-medium'>Home</span>
                    </button>
                    <h1 className="flex-grow text-xl font-semibold text-center text-gray-900">My Account</h1>
                    <div className="w-[100px]"></div>
                </div>
            </div>

            <div className='container px-4 pt-24 mx-auto lg:px-6 max-w-7xl'>
                {state.user && (
                    <div className="grid lg:grid-cols-[300px,1fr] gap-8">
                        {/* Profile Card */}
                        <div className="overflow-hidden bg-white shadow-sm rounded-2xl">
                            <div className="relative h-32 bg-gradient-to-r from-themegreen to-themeyellow">
                                <div className="absolute transform -translate-x-1/2 left-1/2 -bottom-16">
                                    <div className="w-32 h-32 overflow-hidden bg-white border-4 border-white rounded-full">
                                        <img src={profiles} className='object-cover w-full h-full'/> 
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 pt-20">
                                <div className="mb-8 text-center">
                                    <h2 className='mb-1 text-2xl font-bold text-gray-900'>{state.user.username}</h2>
                                    <p className='text-gray-500'>{state.user.email}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                        <FaUser className="w-5 h-5 text-themegreen" />
                                        <div>
                                            <p className="text-sm text-gray-500">Full Name</p>
                                            <p className="font-medium">{state.user.profile.first_name} {state.user.profile.last_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                        <FaPhone className="w-5 h-5 text-themegreen" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{state.user.profile.phone_number}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                        <FaMapMarkerAlt className="w-5 h-5 text-themegreen" />
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium">{state.user.profile.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={openUpdateModal}
                                    className='w-full py-3 mt-6 font-semibold text-white transition-colors bg-themegreen hover:bg-themeyellow hover:text-black rounded-xl'
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Orders Section */}
                        <div className="space-y-6">
                            <div className="overflow-hidden bg-white shadow-sm rounded-2xl">
                                <div className="p-6 bg-gradient-to-r from-themegreen to-themeyellow">
                                    <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
                                </div>
                                <div className="p-6">
                                    {state.orders.length > 0 ? (
                                        state.orders.map(order => (
                                            <div 
                                                key={order.id} 
                                                className="mb-8 transition-colors cursor-pointer last:mb-0 hover:bg-gray-50"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowOrderDetails(true);
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                {order.products.map(product => {
                                                    const StatusIcon = getOrderStatus(order).icon;
                                                    return (
                                                        <div 
                                                            key={`${order.id}-${product.id}`} 
                                                            className="p-4 mb-4 transition-shadow bg-gray-50 rounded-xl hover:shadow-md"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex-shrink-0 w-24 h-24">
                                                                    <img
                                                                        src={`${imageUrl}/${product.id}.${product.extension}`}
                                                                        alt={product.name}
                                                                        className="object-cover w-full h-full rounded-lg"
                                                                    />
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                                                        <p className="text-sm text-gray-600">Quantity: {product.pivot.quantity}</p>
                                                                        <p className="text-lg font-bold text-themegreen">₱{Number(product.price).toFixed(2)}</p>
                                                                    </div>
                                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2 ${getOrderStatus(order).bgColor}`}>
                                                                        <StatusIcon className={`w-4 h-4 ${getOrderStatus(order).color}`} />
                                                                        <span className={`text-sm font-medium ${getOrderStatus(order).color}`}>
                                                                            {getOrderStatus(order).text}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center">
                                            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                                                <FaBox className="w-full h-full" />
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold text-gray-700">No Orders Yet</h3>
                                            <p className="mb-6 text-gray-500">Start shopping to see your orders here</p>
                                            <button
                                                onClick={() => navigate('/')}
                                                className="px-6 py-3 font-semibold text-white transition-colors bg-themegreen hover:bg-themeyellow hover:text-black rounded-xl"
                                            >
                                                Browse Products
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <CustomModal
                    isOpen={showOrderDetails}
                    onClose={() => {
                        setShowOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                >
                    <OrderReceipt order={selectedOrder} />
                </CustomModal>
            )}

            <CustomModal open={openModal} handleClose={() => setOpenModal(false)}>
                <div className="w-full">
                    <div className="p-4 bg-gradient-to-r from-themegreen to-themeyellow rounded-t-xl">
                        <h2 className="text-xl font-bold text-white">Update Profile</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={onFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    required
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    required
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    required
                                    name="first_name"
                                    placeholder="First Name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    required
                                    name="last_name"
                                    placeholder="Last Name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Input
                                required
                                name="phone_number"
                                placeholder="Contact"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                            />
                            <Input
                                required
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                            <Button
                                type="submit"
                                disabled={state.loading.user}
                                className="w-full bg-themegreen hover:bg-themeyellow text-white hover:text-black font-semibold py-2.5"
                            >
                                {state.loading.user ? "Updating..." : "Save Changes"}
                            </Button>
                        </form>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
}

// Wrap the component with withAuth HOC as a separate export
const WrappedAccountPage = withAuth(AccountPage);
export default WrappedAccountPage;