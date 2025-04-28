import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { imageUrl1 } from '../api/configuration';
import { toast } from "react-toastify";
import { fetchWishlists } from '../api/product';

const WishlistPage = () => {
    const navigate = useNavigate();
    const [wishlists, setWishlists] = useState([]);
    const [cookies] = useCookies();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const handleCartClick = () => {
        navigate(`/cart`);
    };

    const refreshWishlists = () => {
        setLoading(true);
        fetchWishlists(cookies.token).then((res) => {
        setWishlists(res?.data);
        setLoading(false);
        })
    };
    
    useEffect(refreshWishlists, [cookies.token]);


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
    
        if(!response.ok){
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
        if(addResponse.ok){
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

    
    const deleteProductFromWishlist = async (wishlistId, productId) => {
        const token = cookies.token;
        if (!token){
        toast.error('User is not authenticated!');
        return;
        }
    
        try {
        setLoading2(true);
        const response = await fetch(`http://localhost:8000/api/wishlists/${wishlistId}/delete-product`,{
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
        });

        const data = await response.json();
        if (response.ok){
            toast.success('Product deleted successfully!');
            refreshWishlists();
        }else{
            console.error(data.message);
            toast.error('Failed to delete product from wishlist.');
        }
        }catch (error){
            console.error(error);
            toast.error('An error occurred while deleting the product.');
        }finally{
            setLoading2(false);
          }
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className='justify-items-center'>
            <div className='w-[60%] p-5'>

            <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
                <div className="w-full h-full lg:px-10 px-5 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center text-themegreen hover:text-themeyellow transition-colors"
                    >
                            <FaArrowLeft className='mr-1 w-[20px] h-[20px]' />
                            <span className="text-base font-semibold">Back</span>
                    </button>
                    <h1 className="lg:text-2xl font-bold text-gray-900">My Wishlist</h1>
                    <button onClick={handleCartClick} className="w-[105px] items-center justify-center flex gap-1 text-themegreen hover:text-themeyellow"><h1 className="text-base font-semibold">Cart </h1><FaShoppingCart className='w-[22px] h-[22px]'/></button>
                </div>
            </div>

            <div className="p-5 pt-[100px] flex-grow overflow-auto">

                {wishlists.length > 0 ? (
                    wishlists.map(wishlist => (
                        <div key={wishlist.id} className="bg-white shadow-sm hover:shadow-md cursor-pointer rounded-lg mb-5 p-5">
                                {wishlist.products.map(product => (
                                    <div key={product.id} className="flex items-center">
                                        <div onClick={() => handleProductClick(product.id)} className="w-[190px] h-[170px] mr-4">
                                            <img
                                                src={`${imageUrl1}/${product.id}.${product.extension}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>
                                        <div onClick={() => handleProductClick(product.id)} className="flex-grow">
                                            <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                                            <p className="text-sm text-gray-500">Price: ₱{Number(product.price).toLocaleString()}</p>
                                        </div>
                                        <div className="mt-2 flex items-center justify-center">
                                            <button
                                                className={`bg-themegreen hover:bg-themeyellow hover:text-black text-white font-semibold px-4 py-2 rounded-lg transition ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                disabled={loading2}
                                                onClick={() => { addToCart(product.id) }}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className={`hover:bg-opacity-70 bg-themered text-white px-4 py-2 rounded-lg ml-2 transition ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                disabled={loading2}
                                                onClick={() => deleteProductFromWishlist(wishlist.id, product.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center mt-5">
                        <div className="text-center">
                            <p className="text-lg">You have no products in your wishlist...</p>
                        </div>
                    </div>
                )}
            </div>

            </div>
            </div>
        </div>
    );
};

export default WishlistPage;
