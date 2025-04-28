import React, { useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../api/auth";
import { AuthContext } from "../contexts/AuthContext";

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { user, login } = useContext(AuthContext);
    const token = cookies.token;

    useEffect(() => {
      if (!token) {
        navigate("/");
        return;
      }

      if (!user) {
        checkToken(token)
          .then((res) => {
            if (res?.ok) {
              login(res?.data);
              if (res?.data?.username.toLowerCase() !== "admin") {
                navigate("/");
              }
            } else {
              navigate("/");
            }
          })
          .catch((error) => {
            console.error("Error checking token:", error);
            navigate("/");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, [token, user, navigate, login]);

    if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                  <div className="w-16 h-16 border-4 border-themegreen border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-lg">Loading...</p>
              </div>
          </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
