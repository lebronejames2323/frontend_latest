import { url } from "./configuration";

export const getNewUsersCount = async (token) => {
  const res = await fetch(`${url}/user/user-count`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const getUserAddresses = async (userId, token) => {
  const res = await fetch(`${url}/user/${userId}/addresses`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const deleteUserAddress = async (addressId, token) => {
  const response = await fetch(`${url}/user/addresses/${addressId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export const checkToken = async (token) => {
  const res = await fetch(`${url}/user`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const logout = async (token) => {
  const res = await fetch(`${url}/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const login = async (body, token) => {
  const res = await fetch(`${url}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return await res.json();
};

export const register = async (body, token) => {
  const res = await fetch(`${url}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return await res.json();
};

export const index = async (token) => {
  const res = await fetch(`${url}/user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const update = async (body, token, userId) => {
  const res = await fetch(`${url}/user/${userId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return await res.json();
}; 