import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import withAuth from "../high-order-component/withAuth";
import { index } from '../api/product';
import { useCookies } from 'react-cookie';
import { imageUrl } from '../api/configuration';
import { FaStar } from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cookies] = useCookies();

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

    const refreshProducts = () => {
        index(cookies.token, categoryName).then((res) => {
            const filteredProducts = res?.data.filter(product => 
                product.category?.name.toLowerCase() === categoryName.toLowerCase()
            );
            setProducts(filteredProducts);
        });
    };

    useEffect(refreshProducts, [])

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
                <div className="flex items-center w-full h-full px-5 lg:px-10">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center transition-colors text-themegreen hover:text-themeyellow"
                    >
                        <FaArrowLeft className='mr-1 w-[20px] h-[20px]'/>
                        <h1 className='text-base font-semibold'>Home</h1>
                    </button>
                    <h1 className="flex-grow text-2xl font-bold text-center capitalize ">{categoryName}</h1>
                </div>
            </div>

            <div className='p-20'>
                <div className="grid items-center justify-center w-full grid-cols-1 gap-10 mt-10 lg:grid-cols-4">
                    {products.map((product) => (
                        <div key={product.id} id="product-box" className="relative flex flex-col items-center justify-center gap-2 p-4 bg-white border rounded-lg shadow-md cursor-pointer">
                            <div id="icons" className="flex justify-center items-center gap-2 absolute top-[20px]">
                                <button 
                                    className="p-3 text-white rounded-full bg-themegreen hover:bg-themeyellow hover:text-black"
                                    onClick={() => viewProduct(product.id)}
                                    aria-label="View product"
                                >
                                    <MdOutlineRemoveRedEye />
                                </button>
                                <button 
                                    className="p-3 text-white rounded-full bg-themegreen hover:bg-themeyellow hover:text-black"
                                    onClick={() => addToWishlist(product.id)}
                                    aria-label="Add to wishlist"
                                >
                                    <FaRegHeart />
                                </button>
                                <button 
                                    className="p-3 text-white rounded-full bg-themegreen hover:bg-themeyellow hover:text-black"
                                    onClick={() => addToCart(product.id)}
                                    aria-label="Add to cart"
                                >
                                    <MdAddShoppingCart />
                                </button>
                            </div>
                            
                            <button 
                                className="object-cover w-full"
                                onClick={() => viewProduct(product.id)}
                                aria-label={product.name}
                            >
                                <img
                                    src={`${imageUrl}/${product.id}.${product.extension}`}
                                    alt={product.name}
                                    className="w-full h-[250px] relative overflow-hidden mt-12 mb-5"
                                />
                            </button>
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
            </div>
        </div>
    );
};

export default withAuth(CategoryPage);
