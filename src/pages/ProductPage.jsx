import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaMinus, FaPlus, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { getSpecificProduct, getProductReviews } from '../api/product-fetch';
import { useCookies } from 'react-cookie';
import { imageUrl1, imageUrl3 } from '../api/configuration';
import { addToCartWithQuantity, addToWishlist } from '../api/product-actions';
import RecommendedProducts from '../components/RecommendedProducts';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import { HiBadgeCheck } from 'react-icons/hi';
import { RiSecurePaymentLine } from 'react-icons/ri';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cookies, setCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const refreshReviews = async () => {
    const res = await getProductReviews(productId, currentPage);
    const paginated = res?.data;

    if (paginated?.data && Array.isArray(paginated.data)) {
      setReviews(paginated.data);
      setCurrentPage(paginated.current_page || 1);
      setLastPage(paginated.last_page || 1);
    } else {
      setReviews([]);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, [productId, currentPage]);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleAddToCart = async (productOrId, stock = null, quantity) => {
    console.log("cookies.token:", cookies.token);
    console.log("Product passed:", productOrId);

    if (cookies.token === "undefined" || !cookies.token) {
      console.log("Adding to cart as guest");
      await addToCartWithQuantity(productOrId?.id, cookies, setCookie, setLoading2, productOrId?.stock, quantity , productOrId?.price, productOrId?.extension, productOrId?.name);
    } else {
      console.log("Adding to cart as logged-in user");
      await addToCartWithQuantity(productOrId, cookies, setCookie, setLoading2, stock, quantity);
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

  const refreshProducts = () => {
    setLoading(true);
    getSpecificProduct(productId)
      .then((res) => {
      if (res?.data) {
        setProducts([{ 
          ...res.data, 
          averageRating: res.average_rating, 
          totalReviews: res.total_reviews 
        }]);
      } else {
        setProducts([]);
      }
      setLoading(false);
    })
    .catch(() => {
      setProducts([]);
      setLoading(false);
    });
  };

  useEffect(refreshProducts, [productId]);
  useEffect(() => setCurrentImageIdx(0), [products]);

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
      <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
      <div className="w-full h-full lg:px-10 px-5 flex items-center">
        <button 
        onClick={() => navigate('/')}
        className="w-[105px] items-center justify-center flex gap-1 text-themegreen hover:text-themeyellow"
        >
        <FaArrowLeft className='mr-1 w-[20px] h-[20px]'/>
        <h1 className='text-base font-semibold'>Back</h1>
        </button>
        <h1 className=" flex-grow text-center text-3xl italic font-bold capitalize">CyberDrive</h1>
        <button onClick={handleCartClick} className="w-[105px] justify-center items-center flex gap-1 text-themegreen hover:text-themeyellow"><h1 className="text-base font-semibold">Cart </h1><FaShoppingCart className='w-[22px] h-[22px]'/></button>
      </div>
      </div>

      <div className="w-full max-w-5xl mt-[100px] p-6 bg-white rounded-lg shadow-lg border">
        {products.map((product) => {
          const images = [
            `${imageUrl1}/${product.id}.${product.extension}`,
            product.extension2 ? `${imageUrl1}/${product.id}-0.${product.extension2}` : null,
            product.extension3 ? `${imageUrl1}/${product.id}-1.${product.extension3}` : null,
            product.extension4 ? `${imageUrl1}/${product.id}-2.${product.extension4}` : null,
            product.extension5 ? `${imageUrl1}/${product.id}-3.${product.extension5}` : null,
          ].filter(Boolean);

          return (
            <div key={product.id} className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="relative w-full flex items-center justify-center">
                  {images.length > 1 && (
                    <button
                      className="absolute left-0 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow"
                      onClick={() => setCurrentImageIdx(idx => (idx === 0 ? images.length - 1 : idx - 1))}
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <FaChevronLeft />
                    </button>
                  )}

                  <img
                    src={images[currentImageIdx]}
                    alt={product.name}
                    className="max-w-[500px] h-[500px] object-contain rounded-lg"
                  />

                  {images.length > 1 && (
                    <button
                      className="absolute right-0 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow"
                      onClick={() => setCurrentImageIdx(idx => (idx === images.length - 1 ? 0 : idx + 1))}
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <FaChevronRight />
                    </button>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-3 mt-4 flex-wrap justify-center">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`thumb-${idx}`}
                        className={`w-20 h-20 object-cover rounded-md border cursor-pointer transition-transform duration-200 ${currentImageIdx === idx ? 'border-themegreen scale-105' : 'border-gray-300 hover:scale-105'}`}
                        onClick={() => setCurrentImageIdx(idx)}
                      />
                    ))}
                  </div>
                )} 
              </div>

              <div className="p-6 lg:p-8">
                <div className="space-y-4">
                  <div>

                    <p className="mb-1 text-sm font-medium text-themegreen">
                      {product.category?.name}
                    </p>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                      {product.name}
                    </h1>

                    <div className="flex items-center bg-white">
                      <div className="flex items-center gap-1 text-lg border-black border-r pr-3">
                        <span>({products[0]?.averageRating.toFixed(1)})</span>
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`text-lg ${i < Math.round(products[0]?.averageRating) ? "text-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>

                      <div className="text-gray-600 text-lg border-black border-r px-3">
                        <span className="">{products[0]?.totalReviews} Reviews</span>
                      </div>

                      <div className="text-gray-600 text-lg pl-3">
                        <span className="">{product.purchase_count} Sold</span>
                      </div>
                    </div>

                  </div>
                  <div className="border-t pt-4">
                    <p className="text-3xl font-bold text-gray-900">
                      ₱{Number(product.price).toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Fast Shipping
                    </p>
                  </div>
                  <div className="text-base font-bold">
                    <p>Description</p>
                  </div>
                  <div className="text-base text-gray-600">
                    <p>{product.description || "No description available"}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                      <MdLocalShipping className="w-5 h-5 mb-1 text-themegreen" />
                      <p className="text-xs font-medium text-center">Free Shipping</p>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                      <HiBadgeCheck className="w-5 h-5 mb-1 text-themegreen" />
                      <p className="text-xs font-medium text-center">Good Quality</p>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                      <RiSecurePaymentLine className="w-5 h-5 mb-1 text-themegreen" />
                      <p className="text-xs font-medium text-center">Secure Payment</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        className="flex items-center justify-center w-10 h-10 text-lg hover:bg-gray-100"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="flex items-center justify-center w-10 h-10 font-medium border-x border-gray-200">
                        {quantity}
                      </span>
                      <button
                        className={`flex items-center justify-center w-10 h-10 text-lg hover:bg-gray-100 ${quantity >= product.stock ? "cursor-not-allowed" : ""}`}
                        onClick={() => setQuantity(q => q + 1)}
                        disabled={quantity >= product.stock}
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        cookies.token === "undefined" || !cookies.token
                          ? handleAddToWishlist(product)
                          : handleAddToWishlist(product.id)
                      }
                      className={`flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md ${
                        loading2 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                      }`}
                      disabled={loading2}
                    >
                      <FaRegHeart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      cookies.token === "undefined" || !cookies.token
                        ? handleAddToCart(product)
                        : handleAddToCart(product.id, product.stock, quantity)
                    }
                    className={`flex items-center justify-center w-full h-10 gap-2 text-sm font-semibold text-white rounded-md bg-themegreen ${
                      loading2 ? "opacity-50 cursor-not-allowed" : "hover:bg-themeyellow hover:text-black"
                    }`}
                    disabled={loading2}
                  >
                    <MdAddShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>

                </div>
              </div>

            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <RecommendedProducts />
      </div>

      <div className="my-8 w-full max-w-[1040px] bg-white shadow-lg rounded-lg p-4 sm:p-6 mx-auto">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6">Customer Reviews</h2>

        {reviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews yet for this product</p>
        ) : (
            reviews.map((review) => (
                <div key={review.id} className="border-t py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                                    {review.user.profile.first_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-base sm:text-lg">{review.user.profile.first_name}</p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        {new Date(review.created_at).toISOString().slice(0, 16).replace('T', ' ')}
                                    </p>
                                </div>
                            </div>

                            <p className="text-yellow-500 mt-1 sm:mt-2 text-base sm:text-lg">{'⭐'.repeat(review.products[0]?.pivot.star_rating)}</p>

                            <p className="text-gray-700 mt-2 text-sm sm:text-base">{review.products[0]?.pivot.review_text}</p>
                        </div>

                        {review.products?.some(product => product.pivot.extension) && (
                            <div className="w-24 sm:w-32 flex-shrink-0">
                                {review.products?.map((product) => 
                                    product.pivot.extension ? (
                                        <img 
                                            key={`${review.id}-${product.id}`}
                                            src={`${imageUrl3}/${review.id}-${product.id}.${product.pivot.extension}`} 
                                            alt="Review Image"
                                            className="w-full h-[80px] sm:h-[100px] object-cover border rounded-md"
                                        />
                                    ) : null
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))
        )}
        
        {lastPage > 1 && (
            <div className="flex justify-center gap-4 mt-6 sm:mt-8">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`px-2 sm:px-3 py-1 bg-themegreen text-white rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={currentPage === 1}
                >
                    <MdArrowBackIosNew />
                </button>
                <span className="text-base sm:text-lg font-semibold py-1">Page {currentPage} of {lastPage}</span>
                <button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className={`px-2 sm:px-3 py-1 bg-themegreen text-white rounded-md ${currentPage >= lastPage ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={currentPage >= lastPage}
                >
                    <MdArrowForwardIos />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
