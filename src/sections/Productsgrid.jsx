import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart, FaStar } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { imageUrl1 } from "../api/configuration";
import { featuredProducts, getProductRating } from "../api/product-fetch";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../api/product-actions';
import { addToWishlist } from '../api/product-actions';

function Productsgrid() {
  const [products, setProducts] = useState([]);
  const [cookies, setCookie] = useCookies(["guestCart", "guestWishlist"]);
  const [loading2, setLoading2] = useState(false);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();
  
  const refreshProducts = async () => {
    setLoading2(true);

    try {
      const productRes = await featuredProducts();
      const ratingsRes = await getProductRating();

      if (productRes?.data && ratingsRes) {
        const ratingsMap = Object.fromEntries(
          ratingsRes.map(rating => [rating.product_id, rating.average_rating])
        );

        const updatedProducts = productRes.data.map(product => ({
          ...product,
          averageRating: ratingsMap[product.id] || 0,
        }));

        setRatings(ratingsMap);
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error fetching products or ratings:", error);
    }

    setLoading2(false);
  };
  

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleAddToCart = async (productOrId, stock = null, price = null) => {
    console.log("cookies.token:", cookies.token);
    console.log("Product passed:", productOrId);

    if (cookies.token === "undefined" || !cookies.token) {
      console.log("Adding to cart as guest");
      await addToCart(productOrId?.id, cookies, setCookie, setLoading2, productOrId?.stock, productOrId?.price, productOrId?.extension, productOrId?.name);
    } else {
      console.log("Adding to cart as logged-in user");
      await addToCart(productOrId, cookies, setCookie, setLoading2, stock, price);
    }
  };

  const handleAddToWishlist = async (productOrId) => {
    console.log("cookies.token:", cookies.token);
    console.log("Product passed:", productOrId);

    if (cookies.token === "undefined" || !cookies.token) {
      console.log("Adding to wishlist as guest");
      await addToWishlist(productOrId?.id, cookies, setCookie, setLoading2, productOrId?.stock, productOrId?.price, productOrId?.extension, productOrId?.name);
      
    } else {
      console.log("Adding to wishlist as logged-in user");
      await addToWishlist(productOrId, cookies, setCookie, setLoading2);
    }
  };

  

  const handleViewMoreClick = () => {
    navigate(`/all-products`);
  };

  const handleProductClick = (productId) => {
  navigate(`/product/${productId}`);
  };


  return (
    <div id="featured" className="w-full lg:px-20 px-5 py-[80px] bg-gray-100 flex flex-col justify-center items-center gap-4">
      <h1 className="text-themegreen text-2xl font-semibold">Browse Collections</h1>
      <h1 className="text-black font-semibold text-[42px] leading-[50px] text-center">Featured Products</h1>
      <div className="w-full grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-10 mt-10">
          {
          products.map((product) => (
            <div key={product.id} id="product-box" className="flex flex-col justify-center items-center gap-1 bg-white p-4 rounded-lg cursor-pointer relative shadow-md border">
              
            <div id="icons" className="flex justify-center items-center gap-2 absolute top-[20px]">
              <div onClick={() => handleProductClick(product.id)} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
              <MdOutlineRemoveRedEye />
              </div>
              <div onClick={() => { cookies.token === "undefined" || !cookies.token 
                ? handleAddToWishlist(product)
                : handleAddToWishlist(product.id)
               }}  
              className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
              <FaRegHeart />
              </div>
              <div onClick={() => { cookies.token === "undefined" || !cookies.token
                ? handleAddToCart(product)
                : handleAddToCart(product.id, product.stock, product.price)
              }} 
              className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
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
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-xl ${i < Math.round(ratings[product.id] || 0) ? "text-themeyellow" : "text-gray-300"}`} />
                  ))}
                  {/* <p>{product.averageRating ?? "No rating available"}</p> */}
                </div>
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