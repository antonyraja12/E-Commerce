import { Navigate, useRoutes } from "react-router-dom";
import AlertReport from "./alert-report/alert-report";
import ParameterReport from "./parameter-report/parameter-report";
import Monitoring from "./monitoring/monitoring";
import Home from "./map/home";
import AssetDashboard from "./asset-dashboard/asset-dashboard";
function CBM() {
  const router = useRoutes([
    {
      index: true,
      element: <Navigate to="monitoring" />,
    },
    {
      path: "monitoring",
      element: <Monitoring />,
    },
    {
      path: "parameter-report",
      element: <ParameterReport />,
    },
    {
      path: "alert-report",
      element: <AlertReport />,
    },
    {
      path: "dashboard",
      element: <Home />,
    },
    {
      path: "assetdashboard",
      element: <AssetDashboard />,
    },
  ]);
  return router;
}

export default CBM;
