import { createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CategoryPage from "./Pages/CategoryPage";
import AccountPage from "./Pages/AccountPage";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishlistPage";
import ProductPage from "./Pages/ProductPage";
import Add from './Pages/admin/Add'
import AddCategory from './pages/admin/AddCategory'
import List from './pages/admin/List'
import Orders from './pages/admin/Orders'
import ListCategory from "./Pages/admin/ListCategory";

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
  {
    path: "/add",
    element: <Add />,
  },
  {
    path: "/add-category",
    element: <AddCategory />,
  },
  {
    path: "/list",
    element: <List />,
  },
  {
    path: "/list-category",
    element: <ListCategory />,
  },
  {
    path: "/order",
    element: <Orders />,
  },
]);
