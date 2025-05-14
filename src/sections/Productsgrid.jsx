import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { imageUrl1 } from "../api/configuration";
import { featuredProducts } from "../api/product-fetch";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../api/product-actions';
import { addToWishlist } from '../api/product-actions';

function Productsgrid() {
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const refreshProducts = () => {
    featuredProducts ().then((res) => {
    setProducts(res?.data);
    });
  };
  

  useEffect(refreshProducts, []);

  const handleAddToCart = async (productId, stock) => {
    await addToCart(productId, cookies, setLoading, stock);
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId, cookies, setLoading);
  };
  

  const handleViewMoreClick = () => {
    navigate(`/all-products`);
  };

  const handleProductClick = (productId) => {
  navigate(`/product/${productId}`);
  };

  return (
    <div id="products" className="w-full lg:px-20 px-5 py-[80px] bg-gray-100 flex flex-col justify-center items-center gap-4">
      <h1 className="text-themegreen text-2xl font-semibold">Browse Collections</h1>
      <h1 className="text-black font-semibold text-[42px] leading-[50px] text-center">Featured Products</h1>
      <div className="w-full grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-10 mt-10">
          {
          products.map((product) => (
            <div key={product.id} id="product-box" className="flex flex-col justify-center items-center gap-1 bg-white p-4 rounded-lg cursor-pointer relative shadow-md border">
              
            <div id="icons" className="flex justify-center items-center gap-2 absolute top-[20px]">
              <div onClick={() => handleProductClick(product.id)} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
              <MdOutlineRemoveRedEye />
              </div>
              <div onClick={() => { handleAddToWishlist(product.id) }} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
              <FaRegHeart />
              </div>
              <div onClick={() => { handleAddToCart(product.id, product.stock) }} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
              <MdAddShoppingCart />
              </div>
              </div>
              
              <div onClick={() => handleProductClick(product.id)} className="object-cover justify-items-center">
              <img
              src={`${imageUrl1}/${product.id}.${product.extension}`}
              alt={product.name}
              className="p-1 w-full h-[200px] relative overflow-hidden mt-12 mb-5"
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
      {products.length > 7 && (
        <button 
          onClick={handleViewMoreClick}
          className="bg-themegreen hover:bg-themeyellow text-white hover:text-black font-semibold px-8 py-3 rounded-lg mt-8">
          VIEW ALL
        </button>
      )}
    </div>
  );
}

export default Productsgrid;