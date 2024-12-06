import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import BikesPage from "./pages/BikesPage.jsx";
import EditPage from "./pages/EditPage.jsx";
import "./styles/reset.css";
import "./styles/index.css";
import ReportsPage from "./pages/ReportsPage.jsx";
import BikeEditPage from "./pages/BikeEditPage.jsx";
import TypesEditPage from "./pages/TypeEditPage.jsx";
import BrandsEditPage from "./pages/BrandEditPage.jsx";
import AddPage from "./pages/AddPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import BikeDetails from "./pages/BikeDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "bikes",
        element: <BikesPage />,
      },
      {
        path: "/bikes/:bike_id",
        element: <BikeDetails />,
      },
      {
        path: "edit",
        element: <EditPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "edit/bikes/:bike_id",
        element: <BikeEditPage />,
      },
      {
        path: "edit/types/:type_id",
        element: <TypesEditPage />,
      },
      {
        path: "edit/brands/:brand_id",
        element: <BrandsEditPage />,
      },
      {
        path: "/add",
        element: <AddPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/order-history",
        element: <OrderHistoryPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
