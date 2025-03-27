import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import withAuth from "../high-order-component/withAuth";
import { useCookies } from 'react-cookie';
import { imageUrl } from '../api/configuration';
import OrderReceipt from '../components/OrderReceipt';
import { AuthContext } from "../contexts/AuthContext";

export function CartPage() {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [error, setError] = useState(null);
    const [cookies] = useCookies();
    const [orderMessage, setOrderMessage] = useState('');
    const [isOrdering, setIsOrdering] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState({
        address: '',
        phone: ''
    });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user?.profile) {
            setDeliveryInfo({
                address: user.profile.address || '',
                phone: user.profile.phone_number || ''
            });
        }
    }, [user]);

    const fetchCarts = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8000/api/carts", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch carts");
            }

            const res = await response.json();
            setCarts(res.data);
        } catch (err) {
            console.error("Error fetching carts:", err.message);
            setError(`Error fetching carts: ${err.message}`);
        }
    }, [cookies.token]);

    useEffect(() => {
        fetchCarts();
    }, [fetchCarts]);

    const handlePlaceOrder = async () => {
        if (!deliveryInfo.address || !deliveryInfo.phone) {
            setShowDeliveryForm(true);
            return;
        }

        setIsOrdering(true);
        try {
            const products = carts
                .flatMap(cart => cart.products)
                .map(product => ({
                    id: product.id,
                    quantity: product.pivot.quantity,
                }));

            const response = await fetch("http://localhost:8000/api/orders", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    products,
                    delivery_address: deliveryInfo.address,
                    contact_number: deliveryInfo.phone,
                    status: 'pending'
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to place order");
            }

            const res = await response.json();
            setOrderMessage(res.message);
            setLastOrder(res.data);

            // Delete all carts after successful order
            for (const cart of carts) {
                await fetch(`http://localhost:8000/api/carts/${cart.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
            }

            setCarts([]);
            setShowReceipt(true);
        } catch (err) {
            setOrderMessage(`Error: ${err.message}`);
        } finally {
            setIsOrdering(false);
        }
    };

    const closeReceipt = () => {
        setShowReceipt(false);
        navigate('/account'); // Navigate to account page after closing receipt
    };

    const updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const response = await fetch(`http://localhost:8000/api/carts/${cartId}/update-product`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.token}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                }),
            });

            if (response.ok) {
                fetchCarts();
            } else {
                throw new Error('Failed to update product quantity');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while updating the quantity.');
        }
    };
    
    const deleteProductFromCart = async (cartId, productId) => {
        if (!window.confirm('Are you sure you want to remove this item?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/carts/${cartId}/delete-product`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.token}`,
                },
                body: JSON.stringify({ product_id: productId }),
            });

            if (response.ok) {
                fetchCarts();
            } else {
                throw new Error('Failed to delete product from cart');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting the product.');
        }
    };

    const calculateTotal = () => {
        return carts.reduce((total, cart) => 
            total + cart.products.reduce((subtotal, product) => 
                subtotal + (Number(product.price) * product.pivot.quantity), 0
            ), 0
        );
    };

    const totalItems = carts.reduce((total, cart) => 
        total + cart.products.reduce((subtotal, product) => 
            subtotal + product.pivot.quantity, 0
        ), 0
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
                <div className="flex items-center w-full h-full px-5 lg:px-10">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center transition-colors text-themegreen hover:text-themeyellow"
                    >
                        <FaArrowLeft className='mr-2 w-[20px] h-[20px]' />
                        <span className="text-base font-semibold">Continue Shopping</span>
                    </button>
                    <h1 className="flex-grow text-2xl font-bold text-center">Shopping Cart</h1>
                    <div className="w-[150px]"></div>
                </div>
            </div>

            <div className="container px-4 pt-24 pb-12 mx-auto max-w-7xl">
                {error ? (
                    <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                ) : carts.length > 0 ? (
                    <div className="grid lg:grid-cols-[1fr,400px] gap-6">
                        {/* Cart Items */}
                        <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                            <div className="p-6">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Cart Items ({totalItems})</h2>
                                <div className="divide-y">
                                    {carts.map(cart => (
                                        <div key={cart.id}>
                                            {cart.products.map(product => (
                                                <div 
                                                    key={product.id} 
                                                    className="flex items-center gap-4 py-4"
                                                >
                                                    <div className="flex-shrink-0 w-24 h-24">
                                                        <img
                                                            src={`${imageUrl}/${product.id}.${product.extension}`}
                                                            alt={product.name}
                                                            className="object-cover w-full h-full rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                                        <p className="text-sm text-gray-500">{product.category?.name}</p>
                                                        <p className="mt-1 text-lg font-bold text-themegreen">
                                                            ₱{Number(product.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center border rounded-lg">
                                                            <button 
                                                                className="p-2 hover:bg-gray-100"
                                                                onClick={() => updateProductQuantity(cart.id, product.id, Math.max(1, product.pivot.quantity - 1))}
                                                            >
                                                                <FaMinus className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-12 text-center">{product.pivot.quantity}</span>
                                                            <button 
                                                                className="p-2 hover:bg-gray-100"
                                                                onClick={() => updateProductQuantity(cart.id, product.id, product.pivot.quantity + 1)}
                                                            >
                                                                <FaPlus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteProductFromCart(cart.id, product.id)}
                                                            className="p-2 text-red-500 rounded-lg hover:bg-red-50"
                                                        >
                                                            <FaTrash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            {showDeliveryForm ? (
                                <div className="bg-white shadow-sm rounded-xl">
                                    <div className="p-6">
                                        <h2 className="mb-4 text-xl font-bold text-gray-900">Delivery Information</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                                    Delivery Address
                                                </label>
                                                <textarea
                                                    value={deliveryInfo.address}
                                                    onChange={(e) => setDeliveryInfo(prev => ({
                                                        ...prev,
                                                        address: e.target.value
                                                    }))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-themegreen focus:border-transparent"
                                                    rows={3}
                                                    placeholder="Enter your complete delivery address"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                                    Contact Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={deliveryInfo.phone}
                                                    onChange={(e) => setDeliveryInfo(prev => ({
                                                        ...prev,
                                                        phone: e.target.value
                                                    }))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-themegreen focus:border-transparent"
                                                    placeholder="Enter your contact number"
                                                    required
                                                />
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    if (deliveryInfo.address && deliveryInfo.phone) {
                                                        handlePlaceOrder();
                                                    }
                                                }}
                                                disabled={!deliveryInfo.address || !deliveryInfo.phone || isOrdering}
                                                className="w-full py-3 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isOrdering ? "Processing..." : "Confirm Order"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="sticky bg-white shadow-sm rounded-xl h-fit top-24">
                                    <div className="p-6">
                                        <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Total Items</span>
                                                <span>{totalItems}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Shipping</span>
                                                <span>Free</span>
                                            </div>
                                            <div className="pt-4 border-t">
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span className="text-themegreen">₱{calculateTotal().toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setShowDeliveryForm(true)}
                                                disabled={isOrdering}
                                                className="w-full py-3 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isOrdering ? "Processing..." : "Proceed to Checkout"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
                        <p className="mb-6 text-gray-600">Looks like you haven&apos;t added any items to your cart yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>

            {/* Order Receipt Modal */}
            {showReceipt && lastOrder && (
                <OrderReceipt order={lastOrder} onClose={closeReceipt} />
            )}
        </div>
    );
}

export default withAuth(CartPage);
