import React from "react";

import { Navigate, useRoutes } from "react-router-dom";
import {
  MaintenanceTypePageId,
  TypePageId,
  appHierarchyPageId,
  checkPageId,
  checkTypePageId,
  checklistExecutionPageId,
  checklistExecutionReportsPageId,
  checklistPageId,
  priortyPageId,
  reportPageId,
  resolutionWorkOrderPageId,
  rolePageId,
  schedulerPageId,
  smsandmailConfigurationId,
  userPageId,
  useraccessPageId,
} from "../../helpers/page-ids";
import Role from "../configurations/role/role";
import User from "../configurations/user/user";
import ChecklistExecution from "./checklistexecution/checklist-execution";
import ChecklistExecutionStepper from "./checklistexecution/checklist-execution-stepper";
import AppHierarchy from "./configuration/app-hierarchy/app-hierarchy";
import CheckType from "./configuration/check-type/check-type";
import Check from "./configuration/check/check";
import ChecklistUpload from "./configuration/checklist/checkList-upload-form";
import Checklist from "./configuration/checklist/checklist";
import ChecklistForm from "./configuration/checklist/checklist-form";
import Configuration from "./configuration/configuration";
import ConfigurationSub from "./configuration/configuration-sub";
import UserAccess from "./configuration/user-access/user-access";
import Workflow from "./configuration/workflow/workflow";
import Dashboard from "./dashboard/dashboard";
import Reports from "./reports/reports";
import ResolutionWorkOrder from "./resolution-work-order/resolution-work-order";
import ResolutionWorkOrderForm from "./resolution-work-order/resolution-work-order-form";
import Scheduler from "./scheduler/scheduler";
import SchedulerForm from "./scheduler/schedulerform";
import LogoUpload from "../configurations/logo/logo";
import Menu from "../configurations/menu/menu";
import SmsAndMailConfiguration from "../configurations/sms-configuration/sms-mail-config";
import SmsMailAuto from "../configurations/sms-mail-auto-configuration/sms-mail-auto";
import CheckAssetFileBulkUpload from "../configurations/system-config.js/check-asset-file-bulk-upload";
import CheckAssetFileMapping from "../configurations/system-config.js/check-assets-file-mapping";
import TypeConfiguration from "../quality-inspection/configuration/configuration-type";
import Priority from "../quality-inspection/configuration/priority/priority";
import MaintenanceType from "../quality-inspection/configuration/type-configuration/maintenanceType";
import MainDashboardCbm from "../quality-inspection/dashboard-cbm/dashboard-cbm";
import NewResolutionWorkOrderForm from "./resolution-work-order/new-rwo-form";

import ChecklistExecutionReports from "../quality-inspection/reports/checklist-execution-reports";
import SchedluerUpload from "../quality-inspection/scheduler/scheduler-form-upload";
function QualityInspection() {
  const router = useRoutes([
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "dashboard-cbm",
      element: <MainDashboardCbm />,
    },
    {
      path: "useraccess",
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
              element: <NewResolutionWorkOrderForm />,
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
      path: "issue-type",
      element: <TypeConfiguration pageId={TypePageId} />,
      children: [
        {
          index: true,
          element: <Navigate to="priority" />,
        },
        {
          path: "priority",
          element: <Priority pageId={priortyPageId} />,
        },

        {
          path: "type",
          element: <MaintenanceType pageId={MaintenanceTypePageId} />,
        },
      ],
    },
    {
      path: "resolution-work-order-reports",
      element: <Reports />,
    },
    {
      path: "checklist-execution-reports",
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
      path: "/checks",
      element: <Check />,
    },
    {
      path: "/check-type",
      element: <CheckType />,
    },
    {
      path: "/checklist",
      children: [
        {
          index: true,
          element: <Checklist />,
        },
        {
          path: "add",
          element: <ChecklistForm mode="Add" />,
        },

        {
          path: "update/:id",
          element: <ChecklistForm mode="Edit" />,
        },
        {
          path: "view/:id",
          element: <ChecklistForm mode="View" />,
        },

        {
          path: "uploadChecklist",
          element: <ChecklistUpload />,
        },
      ],
    },

    {
      path: "configuration",
      element: <Configuration />,
      children: [
        {
          index: true,
          element: <Navigate to="check-list" />,
        },
        {
          path: "app-hierarchy",
          element: <AppHierarchy pageId={appHierarchyPageId} />,
        },
        {
          path: "check-type",
          element: <CheckType pageId={checkTypePageId} />,
        },
        {
          path: "check-list",
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
              path: "check",
              element: <Check pageId={checkPageId} />,
            },

            {
              path: "uploadChecklist",
              element: <ChecklistUpload />,
            },

            {
              path: "uploadChecklist",
              element: <ChecklistUpload />,
            },
          ],
        },
      ],
    },

    {
      path: "configuration/general",
      element: <ConfigurationSub />,
      children: [
        {
          index: true,
          element: <Navigate to="user" />,
        },
        {
          path: "role",
          element: <Role pageId={rolePageId} />,
        },
        {
          path: "user",
          element: <User pageId={userPageId} />,
        },
        {
          path: "sms-mail-configuration",
          element: (
            <SmsAndMailConfiguration pageId={smsandmailConfigurationId} />
          ),
        },
        {
          path: "useraccess",
          element: <UserAccess pageId={useraccessPageId} />,
        },
        {
          path: "logo",
          element: <LogoUpload />,
        },
        {
          path: "module",
          element: <SmsMailAuto />,
        },
        {
          path: "file-mapping",
          element: <CheckAssetFileMapping />,
        },
        {
          path: "file-bulk-upload",
          element: <CheckAssetFileBulkUpload />,
        },
      ],
    },
  ]);
  return router;
}

export default QualityInspection;
