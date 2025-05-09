import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomModal from "../components/Modal";
import { imageUrl1 } from "../api/configuration";
import { getProducts } from "../api/product-fetch";
import withAuth from "../high-order-component/withAuth";
import { url } from "../api/configuration";
import { getCategories } from "../api/product-fetch";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateData, setUpdateData] = useState({
  name: "",
  description: "",
  price: "",
  category_id: "",
  stock: "",
  image: null,
  });

  const refreshProducts = () => {
    getProducts().then((res) => {
    setProducts(res?.data);
    });
  };

  useEffect(refreshProducts, []);

  const refreshCategories = () => {
    getCategories().then((res) => {
    setCategories(res?.data);
    });
  };
  
  useEffect(refreshCategories, []);

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setUpdateData({
    name: product.name,
    description: product.description || "",
    price: product.price,
    category_id: product.category_id,
    stock: product.stock,
    image: null,
    });
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
    ...prev,
    [name]: value,
    }));
  };

  const onUpdateFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("name", updateData.name);
    formData.append("description", updateData.description);
    formData.append("price", updateData.price);
    formData.append("category_id", updateData.category_id);
    formData.append("stock", updateData.stock);
    if (updateData.image) {
      formData.append("image", updateData.image);
    }

    const response = await fetch(
    `${url}/products/${selectedProduct.id}`,
    {
      method: "POST",
      headers: {
      Authorization: `Bearer ${cookies.token}`,
      },
      body: formData,
    }
    );

    const result = await response.json();
    if (response.ok){
      toast.success(result.message || "Product updated successfully!");
      closeUpdateModal();
      refreshProducts();
    }else{
      toast.error(result.message || "Failed to update product!");
    }
    }catch (error){
    toast.error("An error occurred while updating the product.");
    }finally{
    setLoading(false);
    }
    };

  const deleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const response = await fetch(`${url}/products/${productId}`,{
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
        },
      });

      const data = await response.json();
      if (response.ok){
        toast.success("Product deleted successfully!");
      }else{
        toast.error("Failed to delete the product.");
      }
      }
    };

  return (
    <div className="bg-grey-50 min-h-screen">
      <Navbar className="fixed top-0 left-0 w-full z-50" />
      <hr />
      <div className="flex w-full">
        <Sidebar className="fixed top-[50px] left-0 bottom-0 w-[18%] z-40" />
        <div className="w-[70%] mx-auto ml-max[max(5vw,25px)] my-8 text-gray-600 text-base">
          <p className="mb-2">All Items</p>
          <div className="mb-10">
          <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center py-1 px-2">
            <b className="text-center">Image</b>
            <b className="pl-4">Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Stock</b>
            <b className="text-center">Action</b>
          </div>
          {products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm hover:bg-gray-100"
            >
              <div className="justify-items-center">
                <img
                  className="w-1/2 h-auto object-contain rounded-lg"
                  src={`${imageUrl1}/${product.id}.${product.extension}`}
                  alt={product.name}
                />
              </div>
              <p className="pl-4">{product.name}</p>
              <p>{product.category?.name}</p>
              <p>{product.price}</p>
              <p>{product.stock}</p>
              <div className="justify-center flex gap-2">
                <button
                  onClick={() => openUpdateModal(product)}
                  className="hover:font-semibold hover:text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="hover:font-semibold hover:text-themered"
                >
                  Delete
                </button>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {updateModalOpen && (
        <CustomModal open={updateModalOpen} handleClose={closeUpdateModal}>
          <div className="w-full">
            <div className="bg-themegreen text-white p-4 rounded-t-xl">
              <h2 className="text-xl font-bold text-center">Update Product</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full">
            <form onSubmit={onUpdateFormSubmit} className="flex flex-col gap-5">
            <input
              required
              name="name"
              placeholder="Product Name"
              value={updateData.name}
              onChange={handleUpdateInputChange}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
            />
            <textarea
              required
              name="description"
              placeholder="Product Description"
              value={updateData.description}
              onChange={handleUpdateInputChange}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
              rows="1"
              style={{ resize: "none", overflow: "hidden" }}
              onInput={(e) => {
                e.target.style.height = "auto"; 
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            <input
              required
              name="price"
              type="number"
              placeholder="Price"
              value={updateData.price}
              onChange={handleUpdateInputChange}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
            />
            <select
            required
            name="category_id"
            value={updateData.category_id}
            onChange={handleUpdateInputChange}
            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              required
              name="stock"
              type="number"
              placeholder="Stock"
              value={updateData.stock}
              onChange={handleUpdateInputChange}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
            />
            <label className="block">
              <span className="text-gray-700">Update Image</span>
              <div className="mt-1 flex items-center">
                <img
                  className="w-20 h-auto mr-3 object-contain rounded-lg"
                  src={
                    updateData.image
                      ? URL.createObjectURL(updateData.image)
                      : `${imageUrl1}/${selectedProduct.id}.${selectedProduct.extension}`
                  }
                  alt="Selected"
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setUpdateData((prev) => ({
                      ...prev,
                      image: e.target.files[0],
                    }))
                  }
                  className="w-full max-w-xs text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
            </label>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-base py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Submit"}
              </button>
            </div>
            </form>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default withAuth(ProductsList);
