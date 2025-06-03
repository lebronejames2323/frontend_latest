import { url } from "./configuration";

export const getProducts = async () => {
  const res = await fetch(`${url}/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const getSpecificProduct = async (productId) => {
  const res = await fetch(`${url}/products/${productId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const featuredProducts = async () => {
  const res = await fetch(`${url}/featured-products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};


export const getCategories = async () => {
  const res = await fetch(`${url}/categories`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
}; 

export const getCategoriesData = async () => {
  const res = await fetch(`${url}/categories/with-sold-count`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
}; 

export const fetchSalesData = async (token) => {
  const res = await fetch(`${url}/products/sales-data`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const fetchAdminOrders = async (token) => {
  try {
    const res = await fetch(`${url}/orders/admin/orders`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { data: [] };
    }

    return await res.json();
  } catch (error) {
    return { data: [] };
  }
};

export const fetchOrders = async (token) => {
  const res = await fetch(`${url}/orders`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const fetchRecentOrders = async (token) => {
  const res = await fetch(`${url}/orders/admin/recent-orders`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const fetchCarts = async (cookies) => {
  const token = cookies.token;
  
  if (!token || token === "undefined" || token.trim() === "") {
    return { guestCart: cookies.guestCart || {} };
  }

  const res = await fetch(`${url}/carts`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const fetchWishlists = async (token) => {
  const res = await fetch(`${url}/wishlists`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const getProductReviews = async (productId, page = 1) => {
  const res = await fetch(`${url}/reviews?product_id=${productId}&page=${page}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Error fetching reviews: ${res.statusText}`);
  }

  const data = await res.json();

  return data;
};