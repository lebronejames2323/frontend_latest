import { url } from "./configuration";
import { toast } from 'react-toastify';

export const addToCart = async (productId, cookies, setCookie, setLoading2, productStock, productPrice = null, productExtension = null, productName = null) => {
  const token = cookies.token;

  if (!token || token === "undefined" || token.trim() === "") {
    let guestCart = cookies.guestCart || {};

    if (guestCart[productId]) {
      toast.error("Product is already in the cart.");
      return;
    }

    guestCart[productId] = {
      quantity: 1,
      price: productPrice,
      stock: productStock,
      extension: productExtension,
      name: productName,
    };
    setCookie("guestCart", guestCart, { path: "/", expires: new Date(Date.now() + 86400000) });

    toast.success("Product added to cart!");
    return;
  }

  if (typeof productStock === "undefined" || productStock <= 0) {
    toast.error("This product is out of stock!");
    return;
  }

  try {
    setLoading2(true);
    const addResponse = await fetch(`${url}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({  
        products: [{ id: productId, quantity: 1, price: productPrice, variation_id: null   }],
      }),
    });

    const addData = await addResponse.json();
    if (addResponse.ok) {
      const message = addData.message || "Product added to cart successfully!";

      if (message === "Its already in the cart.") {
        toast.error("Product is already in the cart.");
      } else {
        toast.success(message);
      }
    } else {
      const errorMsg = addData.message || "Failed to add product to cart.";
      toast.error(errorMsg);
    }
  } catch (error) {
    toast.error("An error occurred.");
  } finally {
    setLoading2(false);
  }
};



export const addToCartWithQuantity = async ( product, cookies, setCookie, setLoading2, productStock, quantity, productPrice = null, productExtension = null, productName = null, selectedVariation = null ) => {
  const token = cookies.token;

  if (!token || token === "undefined" || token.trim() === "") {
    let guestCart = cookies.guestCart || {};

    const guestKey = selectedVariation
    ? `${product.id}_${selectedVariation.id}`
    : `${product.id}`;

    if (guestCart[guestKey]) {
      toast.error("Product is already in the cart.");
      return;
    }

    guestCart[guestKey] = {
      quantity,
      price: productPrice,
      stock: productStock,
      extension: productExtension,
      name: productName,
      variation_id: selectedVariation ? selectedVariation.id : null,
    };

    setCookie("guestCart", guestCart, { path: "/", expires: new Date(Date.now() + 86400000) });
    console.log("guestCart after setting:", guestCart);
    toast.success("Product added to cart!");
    return;
  }

  console.log("Token:", token);
  console.log("Product ID:", product.id);
  console.log("Quantity:", quantity);
  console.log("Selected Variation:", selectedVariation);
  console.log("Request Payload:", JSON.stringify({
    products: [{
      id: product.id,
      quantity,
      price: productPrice,
      variation_id: selectedVariation ? selectedVariation.id : null,
    }],
  }));

  try {
    setLoading2(true);

    const addResponse = await fetch(`${url}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        products: [{
          id: product.id,
          quantity,
          price: productPrice,
          variation_id: selectedVariation ? selectedVariation.id : null,
        }],
      }),
    });

    console.log("API Response Status:", addResponse.status);

    const addData = await addResponse.json();
    console.log("API Response Data:", addData);

    if (addResponse.ok) {
      const message = addData.message || "Product added to cart successfully!";
      if (message === "Its already in the cart.") {
        toast.error("Product is already in the cart.");
      } else {
        toast.success(message);
      }
    } else {
      const errorMsg = addData.message || "Failed to add product to cart.";
      toast.error(errorMsg);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("An error occurred.");
  } finally {
    setLoading2(false);
  }
};




