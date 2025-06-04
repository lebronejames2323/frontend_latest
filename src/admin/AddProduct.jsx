import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import withAuth from "../high-order-component/withAuth"
import upload_area from '../assets/upload_area.png'
import { getCategories } from "../api/product-fetch";
import { useCookies } from "react-cookie";
import { url } from "../api/configuration";


const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [cookies] = useCookies();
  const [image1, setImage1] = useState(null);
  const [carouselImages, setCarouselImages] = useState([null, null, null, null]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("image", image1);

    carouselImages.forEach((img, index) => {
      if (img) {
        formData.append(`additional_images[${index}]`, img);
      }
    });

    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("category_id", productCategory);
    formData.append("price", productPrice);
    formData.append("stock", parseInt(productStock, 10));

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      setLoading(true);
      const response = await fetch(`${url}/products`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.token}`,
        },
        body: formData,
      });

      response.ok ? toast.success("Product added successfully!") : toast.error("Error adding product");
    } catch (error) {
      toast.error("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories().then((res) => setCategories(res?.data));
  }, []);

  const handleImageChange = (e, index) => {
    if (e.target.files[0]) {
      const updatedImages = [...carouselImages];
      updatedImages[index] = e.target.files[0];
      setCarouselImages(updatedImages);
    }
  };

  const inputStyle = {
    border: '2px solid #c2c2c2',
    outlineColor: '#000',
    borderRadius: '4px',
    padding: '8px',
    resize: "none",
    overflow: "hidden"
  };

  return (
    <div className='bg-grey-50 min-h-screen'>
      <Navbar />
      <hr />
      <div className='flex w-full'>
        <Sidebar />
        <div className='w-[70%] mx-auto ml-max[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col w-full items-start gap-3"
          >

            <p>Thumbnail Image</p>
            <label>
              <img className="w-20" src={image1 ? URL.createObjectURL(image1) : upload_area} alt="Thumbnail" />
              <input type="file" hidden onChange={(e) => setImage1(e.target.files[0])} />
            </label>

            <p>Product Images (Optional)</p>
            <div className="flex gap-3 flex-wrap">
              {carouselImages.map((img, index) => (
                <label key={index}>
                  <img className="w-20 h-20 border" src={img ? URL.createObjectURL(img) : upload_area} alt={`carousel-${index}`} />
                  <input type="file" hidden onChange={(e) => handleImageChange(e, index)} />
                </label>
              ))}
            </div>

            <div>
              <p className="mb-2">Product Name</p>
              <input
                style={inputStyle}
                className="w-full max-w-[500px] px-3 py-2"
                type="text"
                placeholder="Type Here"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="w-full">
              <p className="mb-2">Product Description</p>
              <textarea
                style={inputStyle}
                className="w-full max-w-[500px] px-3 py-2"
                placeholder="Write description here"
                value={productDescription}
                onChange={(e) => {
                  setProductDescription(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
              <div>
                <p className="mb-2">Product Category</p>
                <select
                  style={inputStyle}
                  className="w-full px-3 py-2"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="mb-2">Product Price</p>
              <input
                style={inputStyle}
                className="w-full px-3 py-2 sm:w-[120px]"
                placeholder="0"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>

            <div>
              <p className="mb-2">Product Stock</p>
              <input
                style={inputStyle}
                className="w-full px-3 py-2 sm:w-[120px]"
                type="number"
                placeholder="0"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className={`bg-themegreen text-white px-5 py-2 rounded-md hover:bg-themeyellow ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AddProduct);
