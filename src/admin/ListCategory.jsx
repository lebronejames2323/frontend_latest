import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomModal from "../components/Modal";
import { imageUrl2 } from "../api/configuration";
import { getCategories } from "../api/product-fetch";
import withAuth from "../high-order-component/withAuth";
import { url } from "../api/configuration";

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateData, setUpdateData] = useState({
  name: "",
  image: null,
  });

  const refreshCategories = () => {
    getCategories().then((res) => {
    setCategories(res?.data);
    });
  };

  useEffect(() => {
  refreshCategories();
  }, []);

  const openUpdateModal = (category) => {
    setSelectedCategory(category);
    setUpdateData({
    name: category.name,
    image: null,
    });
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedCategory(null);
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
    if (updateData.image){
      formData.append("image", updateData.image);
    }

    const response = await fetch(
    `${url}/categories/${selectedCategory.id}`,
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
      toast.success(result.message || "Category updated successfully!");
      closeUpdateModal();
      refreshCategories();
    }else{
      toast.error(result.message || "Failed to update category!");
    }
    }catch (error){
      toast.error("An error occurred while updating the category.");
    }finally{
      setLoading(false);
      refreshCategories();
    }
  };


  const deleteCategory = async (categoryId) => {
    if (confirm("Are you sure you want to delete this category? All products under this category will also be deleted.")) {
    const response = await fetch(`${url}/categories/${categoryId}`,{
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.token}`,
    },
    });

    const data = await response.json();
    if (response.ok){
      toast.success("Category deleted successfully!");
    }else{
      toast.error("Failed to delete the category.");
    }
    refreshCategories();      
    }
  };


  return (
    <div className="bg-grey-50 min-h-screen">
      <Navbar className="fixed top-0 left-0 w-full z-50" />
      <hr />
      <div className="flex w-full">
        <Sidebar className="fixed top-[50px] left-0 bottom-0 w-[18%] z-40" />
        <div className="w-[70%] mx-auto ml-max[max(5vw,25px)] my-8 text-gray-600 text-base">
          <p className="mb-2">All Categories</p>
          <div className="w-[90%]">
            <div className="hidden md:grid grid-cols-[1fr_2fr_2fr_2fr] items-center py-1 px-2">
              <b className="text-center">Image</b>
              <b className="text-center">Category ID</b>
              <b className="text-center">Name</b>
              <b className="text-center">Actions</b>
            </div>
          {categories.map((category) => (
          <div
            key={category.id}
            className="grid grid-cols-[1fr_2fr_2fr_2fr] md:grid-cols-[1fr_2fr_2fr_2fr] items-center gap-2 py-1 px-2 border text-sm hover:bg-gray-100"
          >
            <div className="flex justify-center">
              <img
                className="w-1/2 h-auto object-contain rounded-lg"
                src={`${imageUrl2}/${category.id}.${category.extension}`}
                alt={category.name}
              />
            </div>
            <p className="text-center">{category.id}</p>
            <p className="text-center">{category.name}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => openUpdateModal(category)}
                className="hover:font-semibold hover:text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
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

      {updateModalOpen && selectedCategory && (
        <CustomModal open={updateModalOpen} handleClose={closeUpdateModal}>
          <div className="w-full">
            <div className="bg-themegreen text-white p-4 rounded-t-xl">
              <h2 className="text-xl font-bold">Update Category</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full">
              <form onSubmit={onUpdateFormSubmit} className="flex flex-col gap-5">
                <label className="block">
                  <span className="text-gray-700">Category Name</span>
                  <input
                    required
                    name="name"
                    placeholder="Category Name"
                    value={updateData.name}
                    onChange={handleUpdateInputChange}
                    className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Update Image</span>
                  <div className="mt-1 flex items-center">
                    <img
                      className="w-20 h-auto mr-3 object-contain rounded-lg"
                      src={
                      updateData.image
                        ? URL.createObjectURL(updateData.image)
                        : `${imageUrl2}/${selectedCategory.id}.${selectedCategory.extension}`
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
                      className="text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
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

export default withAuth(ListCategory);