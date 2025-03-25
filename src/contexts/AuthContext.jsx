// src/context/AuthContext.js
import React, { createContext, useState } from "react";
import { useCookies } from "react-cookie";
import { logout as Logout } from "../api/auth";
// Create a Context
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // State to hold authentication info
  const [user, setUser] = useState(null); // Store user data if needed
  const [cookies, setCookie, removeCookie] = useCookies();

  // Login method
  const login = (userData) => {
    setUser(userData); // Optionally set the user data
  };

  // Logout method
  const logout = () => {
    Logout(cookies.token).then((res) => {
      removeCookie("token");
      setUser(null);
    });
  };

  // Provide context values
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
