// src/hoc/withoutAuth.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

// withoutAuth HOC
const withoutAuth = (WrappedComponent) => {
  const WithoutAuth = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies();

    if (cookies?.token) {
      // If the user is authenticated, redirect to the dashboard (or another page)
      return <Navigate to="/" />;
    }

    // If not authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  return WithoutAuth;
};

export default withoutAuth;
