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
