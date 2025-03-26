import { createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CategoryPage from "./Pages/CategoryPage";
import AccountPage from "./Pages/AccountPage";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishlistPage";
import ProductPage from "./Pages/ProductPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/category/:categoryName",
    element: <CategoryPage />,
  },
  {
    path: "/product/:productId",
    element: <ProductPage />,
  },
  {
    path: "/account",
    element: <AccountPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/wishlist",
    element: <WishlistPage />,
  },
]);
