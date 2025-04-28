import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { index } from '../api/product';
import { useCookies } from 'react-cookie';
import { imageUrl1 } from '../api/configuration';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { toast } from "react-toastify";

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cookies] = useCookies();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const handleCartClick = () => {
      navigate(`/cart`);
    };

    const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    };


    const addToCart = async (productId) => {
      const token = cookies.token;
      if (!token) {
        toast.error('User is not authenticated!');
        return;
      }
    
      try {
      setLoading2(true);
      const response = await fetch('http://localhost:8000/api/carts',{
        headers: {
        'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch cart");
      }

      const res = await response.json();
      const carts = res?.data;

      const isProductInCart = carts.some(cart =>
        cart.products.some(product => product.id === productId)
      );

      if (isProductInCart){
        toast.error('This product is already in the cart!');
        return;
      }

      const addResponse = await fetch('http://localhost:8000/api/carts',{
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
      if (addResponse.ok){
        toast.success('Product added to cart successfully!');
      }else{
      console.error(addData.message);
      toast.error('Failed to add product to cart.');
      }
    }catch (error){
      console.error(error);
      toast.error('An error occurred.');
    }finally{
      setLoading2(false);
    }
    };


    const addToWishlist = async (productId) => {
    const token = cookies.token;
    if (!token) {
      toast.error('User is not authenticated!');
      return;
    }
  
    try {
    setLoading2(true);
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
      toast.error('This product is already in the wishlist!');
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
      toast.success('Product added to wishlist successfully!');
    } else {
        console.error(addData.message);
        toast.error('Failed to add product to cart.');
    }
    }catch (error){
      console.error(error);
      toast.error('An error occurred.');
    }finally{
      setLoading2(false);
    }
    };


    const refreshProducts = () => {
    setLoading(true);
    index(cookies.token, categoryName).then((res) => {
    const filteredProducts = res?.data.filter(product => 
    product.category?.name.toLowerCase() === categoryName.toLowerCase()
    );
    setProducts(filteredProducts);
    setLoading(false);
    });
    };
    useEffect(refreshProducts, [])

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
        <div className="min-h-screen bg-gray-100">
            <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
            <div className="w-full h-full lg:px-10 px-5 flex items-center">
                <button 
                onClick={() => navigate('/')}
                className="flex items-center text-themegreen hover:text-themeyellow transition-colors"
                >
                <FaArrowLeft className='mr-1 w-[20px] h-[20px]'/>
                <h1 className='text-base font-semibold'>Back</h1>
                </button>
                <h1 className=" flex-grow text-center text-2xl font-bold capitalize">{categoryName}</h1>
                <button onClick={handleCartClick} className="w-[105px] justify-center items-center flex gap-1 text-themegreen hover:text-themeyellow"><h1 className="text-base font-semibold">Cart </h1><FaShoppingCart className='w-[22px] h-[22px]'/></button>
            </div>
            </div>

            <div className='p-20'>
            <div className="w-full grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-10 mt-10">
                    {
                      products.map((product) => (
                        <div key={product.id} id="product-box" className="flex flex-col justify-center items-center gap-2 bg-white p-4 rounded-lg cursor-pointer relative shadow-md border">
                          
                          <div id="icons" className="flex justify-center items-center gap-2 absolute top-[20px]">
                            <div onClick={() => handleProductClick(product.id)} className="bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white">
                              <MdOutlineRemoveRedEye className={`${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}/>
                            </div>
                            <div onClick={() => { addToWishlist(product.id) }} className="bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white">
                              <FaRegHeart className={`${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}/>
                            </div>
                            <div onClick={() => { addToCart(product.id) }} className="bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white">
                              <MdAddShoppingCart className={`${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}/>
                            </div>
                          </div>
                          
                          <div onClick={() => handleProductClick(product.id)} className="object-cover justify-items-center">
                          <img
                            src={`${imageUrl1}/${product.id}.${product.extension}`}
                            alt={product.name}
                            className="w-full h-[250px] relative overflow-hidden mt-12 mb-5"
                          />
                          
                          <p className='text-lg text-gray-500 font-semibold'>{product.category?.name}</p>
                          <h3 className='text-xl text-black font-semibold'>{product.name}</h3>
                          <h4 className='text-lg text-themegreen font-semibold'>₱{Number(product.price).toLocaleString()}</h4>
                          </div>
            
                          <div onClick={() => handleProductClick(product.id)} className="w-full mt-2">
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
                  </div>
        </div>
    );
};

export default CategoryPage;
