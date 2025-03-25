import { url } from "./configuration";

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
  const res = await fetch(`${url}/logout?_method=DELETE`, {
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