import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import SideMenu from "../mainLayout/side-menu";
import MainLayout from "../mainLayout/main-layout";
import Homepage from "./homepage";
import ProductDetailsPage from "./detail-page";
// import LoginPage from "../Users/Login";

function Routing() {
  const router = useRoutes([
    {
      index: true,
      element: <Navigate to="main" />,
    },
    {
      path: "main",
      element: <Homepage />,
    },
    {
      path: "main/:id",
      element: <ProductDetailsPage />,
    },
  ]);
  return router;
}
export default Routing;
