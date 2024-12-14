import React from "react";
import { useRoutes } from "react-router-dom";
import AssetEnergy from "./asset-energy/asset-energy";
import EnergyLiveDashboard from "./energy-dashboard/energy-live-dashboard";
import EnergyReports from "./energy-dashboard/energy-reports";

// import UserAccess from "./configuration/user-access/user-access";
function Energy() {
  const router = useRoutes([
    {
      index: true,
      element: <AssetEnergy />,
    },

    {
      path: "live-dashboard",
      children: [
        {
          index: true,
          element: <EnergyLiveDashboard />,
        },
        {
          path: "reports",
          element: <EnergyReports />,
        },
      ],
    },
  ]);
  return router;
}

export default Energy;
