import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Asset from "../configurations/asset/asset";
import ShiftAllocation from "../shift/shift-allocation/shift-allocation";
import ShiftAllocationCalender from "../shift/shift-allocation/Shift-allocation-calender";
import ShiftConfiguration from "../shift/shift-configuration/shift-configuration";
import ShiftConfigurationForm from "../shift/shift-configuration/shift-configuration-form";
import ShiftConfigurationPreview from "../shift/shift-configuration/shift-configuration-preview";
import Shift from "../shift/shift-master/shift";
import ReasonList from "./downtime-configuration/reason-list";
import DowntimeReasonList from "./downtime-reason/downtime-reason-list";
import Downtimesplit from "./downtime-reason/dowtime-reasons-split-from";
import MachineStatusReport from "./machine-status-report/machine-status-report";
import ModelConfigurationList from "./model-configuration/model-configuration-list";
import ModelMasterConfigurationList from "./model-master-configuration/model-master-configuration-list";
import ModelTotalPartCountList from "./model-total-part-count/model-total-part-count-list";
import OeeDashboardNew from "./oee-dashboard-all/dashboard";
import MachineDetailDashboard from "./oee-dashboard/machine-detail-dashboard";
import MachineReport from "./oee-reports/reports-machine";
import QualityConfigurationList from "./quality-calculation-configuration.js/quality-configuration-list";
import QualityReasonList from "./quality-rejection/quality-reason-list";

import MachinePage from "./daifuku-main";
function Oee() {
  const router = useRoutes([
    {
      index: true,
      element: <Navigate to="dashboard" />,
    },
    {
      path: "daifuku-main",
      element: <MachinePage />,
    },
    {
      path: "dashboard",
      element: <OeeDashboardNew />,
    },

    {
      path: "reports",
      element: <MachineReport />,
    },

    {
      path: "machine-detail-dashboard",
      element: <MachineDetailDashboard />,
    },
    // {
    //   path: "hotpack-machine-detail-dashboard",
    //   element: <HotpackMachineDetailDashboard />,
    // },
    {
      path: "downtime-reason-configuration",
      element: <ReasonList />,
    },
    {
      path: "quality-rejection-configuration",
      element: <QualityReasonList />,
    },
    {
      path: "model-configuration",
      element: <ModelConfigurationList />,
    },
    {
      path: "model-master-configuration",
      element: <ModelMasterConfigurationList />,
    },
    {
      path: "target-partcount",
      element: <ModelTotalPartCountList />,
    },
    {
      path: "quality-configuration",
      element: <QualityConfigurationList />,
    },

    {
      path: "shift-configuration",
      children: [
        {
          index: true,
          element: <ShiftConfiguration />,
        },
        {
          path: "add",
          element: <ShiftConfigurationForm mode="Add" />,
        },
        {
          path: "add/:id",
          element: <ShiftConfigurationForm mode="Add" />,
        },
        {
          path: "update/:id",
          element: <ShiftConfigurationForm mode="Edit" />,
        },
        {
          path: "view/:id",
          element: <ShiftConfigurationPreview mode="View" />,
        },
      ],
    },
    {
      path: "shift-allocation",
      element: <ShiftAllocation />,
    },
    {
      path: "shift-allocation-calender",
      element: <ShiftAllocationCalender />,
    },
    {
      path: "configuration/asset",
      element: <Asset />,
    },
    {
      path: "downtime-list",
      element: <DowntimeReasonList />,
    },
    {
      path: "downtime",
      element: <Downtimesplit />,
    },
    {
      path: "shiftConfiguration",
      element: <Shift />,
    },
    {
      path: "machine-status-reports",
      element: <MachineStatusReport />,
    },
  ]);
  return router;
}

export default Oee;
