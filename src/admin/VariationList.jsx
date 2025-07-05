import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomModal from "../components/Modal";
import { url, imageUrl1 } from "../api/configuration";
import { getVariationPagination } from "../api/product-fetch";
import withAuth from "../high-order-component/withAuth";

const VariationList = () => {
  const [variations, setVariations] = useState([]);
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [updateData, setUpdateData] = useState({
  variation_name: "",
  variation_price: "",
  variation_stock: "",
  });

  const refreshVariations = (page = 1) => {
    getVariationPagination(cookies.token, page).then((res) => {
      setVariations(res?.data?.data || []);
      setCurrentPage(res?.data?.current_page);
      setLastPage(res?.data?.last_page);
    });
  };

  useEffect(() => {
    refreshVariations(currentPage);
  }, [currentPage]);

  const openUpdateModal = (variation) => {
    setSelectedVariation(variation);
    setUpdateData({
    variation_name: variation.variation_name,
    variation_price: variation.variation_price,
    variation_stock: variation.variation_stock,
    });
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedVariation(null);
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
      formData.append("variation_name", updateData.variation_name);
      formData.append("variation_price", updateData.variation_price);
      formData.append("variation_stock", updateData.variation_stock);

      const response = await fetch(
        `${url}/variations/update/${selectedVariation.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Variation updated successfully!");
        closeUpdateModal();
        refreshVariations();
      } else {
        toast.error(result.message || "Failed to update variation!");
      }
    } catch (error) {
      toast.error("An error occurred while updating the variation.");
    } finally {
      setLoading(false);
    }
  };
  


  const deleteVariation = async (variationId) => {
    if (confirm("Are you sure you want to delete this variation?")) {
      const response = await fetch(`${url}/variations/delete/${variationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Variation deleted successfully!");
      } else {
        toast.error("Failed to delete the variation.");
      }

      refreshVariations();
    }
  };


  return (
    <div className="bg-grey-50 min-h-screen">
      <Navbar className="fixed top-0 left-0 w-full z-50" />
      <hr />
      <div className="flex w-full">
        <Sidebar className="fixed top-[50px] left-0 bottom-0 w-[18%] z-40" />
        <div className="w-[70%] mx-auto ml-max[max(5vw,25px)] my-8 text-gray-600 text-base">
          <p className="mb-5">All Variations</p>
          <div className="w-[90%]">
            <div className="hidden md:grid grid-cols-[1fr_2fr_2fr_2fr_2fr] items-center py-1 px-2">
              <b className="text-center">Image</b>
              <b className="text-center">Name</b>
              <b className="text-center">Price</b>
              <b className="text-center">Stock</b>
              <b className="text-center">Actions</b>
            </div>
          {variations.map((variation) => (
          <div
            key={variation.id}
            className="grid grid-cols-[1fr_2fr_2fr_2fr_2fr] md:grid-cols-[1fr_2fr_2fr_2fr_2fr] items-center gap-2 py-1 px-2 border text-sm hover:bg-gray-100"
          >
            <div className="flex justify-center">
              <img
                className="w-1/2 h-auto object-contain rounded-lg"
                src={`${imageUrl1}/${variation.product.id}.${variation.product.extension}`}
                alt={variation.product.name}
              />
            </div>
            <p className="text-center">{variation.variation_name}</p>
            <p className="text-center">₱{Number(variation.variation_price).toLocaleString()}</p>
            <p className="text-center">{variation.variation_stock}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => openUpdateModal(variation)}
                className="hover:font-semibold hover:text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteVariation(variation.id)}
                className="hover:font-semibold hover:text-themered"
              >
                Delete
              </button>
            </div>
          </div>
          ))}
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 disabled:opacity-50 disabled:text-gray-400 disabled:bg-gray-200 hover:bg-themegreen hover:text-white transition-colors duration-300"
            >
              Back
            </button>

            {[...Array(lastPage)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    pageNum === currentPage
                      ? "bg-themegreen text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-themegreen hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
              disabled={currentPage === lastPage}
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 disabled:opacity-50 disabled:text-gray-400 disabled:bg-gray-200 hover:bg-themegreen hover:text-white transition-colors duration-300"
            >
              Next
            </button>
          </div>

          </div>
        </div>
      </div>

      {updateModalOpen && selectedVariation && (
        <CustomModal open={updateModalOpen} handleClose={closeUpdateModal}>
          <div className="w-full">
            <div className="bg-themegreen text-white p-4 rounded-t-xl">
              <h2 className="text-xl font-bold text-center">Update Variation</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full">
              <form onSubmit={onUpdateFormSubmit} className="flex flex-col gap-5">
                <label className="block">
                  <span className="text-gray-700">Variation Name</span>
                  <input
                    name="variation_name"
                    placeholder="Name"
                    value={updateData.variation_name}
                    onChange={handleUpdateInputChange}
                    className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Variation Price</span>
                  <input
                    name="variation_price"
                    placeholder="Price"
                    value={updateData.variation_price}
                    onChange={handleUpdateInputChange}
                    className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Variation Stock</span>
                  <input
                    name="variation_stock"
                    placeholder="Stock"
                    value={updateData.variation_stock}
                    onChange={handleUpdateInputChange}
                    className="border rounded-md p-3 w-full focus:outline-none focus:ring-2"
                  />
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

export default withAuth(VariationList);