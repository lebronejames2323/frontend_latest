import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { index } from '../api/product';
import { useCookies } from 'react-cookie';
import { imageUrl } from '../api/configuration';
import { FaStar } from 'react-icons/fa';
import { toast } from "react-toastify";

const ProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cookies] = useCookies();
    const [loading, setLoading] = useState(false);

    const addToCart = async (productId) => {
      const token = cookies.token;
      if (!token) {
        toast.error('User is not authenticated!');
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
          toast.error('This product is already in the cart!');
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
          toast.success('Product added to cart successfully!');
        } else {
            console.error(addData.message);
            toast.error('Failed to add product to cart.');
        }
    } catch (error) {
        console.error(error);
        toast.error('An error occurred.');
    }
    };


    const addToWishlist = async (productId) => {
      const token = cookies.token;
      if (!token) {
        toast.error('User is not authenticated!');
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
    } catch (error) {
        console.error(error);
        toast.error('An error occurred.');
    }
    };

    const refreshProducts = () => {
    setLoading(true);
    const numericProductId = Number(productId);
    
      index(cookies.token).then((res) => {
        console.log("productId:", numericProductId);
        console.log("API Response:", res?.data);
    
        const filteredProduct = res?.data.filter(product => product.id === numericProductId);
        setProducts(filteredProduct);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
    };
    
    useEffect(refreshProducts, [productId]);
    
    
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">

      <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50 items-center flex justify-between lg:px-10 px-5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-themegreen hover:text-themeyellow transition-colors"
        >
          <FaArrowLeft className="mr-1 w-[20px] h-[20px]" />
          <h1 className="text-base font-semibold">Home</h1>
        </button>
        <h1 className="text-xl lg:text-3xl flex-1 font-bold capitalize text-center">
          Product Information
        </h1>
      </div>

      <div className="w-full max-w-5xl mt-[100px] p-6 bg-white rounded-lg shadow-lg border">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col lg:flex-row items-center gap-8">

            <div className="w-full lg:w-1/2">
              <img
                src={`${imageUrl}/${product.id}.${product.extension}`}
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-start gap-4">
              <h2 className="text-3xl font-bold text-black">{product.name}</h2>
              <p className="text-lg text-gray-600">{product.category?.name}</p>
              <p className="text-base text-gray-500">{product.description}</p>
              <h3 className="text-2xl font-semibold text-themegreen">${product.price}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => addToCart(product.id)}
                  className="bg-themegreen hover:bg-themeyellow text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => addToWishlist(product.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-6 py-2 rounded-lg transition"
                >
                  Add to Wishlist
                </button>
              </div>
              <div className="flex items-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-themeyellow" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    );
};

export default ProductPage;
