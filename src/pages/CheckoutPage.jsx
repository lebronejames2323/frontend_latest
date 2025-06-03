import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { fetchCarts } from '../api/product-fetch';
import { index, getUserAddresses } from '../api/auth';
import { placeOrder } from '../api/product-actions';
import { imageUrl1 } from "../api/configuration";
import { toast } from "react-toastify";
import { url } from "../api/configuration";
import OrderReceipt from '../components/OrderReceipt';

const regionsData = {
  "Metro Manila": {
    "Metro Manila": {
      "Marikina City": ["Barangka", "Calumpang", "Concepcion Uno", "Concepcion Dos", "Fortune"],
      "Quezon City": ["Bagong Pag-Asa", "Project 4", "Tandang Sora"],
    },
    "Cavite": {
      "Bacoor": ["Mambog", "Molino"],
      "Imus": ["Alapan", "Bayan Luma"],
    },
  },
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({
  street_address: "",
  barangay: "",
  city: "",
  province: "",
  region: "",
  postal_code: ""
});
  const [userAddresses, setUserAddresses] = useState([]);
  const [formData, setFormData] = useState({ user_id: user?.id || "", full_name: "", phone_number: "", street_address: "", region: "", province: "", city: "", barangay: "", postal_code: "", });
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("region");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (category, value) => {
    setSelectedCategory(category);
    setDropdownVisible(false);

    switch (category) {
      case "region":
        setSelectedRegion(value);
        setSelectedProvince("");
        setSelectedCity("");
        setSelectedBarangay("");
        setFormData((prev) => ({
          ...prev,
          region: value,
          province: "",
          city: "",
          barangay: ""
        }));
        break;
      case "province":
        setSelectedProvince(value);
        setSelectedCity("");
        setSelectedBarangay("");
        setFormData((prev) => ({
          ...prev,
          province: value,
          city: "",
          barangay: ""
        }));
        break;
      case "city":
        setSelectedCity(value);
        setSelectedBarangay("");
        setFormData((prev) => ({
          ...prev,
          city: value,
          barangay: ""
        }));
        break;
      case "barangay":
        setSelectedBarangay(value);
        setFormData((prev) => ({
          ...prev,
          barangay: value
        }));
        break;
      default:
        break;
    }
  };

  const token = cookies.token;

  const refreshCarts = async () => {
    setLoading(true);
    const res = await fetchCarts(cookies);
    setCarts(res?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    refreshCarts();
  }, []);


  const refreshUsers = async () => {
    if (!token || token === 'undefined' || token.trim() === '') {
      return;
    }

    try {
      const userResponse = await index(cookies.token);
      const userData = userResponse?.data || null;

      if (userData) {
        setUser(userData);

        // Fetch user addresses after setting the user
        const addressesResponse = await getUserAddresses(userData.id, token);
        console.log("User Addresses:", addressesResponse);
        setUserAddresses(Array.isArray(addressesResponse.data) ? addressesResponse.data : []);
        setFormData({
          full_name: "",
          phone_number: "",
          street_address: "",
          region: "",
          province: "",
          city: "",
          barangay: "",
          postal_code: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  useEffect(() => {
    if (userAddresses.length > 0) {
      setSelectedAddress(userAddresses[0]); // Default to first address
    }
  }, [userAddresses]);

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

       const requestData = {
        user_id: user?.id, // ✅ Ensure user_id is included
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        region: formData.region,
        province: formData.province,
        city: formData.city,
        barangay: formData.barangay,
        postal_code: formData.postal_code,
        street_address: formData.street_address,
      };

      console.log("Request Data Sent:", requestData); 

      const response = await fetch(`${url}/user/${user?.id}/addresses`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${cookies.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log("Form Data Sent:", formData);

      if (response.ok) {
        toast.success(result.message ?? "Address added successfully!");
        setOpenModal(false);
        refreshUsers(); // ✅ Fetch new addresses
      } else {
        toast.error(result.message ?? "Failed to add address!");
      }
    } catch (error) {
      toast.error("An error occurred while adding the address.");
    } finally {
      setLoading(false);
    }
  };


  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedAddress.address) {
        console.error("Error: Selected address is missing or undefined", selectedAddress);
        toast.error("Please select a valid address.");
        return;
    }

    console.log("Using Address:", selectedAddress.address);
    const deliveryAddress = selectedAddress.address;

    await placeOrder(carts, cookies, setLoading2, setLastOrder, setCarts, setShowReceipt, deliveryAddress, paymentMethod);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
  };


  const paymentOptions = [
    { name: "Cash on Delivery" },
    { name: "Payment Center / E-Wallet" },
    { name: "Credit / Debit Card" },
    { name: "Paypal" },
    { name: "BDO Pay" }
  ];

  const addresses = userAddresses.map(addr => ({
    name: addr.full_name,
    phone: addr.phone_number,
    address: `${addr.street_address}, ${addr.barangay}, ${addr.city}, ${addr.province}, ${addr.region}, ${addr.postal_code}`
  }));

  return (
    <div className="max-w-4xl mx-auto bg-gray-100 shadow-md">
      {user && userAddresses? (
      <>
        {/* Header */}
        <div className="w-full bg-gradient-to-r bg-themegreen text-white text-center py-4 shadow-md">
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="text-sm">Complete your order and enjoy your purchase!</p>
        </div>

      <div className='p-5'>
        {/* Address Section */}
        <div className="mb-6 p-4 border shadow-sm bg-white">
      <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
      <div className="mt-2 text-sm text-gray-700">
        <p><span className="font-semibold">Name:</span> {selectedAddress?.name}</p>
        <p><span className="font-semibold">Phone:</span> {selectedAddress?.phone}</p>
        <p><span className="font-semibold">Address:</span> {selectedAddress?.address}</p>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button className="px-4 py-2 text-sm font-semibold text-white bg-themegreen rounded-lg hover:bg-themeyellow hover:text-black">
          Set as Default
        </button>
        <button 
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg hover:bg-gray-200"
          onClick={() => setIsOpen(true)}
        >
          Change Address
        </button>
      </div>

      {/* MODAL FOR SELECTING ADDRESS */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold text-gray-900">Select Delivery Address</h2>
            <div className="mt-4 space-y-3">
              {addresses.length > 0 ? (
                addresses.map((addr, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedAddress?.address === addr.address ? "border-themegreen bg-gray-100" : "border-gray-300 bg-white"
                    }`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <p className="text-sm font-semibold">{addr.name}</p>
                    <p className="text-sm text-gray-700">{addr.phone}</p>
                    <p className="text-sm text-gray-700">{addr.address}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No saved addresses.</p>
              )}
            </div>
            <button
              onClick={() => setOpenModal(true)} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-300 rounded-lg hover:bg-gray-400 w-full justify-center"
            >
              <FaPlus /> Add New Address
            </button>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 text-sm font-semibold bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-semibold bg-themegreen text-white rounded-lg hover:bg-themeyellow hover:text-black"
                onClick={() => setIsOpen(false)}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

        {/* Products Section */}
        <div className="p-4 border-b border-gray-200 shadow-sm bg-white">
          <div className="grid grid-cols-3 text-sm font-medium text-gray-700 mt-2 px-2">
            <p className="text-left text-lg font-bold">Products Ordered</p>
            <p className="text-center">Unit Price</p>
            <p className="text-center">Quantity</p>
          </div>
        </div>

        {/* Scrollable Product List */}
        <div className="overflow-y-auto max-h-[200px] bg-white mb-6">
          {carts?.length > 0 && carts.map(cart => (
            <div key={cart.id}>
              {cart.products.map(product => (
                <div key={product.id} className="grid grid-cols-3 items-center gap-4 p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-[70px] h-[70px] rounded-lg overflow-hidden">
                      <img src={`${imageUrl1}/${product.id}.${product.extension}`} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</h3>
                  </div>
                  <p className="text-center text-xs sm:text-sm text-gray-800">₱{Number(product.price).toLocaleString()}</p>
                  <p className="text-center text-xs sm:text-sm text-gray-800">{product.pivot.quantity}</p>
                </div>
              ))}          
            </div>
          ))}
        </div>

        {/* Payment Method Section */}
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {paymentOptions.map((method, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  paymentMethod === method.name ? "border-themegreen bg-white" : "border-gray-300 bg-gray-50"
                } cursor-pointer hover:bg-gray-200`}
                onClick={() => setPaymentMethod(method.name)}
              >
                <p className="text-sm font-medium text-gray-800">{method.name}</p>
                {paymentMethod === method.name && <span className="text-themegreen font-bold">✔</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="p-4 border shadow-sm bg-white">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="mt-4 bg-white p-4">
            <div className="flex justify-between text-sm font-medium text-gray-800">
              <p>Merchandise Subtotal:</p>
              <p>₱180</p>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <p>Shipping Fee:</p>
              <p>₱40</p>
            </div>
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <p>Voucher Discount:</p>
              <p>-₱15</p>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between text-lg font-bold text-gray-900">
              <p>Total Payment:</p>
              <p>₱205</p>
            </div>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={loading2}
            className="w-full text-base sm:text-lg py-2 sm:py-3 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading2 ? "Processing..." : "Place order"}
          </button>
        </div>
      </div>
      </>
      ) : (
      <button 
          onClick={() => navigate('/login')}
          className="w-full text-base sm:text-lg py-2 sm:py-3 font-semibold text-white transition-colors rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
          Place order
      </button>
      )}


      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
    <h2 className="text-lg font-bold text-gray-900">Add New Address</h2>
    <form onSubmit={onFormSubmit} className="flex flex-col gap-5 mt-5">
      
      {/* Full Name */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name || ""}
          onChange={handleInputChange}
          className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
        />

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number || ""}
          onChange={handleInputChange}
          className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
        />
      </div>

      {/* Address Fields */}
      <div className="relative w-full">
  {/* Input field */}
  <input
    readOnly
    value={`${selectedRegion || ""}${selectedProvince ? `, ${selectedProvince}` : ""}${selectedCity ? `, ${selectedCity}` : ""}${selectedBarangay ? `, ${selectedBarangay}` : ""}`}
    onClick={() => setDropdownVisible(!dropdownVisible)}
    className="w-full p-3 border border-gray-300 rounded-sm bg-white text-sm focus:outline-none cursor-pointer"
  />

  {/* Dropdown */}
  {dropdownVisible && (
    <div className="absolute top-12 left-0 w-full bg-white shadow-md rounded-md z-10">
      
      {/* Tab Navigation */}
      <div className="flex border-b">
        {["region", "province", "city", "barangay"].map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-1 text-sm py-2 border-b-2 transition-all ${
              selectedCategory === category
                ? "border-themegreen text-themegreen"
                : "border-transparent text-gray-600"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Options Panel */}
      <div className="max-h-64 overflow-y-auto px-3 py-2 text-sm">
        {selectedCategory === "region" &&
          Object.keys(regionsData).map((region) => (
            <p
              key={region}
              onClick={() => handleSelect("region", region)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedRegion === region ? "text-themegreen font-semibold" : ""
              }`}
            >
              {region}
            </p>
          ))}

        {selectedCategory === "province" &&
          selectedRegion &&
          Object.keys(regionsData[selectedRegion]).map((province) => (
            <p
              key={province}
              onClick={() => handleSelect("province", province)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedProvince === province ? "text-themegreen font-semibold" : ""
              }`}
            >
              {province}
            </p>
          ))}

        {selectedCategory === "city" &&
          selectedRegion &&
          selectedProvince &&
          Object.keys(regionsData[selectedRegion][selectedProvince]).map((city) => (
            <p
              key={city}
              onClick={() => handleSelect("city", city)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedCity === city ? "text-themegreen font-semibold" : ""
              }`}
            >
              {city}
            </p>
          ))}

        {selectedCategory === "barangay" &&
          selectedRegion &&
          selectedProvince &&
          selectedCity &&
          regionsData[selectedRegion][selectedProvince][selectedCity].map((barangay) => (
            <p
              key={barangay}
              onClick={() => handleSelect("barangay", barangay)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedBarangay === barangay ? "text-themegreen font-semibold" : ""
              }`}
            >
              {barangay}
            </p>
          ))}
      </div>
    </div>
  )}
</div>

      {/* Postal Code */}
      <input
        name="postal_code"
        placeholder="Postal Code"
        value={formData.postal_code || ""}
        onChange={handleInputChange}
        className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
      />

      {/* Street Name / House Number */}
      <input
        name="street_address"
        placeholder="Street Name, Building, House No."
        value={formData.street_address || ""}
        onChange={handleInputChange}
        className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
      />

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={() => setOpenModal(false)}
          className="px-4 py-2 text-sm font-semibold bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-base py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow hover:text-black focus:outline-none focus:ring-2${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  </div>
</div>
      )}
      {showReceipt && lastOrder && (
                <OrderReceipt order={lastOrder} onClose={closeReceipt} />
            )}
    </div>
  )
}

export default CheckoutPage