import { url } from "./configuration";

export const getProductsByCategory = async (categoryId, token) => {
  const res = await fetch(`${url}/categories/${categoryId}/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};
