import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import InventoryCategory from "./category/inventory-category";
import InventoryConfiguration from "./configuration/inventory-config";
import Dashboard from "./dashboard/dashboard";
import InventoryReport from "./report/inventory-report";
import InventoryRequest from "./request/inventory-request";
import StockJournal from "./stock-journal/stock-journal-list";
import DispatchList from "./dispatch/dispatch-list";
import StockJournalForm from "./stock-journal/stock-journal-form";
import SupplierList from "./supplier/supplier-list";
import PurchaseHistoryList from "./purchase-request/purchase-history-list";
import InventoryUpload from "./configuration/inventory-upload-form";
import SpareReport from "./report/spare-report";
import PmDashboard from "../overall-dashboard/pm-dashboard";

function SparePartsManagement() {
  const router = useRoutes([
    {
      index: true,
      element: <Navigate to="dashboard" />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "category",
      element: <InventoryCategory />,
    },
    {
      path: "configuration",
      children: [
        {
          index: true,
          element: <InventoryConfiguration />,
        },
        {
          path: "uploadInventoryParts",
          element: <InventoryUpload />,
        },
      ],
    },
    {
      path: "request",
      element: <InventoryRequest />,
    },
    {
      path: "stock-journal",
      children: [
        {
          index: true,
          element: <StockJournal />,
        },
        {
          path: "add",
          element: <StockJournalForm mode="Add" />,
        },

        {
          path: "view/:id",
          element: <StockJournalForm mode="View" />,
        },
        {
          path: "edit/:id",
          element: <StockJournalForm mode="Edit" />,
        },
      ],
    },
    {
      path: "supplier",
      element: <SupplierList />,
    },
    {
      path: "purchase-history",
      element: <PurchaseHistoryList />,
    },
    {
      path: "dispatch",
      element: <DispatchList />,
    },
    {
      path: "report",
      children: [
        {
          index: true,
          element: <InventoryReport />,
        },
        {
          path: "spare-report",
          element: <SpareReport />,
        },
      ],
    },
  ]);
  return router;
}

export default SparePartsManagement;