export const addToWishlist = async (productId, cookies, setCookie, setLoading2, productStock, productPrice = null, productExtension = null, productName = null,) => {
  const token = cookies.token;

  if (!token || token === "undefined" || token.trim() === "") {
    let guestWishlist = cookies.guestWishlist || {};

    if (guestWishlist[productId]) {
      toast.error("Product is already in the wishlist.");
      return;
    }

    guestWishlist[productId] = {
      quantity: 1,
      price: productPrice,
      stock: productStock,
      extension: productExtension,
      name: productName,
    };
    setCookie("guestWishlist", guestWishlist, { path: "/", expires: new Date(Date.now() + 86400000) });

    toast.success("Product added to Wishlist!");
    return;
  }

  try {
    setLoading2(true);
    const addResponse = await fetch(`${url}/wishlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: [{ id: productId, quantity: 1 }],
        }),
    });

    const addData = await addResponse.json();
    
    if (addResponse.ok) {
      const message = addData.message || 'Product added to wishlist!';

      if (message === "Its already in the wishlist.") {
        toast.error("Product is already in the wishlist.");
      } else {
        toast.success(message);
      }
    }
  } catch (error) {
    toast.error("An error occurred.");
  } finally {
    setLoading2(false);
  }
};



export const deleteProductFromWishlist = async (wishlistId, productId, cookies, setLoading, refreshWishlists) => {
  const token = cookies.token;
  if (!token || token === "undefined" || token.trim() === "") {
    toast.error('You are not logged in.');
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(`${url}/wishlists/${wishlistId}/delete-product`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success('Product deleted successfully!');
      refreshWishlists();
    } else {
      toast.error('Failed to delete product from wishlist.');
    }
  } catch (error) {
    toast.error('An error occurred while deleting the product.');
  } finally {
    setLoading(false);
  }
};



export const deleteProductFromCart = async (cartId, productId, variationId, cookies, setLoading, refreshCarts) => {
  const token = cookies.token;
  if (!token || token === "undefined" || token.trim() === "") {
    toast.error('User is not authenticated!');
    return;
  }

  try {
    if (setLoading) {
      setLoading(true);
    }
    const response = await fetch(`${url}/carts/${cartId}/delete-product`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        product_id: productId,
        variation_id: variationId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success('Product deleted successfully!');
      refreshCarts();
    } else {
      toast.error('Failed to delete product from cart.');
    }
  } catch (error) {
    toast.error('An error occurred while deleting the product.');
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};
    


export const placeOrder = async (carts, cookies, setLoading, setLastOrder, setCarts, setShowReceipt, deliveryAddress, paymentMethod, fullName, phoneNumber) => {
  try {
    setLoading(true);

    console.log("Cart Data:", carts);

    const products = carts.flatMap(cart => cart.products).map(product => ({
      id: product.id,
      quantity: product.pivot.quantity,
    }));

    console.log("Order Payload:", { products, deliveryAddress, paymentMethod, fullName, phoneNumber });

    const response = await fetch(`${url}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        products, 
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        full_name: fullName, 
        phone_number: phoneNumber 
      }),
    });

    console.log("Final Order Data:", JSON.stringify({ products, deliveryAddress, paymentMethod, fullName, phoneNumber }, null, 2));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to place order");
    }

    const res = await response.json();
    setLastOrder(res.data);
    toast.success("Order placed successfully:");

    for (const cart of carts) {
      const deleteResponse = await fetch(`${url}/carts/${cart.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${cookies.token}`,
        },
      });

      if (!deleteResponse.ok) {
        const deleteError = await deleteResponse.json();
        throw new Error(`Failed to delete cart with ID ${cart.id}`);
      }
    }

    setCarts([]);
  } catch (err) {
    const message = err.message || "Something went wrong while placing your order.";
    toast.error(message);
  } finally {
    setLoading(false);
    setShowReceipt(true);
  }
};



export const updateProductQuantity = async (cartId, productId, variationId, quantity, cookies, refreshCarts) => {
  try {
    const response = await fetch(`${url}/carts/${cartId}/update-product`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        variation_id: variationId,
        quantity: quantity,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      refreshCarts();
    } else {
      toast.error(data.message || "Failed to update product quantity.");
    }
  } catch (error) {
    toast.error("An error occurred while updating the product quantity.");
  }
};



export const transferGuestDataToUser = async (token, cookies, setCookie) => {
  if (!token) return;

  const guestCart = cookies.guestCart || {};
  const guestWishlist = cookies.guestWishlist || {};

  if (Object.keys(guestCart).length === 0 && Object.keys(guestWishlist).length === 0) {
    return;
  }

  try {
    if (Object.keys(guestCart).length > 0) {
      await fetch(`${url}/carts`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: Object.entries(guestCart).map(([key, data]) => {
            const [rawId] = key.split("_");
            const productData = {
              id: parseInt(rawId),
              quantity: data.quantity,
              price: data.price
            };

            if (data.variation_id) {
              productData.variation_id = data.variation_id;
            }

            return productData;
          })
        })
      });
    }

    if (Object.keys(guestWishlist).length > 0) {
      await fetch(`${url}/wishlists`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products: Object.entries(guestWishlist).map(([id]) => ({
        id,
        quantity: 1
        })) })
      });
    }

    setCookie("guestCart", null, { path: "/", expires: new Date(0) });
    setCookie("guestWishlist", null, { path: "/", expires: new Date(0) }); 

  } catch (error) {
    console.error("Error merging guest data:", error);
  }
};



export const cancelOrder = async (orderId, cookies) => {
  try {
    const response = await fetch(`${url}/orders/${orderId}/cancel-order`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${cookies.token}` },
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (response.ok) {
      toast.success(result.message);
    } else {
      toast.error(result.message || "Failed to cancel order.");
    }
  } catch (error) {
    console.error("Error canceling order:", error);
    toast.error("An error occurred while canceling the order.");
  }
};

export const markAllAsRead = async (token) => {
  const res = await fetch(`${url}/notifications/mark-read`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  return await res.json();
};