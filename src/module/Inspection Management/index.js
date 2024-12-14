import React from "react";

import { Navigate, useRoutes } from "react-router-dom";
import {
  TypePageId,
  assetPageId,
  checkPageId,
  checkTypePageId,
  checklistExecutionPageId,
  checklistExecutionReportsPageId,
  checklistPageId,
  reportPageId,
  resolutionWorkOrderPageId,
  schedulerPageId,
} from "../../helpers/page-ids";
import TypeConfiguration from "../Inspection Management/configuration/configuration-type";
import Asset from "../configurations/asset/asset";
import AssetForm from "../configurations/asset/asset-form";
import PreviewAsset from "../configurations/asset/preview";
import Menu from "../configurations/menu/menu";
import ChecklistExecution from "./checklistexecution/checklist-execution";
import ChecklistExecutionStepper from "./checklistexecution/checklist-execution-stepper";
import CheckType from "./configuration/check-type/check-type";
import Check from "./configuration/check/check";
import ChecklistUpload from "./configuration/checklist/checkList-upload-form";
import Checklist from "./configuration/checklist/checklist";
import ChecklistForm from "./configuration/checklist/checklist-form";
import Configuration from "./configuration/configuration";
import Workflow from "./configuration/workflow/workflow";
import Dashboard from "./dashboard/dashboard";
import ChecklistExecutionReports from "./reports/checklist-execution-reports";
import Reports from "./reports/reports";
import NewRwoForm from "./resolution-work-order/new-rwo-form";
import ResolutionWorkOrder from "./resolution-work-order/resolution-work-order";
import ResolutionWorkOrderForm from "./resolution-work-order/resolution-work-order-form";
import Scheduler from "./scheduler/scheduler";
import SchedluerUpload from "./scheduler/scheduler-form-upload";
import SchedulerForm from "./scheduler/schedulerform";
function InspectionManagement() {
  const router = useRoutes([
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "workflow",
      element: <Workflow />,
    },
    {
      path: "scheduler",
      children: [
        {
          index: true,
          element: <Scheduler pageId={schedulerPageId} />,
        },
        {
          path: "add",
          element: <SchedulerForm pageId={schedulerPageId} />,
        },
        {
          path: "update/:id",
          element: <SchedulerForm pageId={schedulerPageId} />,
        },
        {
          path: "edit/:id",
          element: <SchedulerForm pageId={schedulerPageId} />,
        },
        {
          path: "schedulerUpload",
          element: <SchedluerUpload />,
        },
      ],
    },
    {
      path: "resolution-work-order",
      children: [
        {
          index: true,
          element: <ResolutionWorkOrder pageId={resolutionWorkOrderPageId} />,
        },
        {
          path: "add",
          element: (
            <ResolutionWorkOrderForm
              mode="Add"
              pageId={resolutionWorkOrderPageId}
            />
          ),
        },
        {
          path: "new",
          children: [
            {
              index: true,
              element: <NewRwoForm />,
            },
            {
              path: "issue-type",
              element: <TypeConfiguration pageId={TypePageId} />,
            },
          ],
        },
        {
          path: "update/:id",
          element: (
            <ResolutionWorkOrderForm
              mode="Edit"
              pageId={resolutionWorkOrderPageId}
            />
          ),
        },
      ],
    },
    {
      path: "checklist-execution",
      children: [
        {
          index: true,
          element: <ChecklistExecution pageId={checklistExecutionPageId} />,
        },
        {
          path: "add",
          element: (
            <ChecklistExecutionStepper
              mode="Add"
              pageId={checklistExecutionPageId}
            />
          ),
        },

        {
          path: "update/:id",
          element: (
            <ChecklistExecutionStepper
              mode="Edit"
              pageId={checklistExecutionPageId}
            />
          ),
        },
      ],
    },

    {
      path: "/resolution-work-order-reports",
      element: <Reports />,
    },
    {
      path: "/checklist-execution-reports",
      element: (
        <ChecklistExecutionReports pageId={checklistExecutionReportsPageId} />
      ),
    },

    {
      path: "reports",
      element: <Reports pageId={reportPageId} />,
    },
    {
      path: "configuration/menu",
      element: <Menu />,
    },
    {
      path: "checklist",
      children: [
        {
          index: true,
          element: <Checklist pageId={checklistPageId} />,
        },
        {
          path: "add",
          element: <ChecklistForm mode="Add" pageId={checklistPageId} />,
        },
        {
          path: "update/:id",
          element: <ChecklistForm mode="Edit" pageId={checklistPageId} />,
        },
        {
          path: "view/:id",
          element: <ChecklistForm mode="View" pageId={checklistPageId} />,
        },

        {
          path: "uploadChecklist",
          element: <ChecklistUpload />,
        },
      ],
    },
    {
      path: "/check-type",
      element: <CheckType />,
    },
    {
      path: "/checks",
      element: <Check />,
    },
    {
      path: "configuration",
      element: <Configuration />,
      children: [
        {
          index: true,
          element: <Navigate to="checklist" />,
        },

        {
          path: "checklist",
          children: [
            {
              index: true,
              element: <Checklist pageId={checklistPageId} />,
            },
            {
              path: "add",
              element: <ChecklistForm mode="Add" pageId={checklistPageId} />,
            },
            {
              path: "update/:id",
              element: <ChecklistForm mode="Edit" pageId={checklistPageId} />,
            },
            {
              path: "view/:id",
              element: <ChecklistForm mode="View" pageId={checklistPageId} />,
            },

            {
              path: "uploadChecklist",
              element: <ChecklistUpload />,
            },
            {
              path: "check-type",
              element: <CheckType pageId={checkTypePageId} />,
            },
            {
              path: "im-check",
              element: <Check pageId={checkPageId} />,
            },
          ],
        },
      ],
    },

    {
      path: "im-asset",
      children: [
        {
          index: true,
          element: <Asset pageId={assetPageId} />,
        },
        {
          path: "add",
          element: <AssetForm pageId={assetPageId} mode="Add" />,
        },
        {
          path: "add/:id",
          element: <AssetForm pageId={assetPageId} mode="Add" />,
        },
        {
          path: "update/:id",
          element: <AssetForm pageId={assetPageId} mode="Edit" />,
        },
        {
          path: "view/:id",
          element: <PreviewAsset mode="View" pageId={assetPageId} />,
        },
      ],
    },
  ]);
  return router;
}

export default InspectionManagement;
