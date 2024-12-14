import React from "react";
import { Navigate, useRoutes } from "react-router-dom";

import ShiftConfigurationNew from "./shift-configuration-new/shift-configuration";
import ShiftAllocationSet from "./shift-configuration-new/shift-allocation-set";
import ShiftCalendar from "./shift-configuration-new/shift-calendar";
import ShiftAllocationList from "./shift-configuration-new/shift-allocation-list";
import ShiftConfigurationList from "./shift-configuration-new/shift-configuration-list";
import ShiftMaster from "./shift-master/shift-master";

function Routes() {
  const router = useRoutes([
    {
      index: true,
      element: <ShiftMaster />,
    },
    {
      path: "",
      children: [
        {
          path: "configuration",
          children: [
            {
              index: true,
              element: <ShiftConfigurationList />,
            },
            {
              path: "add",
              element: <ShiftConfigurationNew />,
            },
            {
              path: "update/:id",
              element: <ShiftConfigurationNew />,
            },
          ],
        },
        {
          path: "allocation",
          children: [
            {
              index: true,
              element: <ShiftAllocationList />,
            },
            {
              path: "calendar",
              element: <ShiftCalendar />,
            },
            {
              path: "add",
              element: <ShiftAllocationSet />,
            },
          ],
        },

        {
          path: "shift",
          element: <ShiftMaster />,
        },
      ],
    },
  ]);
  return router;
}

export default Routes;
