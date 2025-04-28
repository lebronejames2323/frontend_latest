import { url } from "./configuration";

export const index = async (token) => {
  const res = await fetch(`${url}/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const getCategories = async (token) => {
  const res = await fetch(`${url}/categories`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const fetchAdminOrders = async (token) => {
  const res = await fetch(`${url}/admin/orders`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
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

export const fetchCarts = async (token) => {
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