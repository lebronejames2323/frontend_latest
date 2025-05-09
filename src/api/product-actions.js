import { url } from "./configuration";
import { toast } from 'react-toastify';

export const addToCart = async (productId, cookies, setLoading2, productStock) => {
  const token = cookies.token;
  if (!token || token === "undefined" || token.trim() === "") {
    toast.error('You are not logged in.');
    return;
  }

  if (typeof productStock === 'undefined' || productStock <= 0) {
    toast.error('This product is out of stock!');
    return;
  }

  try {
    setLoading2(true);
    const response = await fetch(`${url}/carts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch cart");
    }

    const res = await response.json();  
    const carts = res?.data;

    const isProductInCart = carts.some(cart =>
      cart.products.some(product => product.id === productId)
    );

    if (isProductInCart) {
      toast.error('This product is already in the cart!');
      return;
    }

    const addResponse = await fetch(`${url}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        products: [{ id: productId, quantity: 1 }],
      }),
    });

    const addData = await addResponse.json();
    if (addResponse.ok) {
      toast.success('Product added to cart successfully!');
    } else {
      toast.error('Failed to add product to cart.');
    }
  } catch (error) {
    toast.error('An error occurred.');
  } finally {
    setLoading2(false);
  }
};


export const addToWishlist = async (productId, cookies, setLoading2) => {
  const token = cookies.token;
  if (!token || token === "undefined" || token.trim() === "") {
    toast.error('You are not logged in.');
    return;
  }

  try {
  setLoading2(true);
  const response = await fetch(`${url}/wishlists`, {
    headers: {
    'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch cart");
  }

  const res = await response.json();
  const carts = res?.data;

  const isProductInCart = carts.some(cart =>
  cart.products.some(product => product.id === productId)
  );

  if (isProductInCart) {
    toast.error('This product is already in the wishlist!');
    return;
  }

  const addResponse = await fetch(`${url}/wishlists`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    products: [{ id: productId, quantity: 1 }],
  }),
  });

  const addData = await addResponse.json();
  if (addResponse.ok) {
    toast.success('Product added to wishlist successfully!');
  } else {
      toast.error('Failed to add product to cart.');
  }
  }catch (error){
    toast.error('An error occurred.');
  }finally{
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



export const deleteProductFromCart = async (cartId, productId, cookies, setLoading, refreshCarts) => {
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
      body: JSON.stringify({ product_id: productId }),
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
    


export const placeOrder = async (carts, cookies, setLoading, setLastOrder, setCarts, setShowReceipt) => {
  try {
    setLoading(true);

    const products = carts.flatMap(cart => cart.products).map(product => ({
      id: product.id,
      quantity: product.pivot.quantity,
    }));

    const response = await fetch(`${url}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products }),
    });

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
    toast.error("Your cart is empty");
  } finally {
    setLoading(false);
    setShowReceipt(true);
  }
};



export const updateProductQuantity = async (cartId, productId, quantity, cookies, refreshCarts) => {
  try {
    const response = await fetch(`${url}/carts/${cartId}/update-product`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      refreshCarts();
    } else {
      toast.error("Failed to update product quantity.");
    }
  } catch (error) {
    toast.error("An error occurred while updating the product quantity.");
  }
};