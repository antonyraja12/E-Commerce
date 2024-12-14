import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import HotpackMachineDetailDashboard from "./dashboard/hotpack-machine-detail-dashboard";

function HmiMaster() {
  const router = useRoutes([
    {
      index: true,
      element: <Navigate to="dashboard" />,
    },

    {
      path: "dashboard",
      element: <HotpackMachineDetailDashboard />,
    },
  ]);
  return router;
}

export default HmiMaster;
