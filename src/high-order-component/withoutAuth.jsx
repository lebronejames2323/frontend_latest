import React from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const withoutAuth = (WrappedComponent) => {
  const WithoutAuth = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies();

    if (cookies?.token) {
      return <Navigate to="/" />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithoutAuth;
};

export default withoutAuth;
