import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaDollarSign, FaChartLine, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import withAuth from "../high-order-component/withAuth"
import { featuredProducts, fetchRecentOrders, fetchSalesData, getCategoriesData } from "../api/product-fetch";
import { getNewUsersCount } from "../api/auth";
import { useCookies } from 'react-cookie';
import { imageUrl1 } from "../api/configuration";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [cookies] = useCookies();
    const [categories, setCategories] = useState([]);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [lastMonthOrdersCount, setLastMonthOrdersCount] = useState(0);
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    const [totalRevenueAllTime, setTotalRevenueAllTime] = useState([]);
    const [totalProductPriceAllTime, setTotalProductPriceAllTime] = useState([]);
    const [newUsersCount, setNewUsersCount] = useState(0);


    useEffect(() => {
        getNewUsersCount(cookies.token).then((res) => {
            console.log("API Response:", res);
            setNewUsersCount(res?.data?.new_users_count ?? 0);
        });
    }, []);


    useEffect(() => {
        fetchSalesData(cookies.token).then((data) => {
            console.log("API Response:", data);
        setMonthlySalesData(Array.isArray(data.monthly_sales) ? data.monthly_sales : []);
        setTotalRevenueAllTime(data.total_revenue || 0);
        setTotalProductPriceAllTime(data.total_product_price || 0);
        });
    }, []);
    
    const refreshCategories = () => {
        getCategoriesData().then((res) => {
        setCategories(res?.data?.categories ?? []);
        setSalesByCategory(Array.isArray(res?.data?.sales_by_category) ? res.data.sales_by_category : []);
        });
    };

    useEffect(() => {
        refreshCategories();
    }, []);


    const refreshOrders = () => {
        fetchRecentOrders(cookies.token).then((res) => {
            console.log("Recent Orders API Response:", res);

        setOrders(Array.isArray(res?.data?.recent_orders) ? res.data.recent_orders : []);
        setLastMonthOrdersCount(res?.data?.last_month_orders_count ?? 0);
        });
    };
        
        useEffect(() => {
    refreshOrders();
    }, []);


    
    const refreshProducts = () => {
    featuredProducts().then((res) => {
    setProducts(res?.data?.slice(0, 5) || []);
    });
    };
    

    useEffect(refreshProducts, []);


    const statusColors = {
        "Order Placed": "bg-gray-400",
        "Packing Order": "bg-yellow-500",
        "Order Shipped": "bg-blue-500",
        "Out for Delivery": "bg-orange-500",
        "Delivered": "bg-green-500",
        "Pending": "bg-gray-500",
    };


    const salesData = {
        labels: monthlySalesData.map((entry) => 
            new Date(entry.month + "-01").toLocaleString('default', { month: 'long' })
        ),
        datasets: [
            {
                label: "Monthly Sales",
                data: monthlySalesData.map((entry) => entry.monthly_revenue),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.2)",
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: "#2563eb",
            },
        ],
    };

    const options1 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: true,
            position: "top",
        },
        },
        scales: {
        x: {
            grid: {
            display: false,
            },
        },
        y: {
            grid: {
            color: "rgba(200, 200, 200, 0.2)",
            },
            ticks: {
            stepSize: 5000,
            },
        },
        },
    };


    const salesDataMap = Object.fromEntries(
        salesByCategory.map((item) => [item.category, parseInt(item.total_sold, 10) || 0])
    );

    const data = {
        labels: categories.map((category) => category.name),
        datasets: [
            {
                label: "Sales Distribution",
                data: categories.map((category) => salesDataMap[category.name] ?? 0),
                backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#e11d48", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"],
                borderWidth: 2,
            },
        ],
    };
    const options2 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: false,
        },
        },
    };


  return (
    <div className="bg-grey-50 min-h-screen">
        <Navbar className="fixed top-0 left-0 w-full z-50" />
        <hr />
        <div className="flex w-full">
            <Sidebar className="fixed top-[50px] left-0 bottom-0 w-[18%] z-40" />
            <div className="w-[80%] mx-auto ml-max[max(5vw,25px)] my-8 text-gray-600 text-base">
                <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-purple-500 text-white p-4 rounded-xl shadow relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                            <FaShoppingCart className="text-purple-500 text-xl" />
                        </div>
                        <h2 className="text-lg font-semibold">New Orders</h2>
                        <p className="text-2xl font-bold">{lastMonthOrdersCount}</p>
                        <span className="text-sm">For the Past 30 Days</span>
                        <div className="mt-4 bg-white bg-opacity-30 h-16 rounded-md"></div>
                        </div>

                        <div className="bg-green-500 text-white p-4 rounded-xl shadow relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                            <FaDollarSign className="text-green-500 text-xl" />
                        </div>
                        <h2 className="text-lg font-semibold">Total Revenue</h2>
                        <p className="text-2xl font-bold">₱{Number(totalRevenueAllTime).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        <span className="text-sm">All time</span>
                        <div className="mt-4 bg-white bg-opacity-30 h-16 rounded-md"></div>
                        </div>

                        <div className="bg-blue-500 text-white p-4 rounded-xl shadow relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                            <FaChartLine className="text-blue-500 text-xl" />
                        </div>
                        <h2 className="text-lg font-semibold">Total Expense</h2>
                        <p className="text-2xl font-bold">₱{Number(totalProductPriceAllTime).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        <span className="text-sm">All time</span>
                        <div className="mt-4 bg-white bg-opacity-30 h-16 rounded-md"></div>
                        </div>

                        <div className="bg-yellow-400 text-white p-4 rounded-xl shadow relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                            <FaUsers className="text-yellow-400 text-xl" />
                        </div>
                        <h2 className="text-lg font-semibold">New Users</h2>
                        <p className="text-2xl font-bold">{newUsersCount.toLocaleString()}</p>
                        <span className="text-sm">For the Past 30 Days</span>
                        <div className="mt-4 bg-white bg-opacity-30 h-16 rounded-md"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
                            </div>

                            <div className="h-64">
                                <Line data={salesData} options={options1} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
                            <div className="overflow-y-auto min-h-[300px] max-h-[310px]">
                                <div className="overflow-y-auto min-h-[300px] max-h-[500px] pr-2">
                                <ul className="space-y-4">
                                    {products.map((product, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            <div className="flex items-center space-x-4">
                                                <img src={`${imageUrl1}/${product.id}.${product.extension}`} alt={product.name} className="w-[90px] h-[90px] sm:w-[9%] sm:h-[10%] pr-2" />
                                                <div>
                                                    <p className="font-semibold">{product.name}</p>
                                                    <p className="text-xs text-gray-400">{product.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{product.purchase_count}</p>
                                                <p className="text-xs text-gray-400">Sold</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Earnings & Recent Orders Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        
                        <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg">
                            {/* Title at the top */}
                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Sold by Category Type</h2>

                            {/* Chart and Legend side by side */}
                            <div className="flex items-center">
                                {/* Pie Chart */}
                                <div className="w-1/2 h-72">
                                <Doughnut data={data} options={options2} />
                                </div>

                                {/* Custom Legend */}
                                <div className="w-1/2 pl-6">
                                    <ul>
                                    {data.labels.map((label, index) => (
                                        <li key={index} className="flex items-center mb-1">
                                        <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}></span>
                                        <span className="text-gray-700 text-base">{label}: {data.datasets[0].data[index]}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {orders && orders.length > 0 ? (
                            <div className="bg-white p-6 rounded-xl shadow col-span-2">
                                <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 border-b">Order ID</th>
                                                <th scope="col" className="px-4 py-3 border-b">Customer</th>
                                                <th scope="col" className="px-4 py-3 border-b">Time</th>
                                                <th scope="col" className="px-4 py-3 border-b">Total</th>
                                                <th scope="col" className="px-4 py-3 border-b">Status</th>
                                                <th scope="col" className="px-4 py-3 border-b">Products</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id} className="border-b bg-white">
                                                    <td className="px-4 py-3">{order.order_id}</td>
                                                    <td className="px-4 py-3">{order.user?.profile?.first_name ?? order.user?.username} {order.user?.profile?.last_name ?? ""}</td>
                                                    <td className="px-4 py-3">{order.timeAgo}</td>
                                                    <td className="px-4 py-3">₱{order.products.reduce( (total, product) => total + product.price * product.pivot.quantity, 0)}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-white text-xs font-semibold px-2.5 py-1 rounded ${statusColors[order.order_status] ?? "bg-gray-500"}`}>
                                                            {order.order_status ?? "Pending"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="max-h-12 overflow-y-auto">
                                                            {order.products?.length > 0 ? (
                                                                order.products.map(product => (
                                                                    <p className="py-0.5" key={`${order.id}-${product.id}`}>
                                                                        {product.name} x{product.pivot.quantity}
                                                                    </p>
                                                                ))
                                                            ) : (
                                                                <span className="text-gray-400">No products found</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-600">There's no orders yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default withAuth(Dashboard)