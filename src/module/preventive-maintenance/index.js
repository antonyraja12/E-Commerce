import React from "react";

import { Navigate, useRoutes } from "react-router-dom";

import {
  TypePageId,
  checklistExecutionReportsPageId,
} from "../../helpers/page-ids";

import Asset from "../configurations/asset/asset";
// import SmsAndMailConfiguration from "../configurations/sms-configuration/sms-config";
// import SmsConfiguration from "../configurations/sms-configuration/sms-config";
import ChecklistExecution from "./checklistexecution/checklist-execution";
import ChecklistExecutionStepper from "./checklistexecution/checklist-execution-stepper";
import CheckType from "./configuration/check-type/check-type";
import Check from "./configuration/check/check";
import ChecklistUpload from "./configuration/checklist/checkList-upload-form";
import Checklist from "./configuration/checklist/checklist";
import ChecklistForm from "./configuration/checklist/checklist-form";
import UserAccess from "./configuration/user-access/user-access";
import Workflow from "./configuration/workflow/workflow";
import Dashboard from "./dashboard/dashboard";
import Reports from "./reports/reports";
import ResolutionWorkOrder from "./resolution-work-order/resolution-work-order";
import ResolutionWorkOrderForm from "./resolution-work-order/resolution-work-order-form";
import Scheduler from "./scheduler/scheduler";
import SchedulerForm from "./scheduler/schedulerform";

import {
  checkPageId,
  checkTypePageId,
  checklistExecutionPageId,
  checklistPageId,
  resolutionWorkOrderPageId,
} from "../../helpers/page-ids";
import LogoUpload from "../configurations/logo/logo";
import Menu from "../configurations/menu/menu";
import ShiftAllocationCalender from "../shift/shift-allocation/Shift-allocation-calender";
import ShiftAllocation from "../shift/shift-allocation/shift-allocation";
import ShiftConfiguration from "../shift/shift-configuration/shift-configuration";
import ShiftConfigurationForm from "../shift/shift-configuration/shift-configuration-form";
import ShiftConfigurationPreview from "../shift/shift-configuration/shift-configuration-preview";
import Shift from "../shift/shift-master/shift";
import TypeConfiguration from "./configuration/configuration-type";
import ChecklistExecutionReports from "./reports/checklist-execution-reports";
import NewResolutionWorkOrderForm from "./resolution-work-order/new-rwo-form";
import SchedluerUpload from "./scheduler/scheduler-form-upload";
function DigitalWorkflow() {
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
      path: "useracess",
      element: <UserAccess />,
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
          element: <Scheduler />,
        },
        {
          path: "add",
          element: <SchedulerForm />,
        },
        {
          path: "update/:id",
          element: <SchedulerForm />,
        },
        {
          path: "edit/:id",
          element: <SchedulerForm />,
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
              element: <NewResolutionWorkOrderForm />,
            },
            {
              path: "issue-type",
              element: <TypeConfiguration pageId={TypePageId} />,
              // children: [
              //   {
              //     index: true,
              //     element: <Navigate to="type" />,
              //   },
              //   {
              //     path: "priority",
              //     element: <Priority pageId={priortyPageId} />,
              //   },

              //   {
              //     path: "type",
              //     element: <MaintenanceType pageId={MaintenanceTypePageId} />,
              //   },
              // ],
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
        {
          path: "edit/:id",
          element: (
            <ResolutionWorkOrderForm pageId={resolutionWorkOrderPageId} />
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
      path: "check-type",
      element: <CheckType pageId={checkTypePageId} />,
    },
    {
      path: "checks",
      element: <Check pageId={checkPageId} />,
    },

    {
      path: "resolution-work-order-reports",
      element: <Reports />,
    },
    {
      path: "/checklist-execution-reports",
      element: (
        <ChecklistExecutionReports pageId={checklistExecutionReportsPageId} />
      ),
    },
    {
      path: "configuration/menu",
      element: <Menu />,
    },
    {
      path: "logo",
      element: <LogoUpload />,
    },
    // {
    //   path: "configuration",
    //   element: <Configuration />,
    //   children: [
    //     {
    //       index: true,
    //       element: <Navigate to="asset" />,
    //     },
    //     {
    //       path: "app-hierarchy",
    //       element: <AppHierarchy pageId={appHierarchyPageId} />,
    //     },
    //     {
    //       path: "check-type",
    //       element: <CheckType pageId={checkTypePageId} />,
    //     },
    //     {
    //       path: "check",
    //       element: <Check pageId={checkPageId} />,
    //     },

    //     {
    //       path: "checklist",
    //       children: [
    //         {
    //           index: true,
    //           element: <Checklist pageId={checklistPageId} />,
    //         },
    //         {
    //           path: "add",
    //           element: <ChecklistForm mode="Add" pageId={checklistPageId} />,
    //         },
    //         {
    //           path: "update/:id",
    //           element: <ChecklistForm mode="Edit" pageId={checklistPageId} />,
    //         },
    //         {
    //           path: "view/:id",
    //           element: <ChecklistForm mode="View" pageId={checklistPageId} />,
    //         },

    //         {
    //           path: "uploadChecklist",
    //           element: <ChecklistUpload />,
    //         },

    //         // {
    //         //   path: "uploadChecklist",
    //         //   element: <ChecklistUpload />,
    //         // },
    //       ],
    //     },
    //     {
    //       path: "general",

    //       element: <ConfigurationSub />,
    //       children: [
    //         {
    //           index: true,
    //           element: <Navigate to="role" />,
    //         },
    //         {
    //           path: "role",
    //           element: <Role pageId={rolePageId} />,
    //         },
    //         {
    //           path: "user",
    //           element: <User pageId={userPageId} />,
    //         },
    //         {
    //           path: "sms-mail-configuration",
    //           element: (
    //             <SmsAndMailConfiguration pageId={smsandmailConfigurationId} />
    //           ),
    //         },

    //         {
    //           path: "useraccess",
    //           element: <UserAccess pageId={useraccessPageId} />,
    //         },
    //         {
    //           path: "logo",
    //           element: <LogoUpload />,
    //         },
    //         {
    //           path: "module",
    //           element: <SmsMailAuto />,
    //         },
    //         {
    //           path: "file-mapping",
    //           element: <CheckAssetFileMapping />,
    //         },
    //         {
    //           path: "file-bulk-upload",
    //           element: <CheckAssetFileBulkUpload />,
    //         },
    //       ],
    //     },

    //     {
    //       path: "asset",
    //       children: [
    //         {
    //           index: true,
    //           element: <Asset pageId={assetPageId} />,
    //         },
    //         {
    //           path: "add",
    //           element: <AssetForm pageId={assetPageId} mode="Add" />,
    //         },
    //         {
    //           path: "add/:id",
    //           element: <AssetForm pageId={assetPageId} mode="Add" />,
    //         },
    //         {
    //           path: "update/:id",
    //           element: <AssetForm pageId={assetPageId} mode="Edit" />,
    //         },
    //         {
    //           path: "view/:id",
    //           element: <PreviewAsset mode="View" pageId={assetPageId} />,
    //         },
    //       ],
    //     },
    //   ],
    // },

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
      path: "shiftConfiguration",
      element: <Shift />,
    },
  ]);
  return router;
}

export default DigitalWorkflow;
