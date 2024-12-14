import ShiftPlanning from "./components/shift-planning/shift-planning";
import { Navigate, useRoutes } from "react-router-dom";
import MainContainer from "./components/main-container";
import ShiftPlanningDetail from "./components/shift-planning-detail";
import ShiftMaster from "./components/shift-master/shift-master";
import ShiftCalendarMaster from "./components/shift-calendar-master/shift-calendar-master";
import ComponentMaster from "./components/component-master/component-master";
import ComponentMasterForm from "./components/component-master/component-master-form";
import ProductMaster from "./components/product-master/product-master";
import MachineMaster from "./components/machine-master/machine-master";
import OperatorMaster from "./components/operator-master/operator-master";
import EmbeddContainer from "./components/embedd-container";
import ProductModule from "./components/product-module";
import "./App.css";
import ComponentRouting from "./components/component-routing/component-routing";
import ProductAssemblyRouting from "./components/product-assembly-routing/product-assembly-routing";
import SaleOrderDetail from "./components/sale-order/sale-order-detail";
import SaleOrder from "./components/sale-order/sale-order";
import Item from "./components/item/item";
import JobOrder from "./components/job-order/job-order";
import JobOrderDetail from "./components/job-order/job-order-detail";
import AssemblyPlanningItem from "./components/job-order/assembly-planning-item";
function DigitalJobCard() {
  const mainRoutes = [
    {
      path: "master",
      children: [
        {
          path: "component",
          children: [
            { path: "", element: <ComponentMaster /> },
            { path: "add", element: <ComponentMasterForm mode="Add" /> },
            {
              path: "update/:id",
              element: <ComponentMasterForm mode="Update" />,
            },
          ],
        },
        {
          path: "shift",
          element: <ShiftMaster />,
        },
        {
          path: "product",
          element: <ProductMaster />,
        },
        {
          path: "shift-calendar",
          element: <ShiftCalendarMaster />,
        },
        {
          path: "machine",
          element: <MachineMaster />,
        },
        {
          path: "operator",
          element: <OperatorMaster />,
        },
      ],
    },

    {
      path: "shift",
      children: [
        {
          path: "planning",
          element: <ShiftPlanning />,
        },

        {
          path: "planning/detail/:id",
          element: <ShiftPlanningDetail />,
        },
      ],
    },
    {
      path: "product-module/*",
      element: <ProductModule />,
      children: [
        {
          // path: "/",
          element: <Navigate to="master" />,
          index: true,
        },
        {
          path: "master",
          element: <ProductMaster />,
        },

        {
          path: "bom",
          element: <ComponentMaster />,
        },
        {
          path: "component-routing",
          element: <ComponentRouting />,
        },
        {
          path: "product-assembly-routing",
          element: <ProductAssemblyRouting />,
        },
      ],
    },
    {
      path: "item-list",
      element: <Item />,
    },
    {
      path: "sale-order",
      element: <SaleOrder />,
    },
    {
      path: "job-order",
      children: [
        {
          path: "job-order-planing",
          element: <JobOrder />,
        },
        {
          path: "job-order-detail",
          element: <JobOrderDetail />,
        },
        {
          path: "job-order-reports",
          element: <JobOrder />,
        },
        {
          path: "reports",
          element: <AssemblyPlanningItem />,
        },
        {
          path: "assembly-planning-item/:id",
          element: <AssemblyPlanningItem />,
        },
      ],
    },
    {
      path: "sale-order/detail/:id",
      element: <SaleOrderDetail />,
    },
  ];
  const router = useRoutes([
    { path: "/", element: <MainContainer />, children: mainRoutes },
    { path: "/embedd", element: <EmbeddContainer />, children: mainRoutes },
  ]);

  return router;
}

export default DigitalJobCard;
