import { url } from "./configuration";

export const getAllProducts = async () => {
  const res = await fetch(`${url}/products/get-all`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const getProducts = async ({ page = 1, search = "", category = "" }) => {
  const queryParams = new URLSearchParams({ page });

  if (search) queryParams.append("search", search);
  if (category) queryParams.append("category", category);

  try {
    const res = await fetch(`${url}/products?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return { data: [], pagination: {} };
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], pagination: {} };
  }
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

export const recommendedProducts = async () => {
  const res = await fetch(`${url}/recommended-products`, {
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

export const fetchAdminOrders = async (token, status = "", dateRange = "all_time", search = "", page = 1) => {
  const queryParams = new URLSearchParams({ page });

  if (status) queryParams.append("status", status);
  if (dateRange) queryParams.append("date_range", dateRange);
  if (search) queryParams.append("search", search);

  try {
    const res = await fetch(`${url}/orders/admin/orders?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { data: [], pagination: {} };
    }

    return await res.json();
  } catch (error) {
    return { data: [], pagination: {} };
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

export const getProductRating = async (productId) => {
  const res = await fetch(`${url}/product-ratings?product_id=${productId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const getProductVariations = async () => {
  const res = await fetch(`${url}/variations`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return await res.json();
};

export const getAllNotifications = async (token) => {
  const res = await fetch(`${url}/notifications`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};