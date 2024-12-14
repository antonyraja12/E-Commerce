import React from "react";

import { useRoutes } from "react-router-dom";
import DashboardMasterList from "./master/dashboard-master-list/dashboard-master-list";
import DashboardMaster from "./master/dashboard-master/dashboard-master";
import Preview from "./master/dashboard-master/preview";

// import UserAccess from "./configuration/user-access/user-access";
function DashboardDesigner() {
  const router = useRoutes([
    {
      index: true,
      element: <DashboardMasterList />,
    },
    {
      path: "editor/:id",
      children: [
        {
          index: true,
          element: <DashboardMaster />,
        },
        {
          path: "preview",
          element: <Preview />,
        },
      ],
    },
  ]);
  return router;
}

export default DashboardDesigner;
