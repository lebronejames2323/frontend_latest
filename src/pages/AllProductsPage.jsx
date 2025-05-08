import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { imageUrl1 } from "../api/configuration";
import { getProducts } from "../api/product-fetch";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../api/product-actions';
import { addToWishlist } from '../api/product-actions';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  
  const refreshProducts = () => {
  setLoading(true);
  getProducts().then((res) => {
  setProducts(res?.data);
  setLoading(false);
  });
  };

  useEffect(refreshProducts, []);

  const handleAddToCart = async (productId, stock) => {
    await addToCart(productId, cookies, setLoading2, stock);
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId, cookies, setLoading2);
  };

  const handleCartClick = () => {
    navigate(`/cart`);
  };

  const navigate = useNavigate();
  const handleProductClick = (productId) => {
  navigate(`/product/${productId}`);
  };

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

  return (
    <div className="w-full lg:px-20 px-5 py-[80px] bg-gray-100 flex flex-col justify-center items-center gap-4">
        <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
            <div className="w-full h-full lg:px-10 px-5 flex items-center">
                <button 
                onClick={() => navigate('/')}
                className="flex items-center text-themegreen hover:text-themeyellow transition-colors"
                >
                <FaArrowLeft className='mr-1 w-[20px] h-[20px]'/>
                <h1 className='text-base font-semibold'>Back</h1>
                </button>
                <h1 className=" flex-grow text-center text-2xl font-bold capitalize">All Products</h1>
                <button onClick={handleCartClick} className="w-[105px] justify-center items-center flex gap-1 text-themegreen hover:text-themeyellow"><h1 className="text-base font-semibold">Cart </h1><FaShoppingCart className='w-[22px] h-[22px]'/></button>
            </div>
        </div>
        <div className="w-full grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-10 mt-10">
          {
          products.map((product) => (
            <div key={product.id} id="product-box" className="flex flex-col justify-center items-center gap-1 bg-white p-4 rounded-lg cursor-pointer relative shadow-md border">
              
            <div id="icons" className="flex justify-center items-center gap-2 absolute top-[20px]">
              <div onClick={() => handleProductClick(product.id)} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
              <MdOutlineRemoveRedEye />
              </div>
              <div onClick={() => { handleAddToWishlist(product.id) }} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
              <FaRegHeart />
              </div>
              <div onClick={() => { handleAddToCart(product.id, product.stock) }} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
              <MdAddShoppingCart />
              </div>
              </div>
              
              <div onClick={() => handleProductClick(product.id)} className="object-cover justify-items-center">
              <img
              src={`${imageUrl1}/${product.id}.${product.extension}`}
              alt={product.name}
              className="p-2 w-full h-[250px] relative overflow-hidden mt-12 mb-5"
              />
              
              <p className='text-lg text-gray-500 font-semibold'>{product.category?.name}</p>
              <h3 className='text-xl text-black font-semibold'>{product.name}</h3>
              <h4 className='text-lg text-themegreen font-semibold'>₱{Number(product.price).toLocaleString()}</h4>
              </div>

              <div onClick={() => handleProductClick(product.id)} className="w-full mt-2">
              <hr />
              <div className="flex justify-between items-center gap-6 mt-3">
                <h3 className={`text-base font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {product.stock === 0 ? 'Out of Stock' : `(${product.stock} ${product.stock === 1 ? 'stock' : 'stocks'} left)`}
                </h3>
                <button className="bg-themeyellow text-black px-4 py-2 rounded-lg text-[13px] font-semibold">HOT ITEM</button>
              </div>
              </div>
            </div>
          ))
          }
        </div>
    </div>
  );
}

export default AllProductsPage;