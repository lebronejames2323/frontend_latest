import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { imageUrl } from "../api/configuration";
import { toast } from "react-toastify";
import { index } from "../api/product";
import { useCookies } from "react-cookie";

function Productsgrid() {
  const [showAll, setShowAll] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  
  const refreshProducts = () => {
  index(cookies.token).then((res) => {
  setProducts(res?.data);
  });
  };

  useEffect(refreshProducts, []);

  useEffect(() => {
  AOS.init({
  offset: 100,
  duration: 500,
  easing: 'ease-in-out',
  });

  AOS.refresh();
  }, []);

  const addToCart = async (productId) => {
    const token = cookies.token;
    if (!token) {
      alert('User is not authenticated!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/carts', {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch cart");
      }

      const res = await response.json();
      const carts = res?.data;

      const isProductInCart = carts.some(cart =>
          cart.products.some(product => product.id === productId)
      );

      if (isProductInCart) {
          alert('This product is already in the cart!');
          return;
      }

      const addResponse = await fetch('http://localhost:8000/api/carts', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
              products: [{ id: productId, quantity: 1 }],
          }),
      });

      const addData = await addResponse.json();
      if (addResponse.ok) {
          alert('Product added to cart successfully!');
      } else {
          console.error(addData.message);
          alert('Failed to add product to cart.');
      }
  } catch (error) {
      console.error(error);
      alert('An error occurred.');
  }
  };


  const addToWishlist = async (productId) => {
    const token = cookies.token;
    if (!token) {
      alert('User is not authenticated!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/wishlists', {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch cart");
      }

      const res = await response.json();
      const carts = res?.data;

      const isProductInCart = carts.some(cart =>
          cart.products.some(product => product.id === productId)
      );

      if (isProductInCart) {
          alert('This product is already in the wishlist!');
          return;
      }

      const addResponse = await fetch('http://localhost:8000/api/wishlists', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
              products: [{ id: productId, quantity: 1 }],
          }),
      });

      const addData = await addResponse.json();
      if (addResponse.ok) {
          alert('Product added to wishlist successfully!');
      } else {
          console.error(addData.message);
          alert('Failed to add product to cart.');
      }
  } catch (error) {
      console.error(error);
      alert('An error occurred.');
  }
  };
  

  const handleViewMoreClick = () => {
    setShowAll(!showAll);
    if(!showAll){
    setVisibleProducts(products.length);
    }else
    {
    setVisibleProducts(8);
    }
  };

  return (
    <div id="products" className="w-full lg:px-20 px-5 py-[80px] bg-gray-100 flex flex-col justify-center items-center gap-4">
      <h1 data-aos="zoom-in" data-aos-delay="100" className="text-themegreen text-2xl font-semibold">Browse Collections</h1>
      <h1 data-aos="zoom-in" data-aos-delay="200" className="text-black font-semibold text-[42px] leading-[50px] text-center">Featured Products</h1>
      <div data-aos="zoom-in" data-aos-delay="300" className="w-full grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-10 mt-10">
          {
          products.slice(0, visibleProducts).map((product) => (
            <div key={product.id} id="product-box" className="flex flex-col justify-center items-center gap-1 bg-white p-4 rounded-lg cursor-pointer relative shadow-md border">
              
            <div id="icons" className="flex justify-center items-center gap-2 absolute top-[20px]">
              <div className="bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white">
              <MdOutlineRemoveRedEye />
              </div>
              <div className="bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white">
              <FaRegHeart onClick={() => { addToWishlist(product.id) }}/>
              </div>
              <div className="bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white">
              <MdAddShoppingCart onClick={() => { addToCart(product.id) }}/>
              </div>
              </div>
              
              <div className="object-cover">
              <img
              src={`${imageUrl}/${product.id}.${product.extension}`}
              alt={product.name}
              className="p-2 w-full h-[250px] relative overflow-hidden mt-12 mb-5"
              />
              </div>
              <p className='text-lg text-gray-500 font-semibold'>{product.category?.name}</p>
              <h3 className='text-xl text-black font-semibold'>{product.name}</h3>
              <h4 className='text-lg text-themegreen font-semibold'>${product.price}</h4>

              <div className="w-full mt-2">
              <hr />
              <div className="flex justify-between items-center gap-6 mt-3">
                  <div className="flex justify-start items-center gap-1">
                  <FaStar className="text-themeyellow" />
                  <FaStar className="text-themeyellow" />
                  <FaStar className="text-themeyellow" />
                  <FaStar className="text-themeyellow" />
                  <FaStar className="text-themeyellow" />
                  </div>
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-[13px] font-semibold">SALE 14%</button>
              </div>
              </div>
            </div>
          ))
          }
      </div>
      {products.length > 8 && (
        <button 
          onClick={handleViewMoreClick} 
          className="bg-themegreen hover:bg-themeyellow text-white hover:text-black font-semibold px-8 py-3 rounded-lg mt-8">
          {showAll ? "VIEW LESS" : "VIEW MORE"}
        </button>
      )}
    </div>
  );
}

export default Productsgrid;
