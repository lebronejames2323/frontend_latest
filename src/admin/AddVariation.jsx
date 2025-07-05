import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import withAuth from "../high-order-component/withAuth"
import { getAllProducts } from "../api/product-fetch";
import { useCookies } from "react-cookie";
import { url } from "../api/configuration";



const AddVariation = () => {
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  const [productName, setProductName] = useState('');
  const [productList, setProductList] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("product_id", productList);
    formData.append("variation_name", productName);
    formData.append("variation_price", productPrice);
    formData.append("variation_stock", parseInt(productStock, 10));
    
    try{
    setLoading(true);
    const response = await fetch(`${url}/variations/post`,{
      method: "POST",
      headers:{
      Accept: "application/json",
      Authorization: `Bearer ${cookies.token}`,
    },
      body: formData,
    });

    if (response.ok){
      toast.success("Product Variation added successfully!");
    }else{
      const errorData = await response.json();
      toast.error(`Error adding product: ${errorData.message}`);
    }
    }catch (error){
      toast.error("An error occurred while adding the product variation.");
    }finally{
      setLoading(false);
    }
  };
  
  
  const refreshProducts = () => {
  getAllProducts().then((res) => {
  setProducts(res?.data);
  });
  };
  
  useEffect(refreshProducts, []);


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
      <hr/>
      <div className='flex w-full'>
        <Sidebar/>
        <div className='w-[70%] mx-auto ml-max[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col w-full items-start gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
            <div>
            <p className="mb-2">Product List</p>
            <select
            style={inputStyle}
              className="w-full px-3 py-2"
              value={productList}
              onChange={(e) => setProductList(e.target.value)}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            </div>
            </div>
            <div>
            <p className="mb-2">Product name</p>
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
              className={`bg-themegreen text-white px-5 py-2 rounded-md hover:bg-themeyellow ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}
            >
              Add
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withAuth(AddVariation)