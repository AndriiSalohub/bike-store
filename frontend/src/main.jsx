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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
