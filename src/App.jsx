import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <ToastContainer position="top-center" />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}
