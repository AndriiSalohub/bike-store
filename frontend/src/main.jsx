import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import BikesPage from "./pages/BikesPage.jsx";
import BikesEditPage from "./pages/BikesEditPage.jsx";
import "./styles/reset.css";
import "./styles/index.css";
import ReportsPage from "./pages/ReportsPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";

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
        path: "/bikes",
        element: <BikesPage />,
      },
      {
        path: "bikes_edit",
        element: <BikesEditPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "/statistics",
        element: <StatisticsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
