import { url } from "./configuration";

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
