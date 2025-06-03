import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import withAuth from "../high-order-component/withAuth"
import parcel_icon from '../assets/parcel_icon.svg'
import { fetchAdminOrders } from '../api/product-fetch';
import { index } from "../api/auth";
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify'
import { url } from "../api/configuration";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [cookies] = useCookies()

  const refreshOrders = () => {
    fetchAdminOrders(cookies.token).then((res) => {
      setOrders(res?.data);
    })
  };

  const refreshUser = () => {
    index(cookies.token).then((res) => {
      setUser(res?.data);
    })
  };

  useEffect(refreshOrders, []);
  useEffect(refreshUser, []);


  const updateOrderStatus = async (orderId, status) => {
    try{
    const response = await fetch(
    `${url}/orders/${orderId}/status`,
    {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookies.token}`,
    },
    body: JSON.stringify({ order_status: status }),
    }
    );

    if (!response.ok){
    const error = await response.json();
    throw new Error(error.message || 'Failed to update order status');
    }

    const data = await response.json();
    toast.success("Order status updated!");
    }catch (error){
    toast.error('Failed to update order status');
    }
    };  


  return (
    <div className='bg-grey-50 min-h-screen'>
      <Navbar />
      <hr/>
      <div className='flex w-full'>
        <Sidebar/>
        <div className='w-[70%] mx-auto ml-max[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <h3>Order Page</h3>
          {orders.length > 0 ? (
            orders.map(order => (
              
                <div key={order.id} className={`grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] lg:grid-cols[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm ${
                  order.deleted_at ? "bg-gray-100 text-gray-500 opacity-70 border-gray-300" : "border-gray-200 text-gray-700"}`}
                >

                  <img className= 'w-12'src={parcel_icon} alt="" />
                  <div>

                    <div>
                    {order.products.map((product) => {
                    return <p className='py-0.5' key={`${order.id}-${product.id}`}>{product.name} x{product.pivot.quantity}</p>
                    })}
                    </div>

                    {user && (
                    <>
                    <p className='mt-3 mb-2 font-medium'>{order.user?.profile?.first_name} {order.user?.profile?.last_name}</p>
                    <div>
                      <p>{order.user?.email}</p>
                      <p>{order.user?.profile?.address}</p>
                    </div>
                    <p>{order.user?.profile?.phone_number}</p>
                    </>
                    )}
                  </div>
                  <div>
                    <p className='text-sm sm:text-[15]'>Items: {order.products.reduce( (total, product) => total + product.pivot.quantity, 0)}</p>
                    <p className='mt-3'>Date : {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    <p>Order ID: {order.order_id}</p>
                  </div>
                  <p className='text-sm sm:text-[15px]'>Total: ₱{order.products.reduce( (total, product) => total + product.price * product.pivot.quantity, 0)}</p>
                  <div>
                    {order.deleted_at ? (
                      <p className="text-red-500 font-bold">Order Canceled</p>
                    ) : (
                      <select
                        className="p-2 font-semibold bg-gray-100"
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        defaultValue={order.order_status}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing Order">Packing Order</option>
                        <option value="Order Shipped">Order Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                  </div>
                </div>
                
            ))
            ) : (
            <p className="text-center text-gray-600">There's no orders found yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(Orders)