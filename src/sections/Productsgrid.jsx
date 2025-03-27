import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { imageUrl } from "../api/configuration";
import { index } from "../api/product";
import { useCookies } from "react-cookie";

function Productsgrid() {
  const [showAll, setShowAll] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  const navigate = useNavigate();
  
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
    try {
      const response = await fetch('http://localhost:8000/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          products: [{ id: productId, quantity: 1 }],
        }),
      });

      if (response.ok) {
        alert('Product added to wishlist successfully!');
      } else {
        throw new Error('Failed to add to wishlist');
      }
    } catch (error) {
      alert('Error adding to wishlist');
      console.error('Error:', error);
    }
  };

  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewMoreClick = () => {
    setShowAll(!showAll);
    if(!showAll) {
      setVisibleProducts(products.length);
    } else {
      setVisibleProducts(8);
    }
  };

  return (
    <div id="products" className="w-full lg:px-20 px-5 py-[80px] bg-gray-100 flex flex-col justify-center items-center gap-4">
      <h1 data-aos="zoom-in" data-aos-delay="100" className="text-2xl font-semibold text-themegreen">Browse Collections</h1>
      <h1 data-aos="zoom-in" data-aos-delay="200" className="text-black font-semibold text-[42px] leading-[50px] text-center">Featured Products</h1>
      <div data-aos="zoom-in" data-aos-delay="300" className="grid items-center justify-center w-full grid-cols-1 gap-10 mt-10 lg:grid-cols-4">
        {products.slice(0, visibleProducts).map((product) => (
          <div key={product.id} id="product-box" className="relative flex flex-col items-center justify-center gap-1 p-4 bg-white border rounded-lg shadow-md cursor-pointer">
            <div id="icons" className="flex justify-center items-center gap-2 absolute top-[20px]">
              <button 
                className="p-3 text-white rounded-full bg-themegreen hover:bg-themeyellow hover:text-black"
                onClick={() => viewProduct(product.id)}
              >
                <MdOutlineRemoveRedEye />
              </button>
              <button 
                className="p-3 text-white rounded-full bg-themegreen hover:bg-themeyellow hover:text-black"
                onClick={() => addToWishlist(product.id)}
              >
                <FaRegHeart />
              </button>
              <button 
                className="p-3 text-white rounded-full bg-themegreen hover:bg-themeyellow hover:text-black"
                onClick={() => addToCart(product.id)}
              >
                <MdAddShoppingCart />
              </button>
            </div>
            
            <div className="object-cover" onClick={() => viewProduct(product.id)}>
              <img
                src={`${imageUrl}/${product.id}.${product.extension}`}
                alt={product.name}
                className="p-2 w-full h-[250px] relative overflow-hidden mt-12 mb-5"
              />
            </div>
            <p className='text-lg font-semibold text-gray-500'>{product.category?.name}</p>
            <h3 className='text-xl font-semibold text-black'>{product.name}</h3>
            <h4 className='text-lg font-semibold text-themegreen'>₱{Number(product.price).toFixed(2)}</h4>

            <div className="w-full mt-2">
              <hr />
              <div className="flex items-center justify-between gap-6 mt-3">
                <div className="flex items-center justify-start gap-1">
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
        ))}
      </div>
      {products.length > 8 && (
        <button 
          onClick={handleViewMoreClick} 
          className="px-8 py-3 mt-8 font-semibold text-white rounded-lg bg-themegreen hover:bg-themeyellow hover:text-black"
        >
          {showAll ? "VIEW LESS" : "VIEW MORE"}
        </button>
      )}
    </div>
  );
}

export default Productsgrid;
