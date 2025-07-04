import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import withAuth from "../high-order-component/withAuth"
import parcel_icon from '../assets/parcel_icon.svg'
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { fetchAdminOrders } from '../api/product-fetch';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify'
import { url } from "../api/configuration";
import OrderModal from "../components/OrderModal"; 

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [cookies] = useCookies();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("all_time");
  const [searchValue, setSearchValue] = useState("");

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    refreshOrders(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setSelectedDateRange(e.target.value);
    refreshOrders(selectedStatus, e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    refreshOrders(selectedStatus, selectedDateRange, e.target.value);
    setCurrentPage(1);
  };

  const refreshOrders = (status = "", dateRange = "all_time", search = "",) => {
    console.log("Fetching orders with status:", status, "and date range:", dateRange, "and search:", search);
    fetchAdminOrders(cookies.token, status, dateRange, search , currentPage).then((res) => {
      console.log("Orders received:", res.data);
      setOrders(res?.data);
      setPagination(res?.pagination);
    });
  };

  useEffect(() => {
    refreshOrders(selectedStatus, selectedDateRange, searchValue);
  }, [currentPage, selectedStatus, selectedDateRange, searchValue]);


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

          <div className="flex items-center gap-4 py-4 bg-white">
            <input 
              type="text" 
              placeholder="Search..." 
              onChange={handleSearchChange} 
              className="p-2 border border-gray-300 rounded-md w-[300px]"
            />

            <div className="flex gap-4 ml-auto">
              <select onChange={handleStatusChange} className="p-2 border border-gray-300 rounded-md">
                <option value="">All Status</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing Order">Packing Order</option>
                <option value="Order Shipped">Order Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Order Canceled">Canceled</option>
              </select>

              <select onChange={handleDateChange} className="p-2 border border-gray-300 rounded-md">
                <option value="all_time">All Time</option>
                <option value="today">Today</option>
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
            </div>
          </div>

          {orders.length > 0 ? (
            orders.map(order => (
              <div key={order.id} className={`grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] lg:grid-cols[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 p-5 md:p-8 mb-3 text-xs sm:text-sm ${
                order.deleted_at ? "bg-gray-100 text-gray-500 opacity-70 border-gray-300" : "border-gray-200 text-gray-700"}`}
              >

                <img onClick={() => setSelectedOrder(order)} className='cursor-pointer w-12' src={parcel_icon} alt="" />
                <div className='cursor-pointer' onClick={() => setSelectedOrder(order)}>
                  <div>
                  {order.products.map((product) => {
                  return <p className='py-0.5' key={`${order.id}-${product.id}`}>{product.name} x{product.pivot.quantity}</p>
                  })}
                  </div>

                  <p className='mt-3 mb-2 font-medium'>{order.full_name}</p>
                  <div className='w-[70%]'>
                    <p>{order.user?.email}</p>
                    <p>{order.delivery_address}</p>
                  </div>
                  <p>{order.phone_number}</p>
                </div>
                <div className='cursor-pointer' onClick={() => setSelectedOrder(order)}>
                  <p className='text-sm sm:text-[15]'>Items: {order.products.reduce( (total, product) => total + product.pivot.quantity, 0)}</p>
                  <p className='mt-3'>Date : {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                  <p>Order ID: {order.order_id}</p>
                  <p>{order.payment_method}</p>
                </div>
                <p onClick={() => setSelectedOrder(order)} className='cursor-pointer text-sm sm:text-[15px]'>Total: ₱{order.products.reduce( (total, product) => total + product.price * product.pivot.quantity, 0)}</p>
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

          <OrderModal order={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />

          {pagination?.last_page > 1 && (
            <div className="flex justify-center gap-4 mt-6 sm:mt-8">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={`px-2 sm:px-3 py-1 bg-gray-400 text-white rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={currentPage === 1}
              >
                <MdArrowBackIosNew />
              </button>

              <span className="text-base sm:text-lg font-semibold py-1">
                Page {currentPage} of {pagination?.last_page}
              </span>

              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`px-2 sm:px-3 py-1 bg-gray-400 text-white rounded-md ${currentPage >= pagination?.last_page ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={currentPage >= pagination?.last_page}
              >
                <MdArrowForwardIos />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default withAuth(Orders)