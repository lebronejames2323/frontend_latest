import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getAllProducts } from '../api/product-fetch';
import { useCookies } from 'react-cookie';
import { imageUrl1, url } from '../api/configuration';
import { toast } from 'react-toastify';

const OrderReview = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [starRating, setStarRating] = useState(5);
  const [loadingReview, setLoadingReview] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const refreshProducts = () => {
    setLoading(true);
    const numericProductId = Number(productId);

    getAllProducts().then((res) => {
      const filteredProduct = res?.data.filter(product => product.id === numericProductId);
      setProducts(filteredProduct);
      setLoading(false);
    }).catch(() => {
      setProducts([]);
    });
  };

  useEffect(refreshProducts, [productId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = async () => {
    setLoadingReview(true);

    const formData = new FormData();
    formData.append("products[0][id]", productId);
    formData.append("products[0][review_text]", reviewText);
    formData.append("products[0][star_rating]", starRating);

    if (image) {
      formData.append("images[0]", image);
    }

    try {
        const response = await fetch(`${url}/reviews`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error submitting review: ${response.statusText}`);
        }

        toast.success("Review submitted successfully!");
        setReviewText("");
        setStarRating(5);
        setImage(null);
    } catch (error) {
        console.error("Error submitting review:", error);
    } finally {
        setLoadingReview(false);
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">

      <div className="w-full h-[80px] bg-white shadow-lg fixed top-0 left-0 z-50">
        <div className="w-full h-full lg:px-10 px-5 flex items-center justify-between">
          <button 
              onClick={() => navigate('/')}
              className="w-[105px] items-center justify-center flex gap-1 text-themegreen hover:text-themeyellow"
          >
              <FaArrowLeft className='mr-1 w-[20px] h-[20px]' />
              <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Product Review</h1>
          <div className="w-[105px]"></div>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-[80px] p-6 bg-white rounded-lg shadow-lg">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/3">
              <img src={`${imageUrl1}/${product.id}.${product.extension}`} alt={product.name} className="w-full h-auto object-cover rounded-lg"/>
            </div>
            <div className="w-full lg:w-2/3 flex flex-col gap-3">
              <h2 className="text-4xl font-bold text-black">{product.name}</h2>
              <p className="text-lg text-gray-600">{product.category?.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-center mb-4">Share Your Experience</h2>

        <div className="flex justify-center gap-2 text-yellow-500 text-3xl">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setStarRating(star)}>
              {star <= starRating ? '⭐' : '☆'}
            </button>
          ))}
        </div>

        <textarea
          className="w-full mt-4 p-3 border rounded-md resize-none"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
        />

        <div className="mt-5 flex items-center gap-4">
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="imageUpload" />
          <label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 px-5 py-2 rounded-md hover:bg-gray-300 transition">
            📷 Upload Image
          </label>
          {image && <img src={URL.createObjectURL(image)} className="w-16 h-16 rounded-md object-cover shadow-md" />}
        </div>

        <button 
          onClick={handleReviewSubmit} 
          className={`mt-4 w-full bg-themegreen text-white font-semibold py-3 rounded-lg transition hover:bg-themeyellow hover:text-black ${loadingReview ? "opacity-50 cursor-not-allowed" : ""}`} 
          disabled={loadingReview}
        >
          {loadingReview ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default OrderReview;