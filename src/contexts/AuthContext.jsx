import React, { createContext, useState } from "react";
import { useCookies } from "react-cookie";
import { logout as Logout } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cookies, removeCookie] = useCookies();

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    Logout(cookies.token).then((res) => {
      removeCookie("token");
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
