import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { getProducts } from '../api/product-fetch';
import { getProductReviews } from '../api/product-fetch';
import { useCookies } from 'react-cookie';
import { imageUrl1, imageUrl3 } from '../api/configuration';
import { addToCart } from '../api/product-actions';
import { addToWishlist } from '../api/product-actions';
import RecommendedProducts from '../components/RecommendedProducts';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [reviews, setReviews] = useState([]);
  
    useEffect(() => {
      if (productId) {
        getProductReviews(productId).then((res) => {
          setReviews(res?.data || []);
        }).catch(error => console.error("Error fetching reviews:", error));
      }
    }, [productId]); 
    

    const handleCartClick = () => {
      navigate(`/cart`);
    };

    const handleAddToCart = async (productId, stock) => {
      await addToCart(productId, cookies, setLoading2, stock);
    };

    const handleAddToWishlist = async (productId) => {
      await addToWishlist(productId, cookies, setLoading2);
    };

    const refreshProducts = () => {
    setLoading(true);
    const numericProductId = Number(productId);
    
    getProducts().then((res) => {
  
      const filteredProduct = res?.data.filter(product => product.id === numericProductId);
      setProducts(filteredProduct);
      setLoading(false);
    }).catch((error) => {
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
          onClick={() => navigate(-1)}
          className="w-[105px] items-center justify-center flex gap-1 text-themegreen hover:text-themeyellow"
        >
          <FaArrowLeft className="mr-1 w-[20px] h-[20px]" />
          <h1 className="text-base font-semibold">Back</h1>
        </button>
        <h1 className="lg:text-2xl flex-1 font-bold capitalize text-center">
          Product Information
        </h1>
        <button onClick={handleCartClick} className="w-[105px] items-center justify-center flex gap-1 text-themegreen hover:text-themeyellow"><h1 className="text-base font-semibold">Cart </h1><FaShoppingCart className='w-[22px] h-[22px]'/></button>
      </div>

      <div className="w-full max-w-5xl mt-[100px] p-6 bg-white rounded-lg shadow-lg border">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col lg:flex-row items-center gap-8">

            <div className="w-full lg:w-1/2">
              <img
                src={`${imageUrl1}/${product.id}.${product.extension}`}
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-start gap-4">
              <h2 className="text-3xl font-bold text-black">{product.name}</h2>
              <p className="text-lg text-gray-600">{product.category?.name}</p>
              <p className="text-base text-gray-500">{product.description}</p>

              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-semibold text-themegreen">₱{Number(product.price).toLocaleString()}</h3>
                <h3 className={`text-xl font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {product.stock === 0 ? 'Out of Stock' : `(${product.stock} ${product.stock === 1 ? 'stock' : 'stocks'} left)`}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddToCart(product.id, product.stock)}
                  className={`bg-themegreen text-white font-semibold px-6 py-2 rounded-lg transition ${loading2 ? "opacity-50 cursor-not-allowed" : "hover:bg-themeyellow hover:text-black"}`} disabled={loading2}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(product.id)}
                  className={`bg-gray-200 text-black font-semibold px-6 py-2 rounded-lg transition ${loading2 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`} disabled={loading2}
                >
                  Add to Wishlist
                </button>
              </div>
              
            </div>
            
          </div>
        ))}
      </div>

      <div className="mt-8">
        <RecommendedProducts />
      </div>

      <div className="my-8 w-[1040px] bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-center mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet for this product</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b py-6">
              <div className="flex items-start gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                      {review.user.profile.first_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{review.user.profile.first_name}</p>
                      <p className="text-sm text-gray-500">{new Date(review.created_at).toISOString().slice(0, 16).replace('T', ' ')}</p>
                    </div>
                  </div>

                  <p className="text-yellow-500 mt-2 text-lg">{'⭐'.repeat(review.products[0]?.pivot.star_rating)}</p>
                  <p className="text-gray-700 mt-2">{review.products[0]?.pivot.review_text}</p>

                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold">Variation:</span> {review.products[0]?.variation || "Default"}
                  </p>
                </div>

                <div className="w-32 flex-shrink-0">
                  {review.products?.map((product) => (
                    <img 
                      key={`${review.id}-${product.id}`}
                      src={`${imageUrl3}/${review.id}-${product.id}.${product.pivot.extension}`} 
                      alt="Review Image"
                      className="w-full h-[100px] object-cover rounded-md shadow-md"
                    />
                  ))}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>    
    );
};

export default ProductPage;
