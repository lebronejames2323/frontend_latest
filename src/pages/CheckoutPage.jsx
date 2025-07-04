import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaPlus, FaArrowLeft, } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { fetchCarts } from '../api/product-fetch';
import { index, getUserAddresses, deleteUserAddress } from '../api/auth';
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
      "Valenzuela City": ["Malinta", "Gen. T. de Leon", "Karuhatan"],
      "Pasig City": ["Bagong Ilog", "Manggahan", "Santolan"],
    },
  },
  "North Luzon": {
    "Ilocos Norte": {
      "Laoag City": ["Barangay 1 San Guillermo", "Barangay 2 Santa Joaquina", "Barangay 3 San Lorenzo"],
      "Batac City": ["Nangalisan", "Quiaoit", "Valdez"],
    },
    "Benguet": {
      "Baguio City": ["Asin Road", "Aurora Hill", "Pacdal"],
      "La Trinidad": ["Balili", "Buyagan", "Pico"],
    },
    "Pangasinan": {
      "Dagupan City": ["Bonuan Gueset", "Mayombo", "Tapuac"],
      "Urdaneta City": ["Anonas", "Cabuloan", "Nancayasan"],
      "Alaminos City": ["Poblacion", "Palamis", "Tawin-tawin"],
    },
    "Nueva Ecija": {
      "Cabanatuan City": ["Kapitan Pepe", "Zamora Norte", "Bitas"],
    }
  },
  "South Luzon": {
    "Camarines Sur": {
      "Naga City": ["Abella", "Tinago", "Dayangdang"],
      "Iriga City": ["San Nicolas", "La Anunciacion", "Perpetual Help"],
    },
    "Albay": {
      "Legazpi City": ["Bogtong", "Bitano", "Lapu-Lapu"],
      "Tabaco City": ["Cobo", "Baranghawon", "Oas-as"],
    },
    "Quezon": {
      "Lucena City": ["Ibabang Iyam", "Gulang-Gulang", "Ilayang Dupay"],
      "Tayabas City": ["Isabang", "Palale", "Lalo"],
    },
    "Laguna": {
      "Calamba City": ["Real", "Parian", "Canlubang"],
    }
  }
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
    switch (category) {
      case "region":
        setSelectedRegion(value);
        setSelectedProvince("");
        setSelectedCity("");
        setSelectedBarangay("");
        setSelectedCategory("province");
        break;
      case "province":
        setSelectedProvince(value);
        setSelectedCity("");
        setSelectedBarangay("");
        setSelectedCategory("city");
        break;
      case "city":
        setSelectedCity(value);
        setSelectedBarangay("");
        setSelectedCategory("barangay");
        break;
      case "barangay":
        setSelectedBarangay(value);
        setDropdownVisible(false);
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [category]: value
    }));
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
    if (userAddresses.length > 0 && !selectedAddress.address) {
      setSelectedAddress(userAddresses[0]);
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
        user_id: user?.id,
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
        refreshUsers();
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
    const fullName = selectedAddress.name;
    const phoneNumber = selectedAddress.phone;

    await placeOrder(carts, cookies, setLoading2, setLastOrder, setCarts, setShowReceipt, deliveryAddress, paymentMethod, fullName, phoneNumber);
  };


  const handleDeleteAddress = async (addressId) => {
    if (!addressId) {
      console.error("Error: Address ID is undefined");
      toast.error("Invalid address selection!");
      return;
    }

    console.log("Deleting Address ID:", addressId);

    try {
      await deleteUserAddress(addressId, cookies.token);
      toast.success("Address deleted successfully!");

      setUserAddresses((prevAddresses) => prevAddresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      toast.error("Failed to delete address!");
    }
  };


  const closeReceipt = () => {
    setShowReceipt(false);
    navigate("/");
  };


  const paymentOptions = [
    { name: "Cash on Delivery" },
    { name: "Payment Center / E-Wallet" },
    { name: "Credit / Debit Card" },
    { name: "Paypal" },
    { name: "BDO Pay" }
  ];

  const addresses = userAddresses.map(addr => ({
    id: addr.id,
    name: addr.full_name,
    phone: addr.phone_number,
    address: `${addr.street_address}, ${addr.barangay}, ${addr.city}, ${addr.province}, ${addr.region}, ${addr.postal_code}`
  }));

  return (
    <div className="max-w-4xl mx-auto">
        <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
          <div className="w-full h-full lg:px-10 px-5 flex items-center">
            <button 
            onClick={() => navigate('/')}
            className="w-[105px] items-center justify-center flex gap-1 text-themegreen hover:text-themeyellow"
            >
            <FaArrowLeft className='mr-1 w-[20px] h-[20px]'/>
            <h1 className='text-base font-semibold'>Back</h1>
            </button>
            <h1 className=" flex-grow text-center text-3xl italic font-bold capitalize">CyberDrive</h1>
            <div className="w-[105px]"></div>
          </div>
        </div>
        {/* Header */}

        <div className='p-5 pt-[120px] bg-gray-100'>
          {/* Address Section */}
          <div className="mb-6 p-4 border shadow-sm bg-white">
            <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
            <div className="mt-2 text-sm text-gray-700">
              <p><span className="font-semibold">Name:</span> {selectedAddress?.name || "No name selected"}</p>
              <p><span className="font-semibold">Phone:</span> {selectedAddress?.phone || "No phone number selected"}</p>
              <p><span className="font-semibold">Address:</span> {selectedAddress?.address || "No address selected"}</p>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <button onClick={() => setIsOpen(true)} className="px-4 py-2 text-sm font-semibold text-white bg-themegreen rounded-lg hover:bg-themeyellow hover:text-black">
                Change Address
              </button>
            </div>

            {/* Address Modal */}
            {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold text-gray-900">Select Delivery Address</h2>
                <div className="mt-4 space-y-3">
                  {addresses.length > 0 ? (
                    addresses.map((addr, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg flex justify-between items-center ${
                        selectedAddress?.address === addr.address ? "border-themegreen bg-gray-100" : "border-gray-300 bg-white"
                      }`}
                    >
                      <div onClick={() => setSelectedAddress(addr)} className="cursor-pointer flex-grow">
                        <p className="text-sm font-semibold">{addr.name}</p>
                        <p className="text-sm text-gray-700">{addr.phone}</p>
                        <p className="text-sm text-gray-700">{addr.address}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-500 hover:text-red-700 text-2xl font-bold"
                      >
                        <FaDeleteLeft  />
                      </button>
                    </div>
                  ))
                  ) : (
                    <p className="text-gray-500 text-center">No saved addresses.</p>
                  )}
                </div>
                <button
                  onClick={() => setOpenModal(true)} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-300 rounded-lg hover:bg-opacity-75 w-full justify-center"
                >
                  <FaPlus /> Add New Address
                </button>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="px-4 py-2 text-sm font-semibold bg-gray-300 rounded-lg hover:bg-opacity-75"
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
                <p>₱{(carts.flatMap(cart => cart.products).reduce((total, product) => total + product.price * product.pivot.quantity, 0) + 40).toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Shipping Fee:</p>
                <p>₱40</p>
              </div>
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <p>Shipping Discount:</p>
                <p>-₱40</p>
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between text-lg font-bold text-gray-900">
                <p>Total Payment:</p>
                <p>₱{carts.flatMap(cart => cart.products).reduce((total, product) => total + product.price * product.pivot.quantity, 0).toLocaleString()}</p>
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
              <div className="flex items-center border rounded-md bg-white p-3 text-sm">
              <input
                placeholder="Region, Province, City, Barangay"
                value={`${selectedRegion || ""}${selectedProvince ? `, ${selectedProvince}` : ""}${selectedCity ? `, ${selectedCity}` : ""}${selectedBarangay ? `, ${selectedBarangay}` : ""}`}
                onClick={() => setDropdownVisible(!dropdownVisible)}
                className="w-full focus:outline-none cursor-pointer"
                readOnly
              />

              {/* Clear Button */}
              {selectedRegion || selectedProvince || selectedCity || selectedBarangay ? (
                <button
                  onClick={() => {
                    setSelectedRegion("");
                    setSelectedProvince("");
                    setSelectedCity("");
                    setSelectedBarangay("");
                  }}
                  className="ml-2 text-gray-500 hover:text-red-500 font-bold text-base"
                >
                  x
                </button>
              ) : null}
            </div>

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

                {/* Options Panel with scrolling and min-height */}
                <div className="max-h-40 overflow-y-auto px-3 py-2 text-sm">
                  {selectedCategory === "region" &&
                    Object.keys(regionsData).map((region) => (
                      <p
                        key={region}
                        onClick={() => {
                          handleSelect("region", region);
                          setSelectedCategory("province");
                        }}
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
                        onClick={() => {
                          handleSelect("province", province);
                          setSelectedCategory("city");
                        }}
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
                        onClick={() => {
                          handleSelect("city", city);
                          setSelectedCategory("barangay");
                        }}
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
                        onClick={() => {
                          handleSelect("barangay", barangay);
                          setDropdownVisible(false);
                        }}
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