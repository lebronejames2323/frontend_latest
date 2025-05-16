import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryPage from "./pages/CategoryPage";
import AccountPage from "./pages/AccountPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProductPage from "./pages/ProductPage";
import AddProduct from './admin/AddProduct'
import AddCategory from './admin/AddCategory'
import ProductList from './admin/ProductList'
import Orders from './admin/Orders'
import CategoryList from "./admin/CategoryList";
import AllProductsPage from "./pages/AllProductsPage";
import OrderReview from "./pages/OrderReview";

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
    path: "/add-product",
    element: <AddProduct />,
  },
  {
    path: "/add-category",
    element: <AddCategory />,
  },
  {
    path: "/product-list",
    element: <ProductList />,
  },
  {
    path: "/category-list",
    element: <CategoryList />,
  },
  {
    path: "/order",
    element: <Orders />,
  },
  {
  path: "/all-products",
    element: <AllProductsPage />,
  },
  {
  path: "/order-review/:productId",
    element: <OrderReview />,
  },
]);