import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart, FaStar } from 'react-icons/fa';
import { MdOutlineRemoveRedEye, MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { imageUrl1 } from "../api/configuration";
import { getProducts, getProductRating } from "../api/product-fetch";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../api/product-actions';
import { addToWishlist } from '../api/product-actions';
import { FaShoppingCart, FaArrowLeft, FaSearch } from 'react-icons/fa';

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [cookies, setCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({ search: "", category: "", });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleFilterChange = (e) => {
    setSearchFilters({
      search: e.target.value,
    });
    setCurrentPage(1);
  };

  useEffect(() => {
    refreshProducts();
  }, [currentPage, searchFilters]);

  const refreshProducts = async () => {
  try {
    const productRes = await getProducts({ page: currentPage, ...searchFilters });

    if (productRes?.data) {
      const ratingsRes = await getProductRating();

      const ratingsMap = Object.fromEntries(
        ratingsRes.map(rating => [rating.product_id, rating.average_rating])
      );

      const updatedProducts = productRes.data.map(product => ({
        ...product,
        averageRating: ratingsMap[product.id] || 0,
      }));

      setRatings(ratingsMap);
      setProducts(updatedProducts);
      setPagination(productRes?.pagination);
    }
  } catch (error) {
    console.error("Error fetching products or ratings:", error);
  }
};

  const handleAddToCart = async (productOrId, stock = null) => {
    console.log("cookies.token:", cookies.token);
    console.log("Product passed:", productOrId);

    if (cookies.token === "undefined" || !cookies.token) {
      console.log("Adding to cart as guest");
      await addToCart(productOrId?.id, cookies, setCookie, setLoading2, productOrId?.stock, productOrId?.price, productOrId?.extension, productOrId?.name);
    } else {
      console.log("Adding to cart as logged-in user");
      await addToCart(productOrId, cookies, setCookie, setLoading2, stock);
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

  const handleCartClick = () => {
    navigate(`/cart`);
  };

  const navigate = useNavigate();
  const handleProductClick = (productId) => {
  navigate(`/product/${productId}`);
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
    <div className="w-full lg:px-20 px-5 py-[80px] bg-gray-100 flex flex-col justify-center items-center gap-4">
      <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
        <div className="w-full h-full px-20 flex items-center justify-between">
          <h1 title="Home" onClick={() => navigate("/")} className='text-black font-bold lg:text-[30px] text-3xl italic cursor-pointer hidden lg:block'>CyberDrive</h1>
            <div className="flex items-center pl-5 gap-5">
              <div className={`flex items-center px-4 py-2.5 bg-gray-50 rounded-xl transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-themegreen' : 'hover:bg-gray-100'}`}>
                <input
                  type="text"
                  name="name"
                  placeholder="Search by name"
                  onChange={handleFilterChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full text-sm bg-transparent outline-none"
                />
                <FaSearch className="w-5 h-5" />
              </div>
              <button onClick={handleCartClick} className="w-[105px] justify-center items-center flex gap-1 text-themegreen hover:text-themeyellow"><h1 className="text-base font-semibold">Cart </h1><FaShoppingCart className='w-[22px] h-[22px]'/></button>
            </div>
        </div>
      </div>
      {products.length > 0 ? (
      <div className="w-full grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-10 mt-10">
        {products.map((product) => (
          <div key={product.id} id="product-box" className="flex flex-col justify-center items-center gap-1 bg-white p-4 rounded-lg cursor-pointer relative shadow-md border">
            
          <div id="icons" className="flex justify-center items-center gap-2 absolute top-[20px]">
            <div onClick={() => handleProductClick(product.id)} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
            <MdOutlineRemoveRedEye />
            </div>
            <div onClick={() => { cookies.token === "undefined" || !cookies.token ? handleAddToWishlist(product) : handleAddToWishlist(product.id) }} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
            <FaRegHeart />
            </div>
            <div onClick={() => { cookies.token === "undefined" || !cookies.token ? handleAddToCart(product) : handleAddToCart(product.id, product.stock) }} className={`bg-themegreen hover:bg-themeyellow hover:text-black rounded-full p-3 text-white ${loading2 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading2}>
            <MdAddShoppingCart />
            </div>
            </div>
            
            <div onClick={() => handleProductClick(product.id)} className="object-cover justify-items-center">
            <img
            src={`${imageUrl1}/${product.id}.${product.extension}`}
            alt={product.name}
            className="p-2 w-full h-[250px] relative overflow-hidden mt-12 mb-5"
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
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-600 mt-10">
          <p className="text-center text-lg font-medium">No products found</p>
        </div>
      )}
      {pagination?.last_page > 1 && (
        <div className="flex justify-center gap-4 mt-6 sm:mt-8">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className={`px-2 sm:px-3 py-1 bg-gray-400 text-white rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentPage === 1}
          >
            <MdArrowBackIosNew />
          </button>

          <span className="text-base sm:text-lg font-semibold py-1">
            Page {currentPage} of {pagination?.last_page}
          </span>

          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className={`px-2 sm:px-3 py-1 bg-gray-400 text-white rounded-md ${currentPage >= pagination?.last_page ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentPage >= pagination?.last_page}
          >
            <MdArrowForwardIos />
          </button>
        </div>
      )}
    </div>
  );
}

export default AllProductsPage;