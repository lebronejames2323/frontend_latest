import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { CookiesProvider } from "react-cookie";  // ✅ Import CookiesProvider

export default function App() {
  return (
    <CookiesProvider>  {/* ✅ Wrap your app with CookiesProvider */}
      <ToastContainer position="top-center" />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </CookiesProvider>
  );
}