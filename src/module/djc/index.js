import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Product from "./product/product";
import Material from "./material/material";
import Production from "./production/production";
import Operator from "./operator/operator";
import Routing from "./routing/routing";
import RoutingForm from "./routing/routing-form";
import SaleOrder from "./sale-order/sale-order";
import JobOrder from "./job-order/job-order";
import JobOrderDetail from "./job-order/job-order-detail";

function DjcMaster() {
  const router = useRoutes([
    {
      index: true,
      element: <Navigate to="product" />,
    },
    {
      path: "product",
      element: <Product />,
    },
    {
      path: "material",
      element: <Material />,
    },
    {
      path: "production",
      element: <Production />,
    },
    {
      path: "operator",
      element: <Operator />,
    },
    {
      path: "routing",
      children: [
        {
          index: true,
          element: <Routing />,
        },
        {
          path: "add",
          element: <RoutingForm mode="Add" />,
        },
        {
          path: "update/:id",
          element: <RoutingForm mode="Update" />,
        },
        {
          path: "view/:id",
          element: <RoutingForm mode="View" />,
        },
      ],
    },
    {
      path: "sale-order",
      element: <SaleOrder />,
    },
    {
      path: "job-order",
      children: [
        {
          index: true,
          element: <JobOrder />,
        },
        {
          path: "detail",
          element: <JobOrderDetail />,
        },
      ],
    },
  ]);
  return router;
}

export default DjcMaster;
