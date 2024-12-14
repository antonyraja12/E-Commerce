import React from "react";

import {
  Navigate,
  useRoutes,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import Monitoring from "../condition-base-monitoring/monitoring/monitoring";
import PmDashboard from "../preventive-maintenance/dashboard/dashboard";
import ImDashboard from "../Inspection Management/dashboard/dashboard";
import QaDashboard from "../quality-inspection/dashboard/dashboard";
import MachineDetailDashboard from "../OEE/oee-dashboard/machine-detail-dashboard";
import EnergyLiveDashboard from "./energy-dashboard";
/*
import OeeDashboard from "../OEE/oee-dashboard/oee-dashboard";
import OeeMainDashboard from "./oee-dashboard";

import ReasonList from "../OEE/downtime-configuration/reason-list";
import QualityReasonList from "../OEE/quality-rejection/quality-reason-list";
import ModelConfigurationList from "../OEE/model-configuration/model-configuration-list";
import ModelMasterConfigurationList from "../OEE/model-master-configuration/model-master-configuration-list";
import QualityConfigurationList from "../OEE/quality-calculation-configuration.js/quality-configuration-list";
import ShiftConfiguration from "../shift/shift-configuration/shift-configuration";
import ShiftConfigurationForm from "../shift/shift-configuration/shift-configuration-form";
import ShiftConfigurationPreview from "../shift/shift-configuration/shift-configuration-preview";
import ShiftAllocation from "../shift/shift-allocation/shift-allocation";
import ShiftAllocationcalender from "../shift/shift-allocation/Shift-allocation-calender";
import Asset from "../configurations/asset/asset";
import Shift from "../shift/shift-master/shift";
import CbmDashboard from "./cbm-dashboard";
import MonitoringList from "../condition-base-monitoring/monitoring/list-card-view";
import MonitoringNew from "../condition-base-monitoring/monitoring/monitoring-new";
import ParameterReport from "../condition-base-monitoring/parameter-report/parameter-report";
import AlertReport from "../condition-base-monitoring/alert-report/alert-report";
import PmDashboard from "./pm-dashboard";
import Dashboard from "../preventive-maintenance/dashboard/dashboard";
import UserAccess from "../preventive-maintenance/configuration/user-access/user-access";
import Workflow from "../preventive-maintenance/configuration/workflow/workflow";
import Scheduler from "../preventive-maintenance/scheduler/scheduler";
import Schedulerform from "../preventive-maintenance/scheduler/schedulerform";
import ResolutionWorkOrder from "../preventive-maintenance/resolution-work-order/resolution-work-order";
import ResolutionWorkOrderForm from "../preventive-maintenance/resolution-work-order/resolution-work-order-form";
import ChecklistExecution from "../preventive-maintenance/checklistexecution/checklist-execution";
import ChecklistExecutionStepper from "../preventive-maintenance/checklistexecution/checklist-execution-stepper";
import Checklist from "../preventive-maintenance/configuration/checklist/checklist";
import ChecklistForm from "../preventive-maintenance/configuration/checklist/checklist-form";
import ChecklistUpload from "../preventive-maintenance/configuration/checklist/checkList-upload-form";
import CheckType from "../preventive-maintenance/configuration/check-type/check-type";
import Check from "../preventive-maintenance/configuration/check/check";
import Reports from "../preventive-maintenance/reports/reports";
import ChecklistExecutionReports from "../preventive-maintenance/reports/checklist-execution-reports";
import NewResolutionWorkOrderForm from "../preventive-maintenance/resolution-work-order/new-rwo-form";
import { TypeConfiguration } from "../preventive-maintenance/configuration/configuration-type";
import Priority from "../preventive-maintenance/configuration/priority/priority";
import MaintenanceType from "../preventive-maintenance/configuration/type-configuration/maintenanceType";

import {
  MaintenanceTypePageId,
  TypePageId,
  assetPageId,
  checkPageId,
  checkTypePageId,
  checklistExecutionPageId,
  checklistExecutionReportsPageId,
  checklistPageId,
  priortyPageId,
  resolutionWorkOrderPageId,
  rolePageId,
  smsandmailConfigurationId,
  userGroupPageId,
  userPageId,
} from "../../helpers/page-ids";
import ImMainDashboard from "./im-dashboard";
import IMDashboard from "../Inspection Management/dashboard/dashboard";
import IMUserAccess from "../Inspection Management/configuration/user-access/user-access";
import IMWorkflow from "../Inspection Management/configuration/workflow/workflow";
import IMScheduler from "../Inspection Management/scheduler/scheduler";
import IMSchedulerform from "../Inspection Management/scheduler/schedulerform";
import IMResolutionWorkOrder from "../Inspection Management/resolution-work-order/resolution-work-order";
import IMResolutionWorkOrderForm from "../Inspection Management/resolution-work-order/resolution-work-order-form";
import IMChecklistExecution from "../Inspection Management/checklistexecution/checklist-execution";
import IMChecklistExecutionStepper from "../Inspection Management/checklistexecution/checklist-execution-stepper";
import IMChecklist from "../Inspection Management/configuration/checklist/checklist";
import IMChecklistForm from "../Inspection Management/configuration/checklist/checklist-form";
import IMChecklistUpload from "../Inspection Management/configuration/checklist/checkList-upload-form";
import IMCheckType from "../Inspection Management/configuration/check-type/check-type";
import IMCheck from "../Inspection Management/configuration/check/check";
import IMReports from "../Inspection Management/reports/reports";
import IMChecklistExecutionReports from "../Inspection Management/reports/checklist-execution-reports";
import IMNewResolutionWorkOrderForm from "../Inspection Management/resolution-work-order/new-rwo-form";
import IMPriority from "../Inspection Management/configuration/priority/priority";
import IMMaintenanceType from "../Inspection Management/configuration/type-configuration/maintenanceType";

import QIMainDashboard from "./qi-dashboard";
import QIDashboard from "../quality-inspection/dashboard/dashboard";
import QIUserAccess from "../quality-inspection/configuration/user-access/user-access";
import QIWorkflow from "../quality-inspection/configuration/workflow/workflow";
import QIScheduler from "../quality-inspection/scheduler/scheduler";
import QISchedulerform from "../quality-inspection/scheduler/schedulerform";
import QIResolutionWorkOrder from "../quality-inspection/resolution-work-order/resolution-work-order";
import QIResolutionWorkOrderForm from "../quality-inspection/resolution-work-order/resolution-work-order-form";
import QIChecklistExecution from "../quality-inspection/checklistexecution/checklist-execution";
import QIChecklistExecutionStepper from "../quality-inspection/checklistexecution/checklist-execution-stepper";
import QIChecklist from "../quality-inspection/configuration/checklist/checklist";
import QIChecklistForm from "../quality-inspection/configuration/checklist/checklist-form";
import QIChecklistUpload from "../quality-inspection/configuration/checklist/checkList-upload-form";
import QICheckType from "../quality-inspection/configuration/check-type/check-type";
import QICheck from "../quality-inspection/configuration/check/check";
import QIReports from "../quality-inspection/reports/reports";
import QIChecklistExecutionReports from "../quality-inspection/reports/checklist-execution-reports";
import QINewResolutionWorkOrderForm from "../quality-inspection/resolution-work-order/new-rwo-form";
import QIPriority from "../quality-inspection/configuration/priority/priority";
import QIMaintenanceType from "../quality-inspection/configuration/type-configuration/maintenanceType";
import Entity from "../configurations/entity/entity";
import Location from "../configurations/location/location";
import Role from "../configurations/role/role";
import User from "../configurations/user/user";
import UserGroup from "../configurations/user-group/user-group";
import EntityHeirarchy from "../configurations/entity-heirarchy/entity-heirarchy";
import ModuleSelection from "../configurations/module-selection/module-selection";
import Gateway from "../configurations/gateway/gateway";
import Menu from "../configurations/menu/menu";
import SmsMailConfig from "../configurations/sms-configuration/sms-mail-config";
import Color from "../configurations/color/color";
import AssetForm from "../configurations/asset/asset-form";
import Preview from "../dynamic-dashboard/master/dashboard-master/preview";
import AssetFamily from "../configurations/asset-family/asset-family";

import EnergyReports from "../energy/energy-dashboard/energy-reports";
import EnergyDashboard from "../energy/energy-dashboard/energy-dashboard";
import DashboardDesigner from "../dynamic-dashboard";
import AssetEnergy from "../energy/asset-energy/asset-energy";
import DashboardMasterList from "../dynamic-dashboard/master/dashboard-master-list/dashboard-master-list";
import DashboardMaster from "../dynamic-dashboard/master/dashboard-master/dashboard-master";
import DigitalWorkInstructionStepper from "../digital-work-instruction/configuration/digital-work-instruction-config/digital-work-instruction-stepper";
import DigitalWorkInstructionList from "../digital-work-instruction/configuration/digital-work-instruction-config/digital-work-instruction-list";
import DwiExcelUplaodStepper from "../digital-work-instruction/digital-work-instruction-excel-upload/stepper";
import WorkInstructionReport from "../digital-work-instruction/work-instruction-report/report";
import DigitalInstructionExecution from "../digital-work-instruction/Execution/dwi-execution";
import InventoryReport from "../spare-parts-management/report/inventory-report";
import PurchaseHistoryList from "../spare-parts-management/purchase-history/purchase-history-list";
import SupplierList from "../spare-parts-management/supplier/supplier-list";
import StockJournalForm from "../spare-parts-management/stock-journal/stock-journal-form";
import InventoryRequest from "../spare-parts-management/request/inventory-request";
import InventoryUpload from "../spare-parts-management/configuration/inventory-upload-form";
import InventoryConfiguration from "../spare-parts-management/configuration/inventory-config";
import InventoryCategory from "../spare-parts-management/category/inventory-category";
import SpareDashboard from "../spare-parts-management/dashboard/dashboard";
import StockJournal from "../spare-parts-management/stock-journal/stock-journal-list";
import ProcessList from "../digital-work-instruction/configuration/process_config/process-list";
import OeeDashboardNew from "../OEE/oee-dashboard-all/dashboard";

*/
function Overall() {
  const [searchParams, setSearchParams] = useSearchParams();
  const aHId = searchParams.get("aHId");
  const assetId = searchParams.get("assetId");
  /*const router = useRoutes([
    {
      index: true,
      element: <Navigate to="oee" />,
    },
    {
      path: "oee",
      children: [
        {
          index: true,
          element: <OeeMainDashboard />,
        },
        {
          path: "dashboard",
          element: <OeeDashboardNew />,
        },
        {
          path: "machine-detail-dashboard",
          element: <MachineDetailDashboard />,
        },
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
          element: <ShiftAllocationcalender />,
        },
        {
          path: "configuration/asset",
          element: <Asset />,
        },
        {
          path: "shiftConfiguration",
          element: <Shift />,
        },
      ],
    },
    {
      path: "cbm",
      children: [
        {
          index: true,
          element: <CbmDashboard />,
        },
        {
          path: "monitoring",
          element: <Monitoring />,
        },
        {
          path: "monitoring-new",
          element: <MonitoringNew />,
        },
        {
          path: "parameter-report",
          element: <ParameterReport />,
        },
        {
          path: "alert-report",
          element: <AlertReport />,
        },
      ],
    },
    {
      path: "pm",
      children: [
        {
          index: true,
          element: <PmDashboard />,
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
              element: <Schedulerform />,
            },
            {
              path: "update/:id",
              element: <Schedulerform />,
            },
            {
              path: "edit/:id",
              element: <Schedulerform />,
            },
          ],
        },
        {
          path: "resolution-work-order",
          children: [
            {
              index: true,
              element: (
                <ResolutionWorkOrder pageId={resolutionWorkOrderPageId} />
              ),
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
                  children: [
                    {
                      index: true,
                      element: <Navigate to="type" />,
                    },
                    {
                      path: "priority",
                      element: <Priority pageId={priortyPageId} />,
                    },

                    {
                      path: "type",
                      element: (
                        <MaintenanceType pageId={MaintenanceTypePageId} />
                      ),
                    },
                  ],
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
            {
              path: "check-type",
              element: <CheckType pageId={checkTypePageId} />,
            },
            {
              path: "checks",
              element: <Check pageId={checkPageId} />,
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
            <ChecklistExecutionReports
              pageId={checklistExecutionReportsPageId}
            />
          ),
        },
      ],
    },
    {
      path: "im",
      children: [
        {
          index: true,
          element: <ImMainDashboard />,
        },
        {
          path: "dashboard",
          element: <IMDashboard />,
        },
        {
          path: "useracess",
          element: <IMUserAccess />,
        },

        {
          path: "workflow",
          element: <IMWorkflow />,
        },
        {
          path: "scheduler",
          children: [
            {
              index: true,
              element: <IMScheduler />,
            },
            {
              path: "add",
              element: <IMSchedulerform />,
            },
            {
              path: "update/:id",
              element: <IMSchedulerform />,
            },
            {
              path: "edit/:id",
              element: <IMSchedulerform />,
            },
          ],
        },
        {
          path: "resolution-work-order",
          children: [
            {
              index: true,
              element: (
                <IMResolutionWorkOrder pageId={resolutionWorkOrderPageId} />
              ),
            },

            {
              path: "add",
              element: (
                <IMResolutionWorkOrderForm
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
                  element: <IMNewResolutionWorkOrderForm />,
                },
                {
                  path: "issue-type",
                  element: <TypeConfiguration pageId={TypePageId} />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="type" />,
                    },
                    {
                      path: "priority",
                      element: <IMPriority pageId={priortyPageId} />,
                    },

                    {
                      path: "type",
                      element: (
                        <IMMaintenanceType pageId={MaintenanceTypePageId} />
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: "update/:id",
              element: (
                <IMResolutionWorkOrderForm
                  mode="Edit"
                  pageId={resolutionWorkOrderPageId}
                />
              ),
            },
            {
              path: "edit/:id",
              element: (
                <IMResolutionWorkOrderForm pageId={resolutionWorkOrderPageId} />
              ),
            },
          ],
        },
        {
          path: "checklist-execution",
          children: [
            {
              index: true,
              element: (
                <IMChecklistExecution pageId={checklistExecutionPageId} />
              ),
            },
            {
              path: "add",
              element: (
                <IMChecklistExecutionStepper
                  mode="Add"
                  pageId={checklistExecutionPageId}
                />
              ),
            },

            {
              path: "update/:id",
              element: (
                <IMChecklistExecutionStepper
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
              element: <IMChecklist pageId={checklistPageId} />,
            },
            {
              path: "add",
              element: <IMChecklistForm mode="Add" pageId={checklistPageId} />,
            },
            {
              path: "update/:id",
              element: <IMChecklistForm mode="Edit" pageId={checklistPageId} />,
            },
            {
              path: "view/:id",
              element: <IMChecklistForm mode="View" pageId={checklistPageId} />,
            },
            {
              path: "uploadChecklist",
              element: <IMChecklistUpload />,
            },
            {
              path: "check-type",
              element: <IMCheckType pageId={checkTypePageId} />,
            },
            {
              path: "checks",
              element: <IMCheck pageId={checkPageId} />,
            },
          ],
        },

        {
          path: "resolution-work-order-reports",
          element: <IMReports />,
        },
        {
          path: "checklist-execution-reports",
          element: (
            <IMChecklistExecutionReports
              pageId={checklistExecutionReportsPageId}
            />
          ),
        },
      ],
    },
    {
      path: "qi",
      children: [
        {
          index: true,
          element: <QIMainDashboard />,
        },
        {
          path: "dashboard",
          element: <QIDashboard />,
        },
        {
          path: "useracess",
          element: <QIUserAccess />,
        },

        {
          path: "workflow",
          element: <QIWorkflow />,
        },
        {
          path: "scheduler",
          children: [
            {
              index: true,
              element: <QIScheduler />,
            },
            {
              path: "add",
              element: <QISchedulerform />,
            },
            {
              path: "update/:id",
              element: <QISchedulerform />,
            },
            {
              path: "edit/:id",
              element: <QISchedulerform />,
            },
          ],
        },
        {
          path: "resolution-work-order",
          children: [
            {
              index: true,
              element: (
                <QIResolutionWorkOrder pageId={resolutionWorkOrderPageId} />
              ),
            },

            {
              path: "add",
              element: (
                <QIResolutionWorkOrderForm
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
                  element: <QINewResolutionWorkOrderForm />,
                },
                {
                  path: "issue-type",
                  element: <TypeConfiguration pageId={TypePageId} />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="type" />,
                    },
                    {
                      path: "priority",
                      element: <QIPriority pageId={priortyPageId} />,
                    },

                    {
                      path: "type",
                      element: (
                        <QIMaintenanceType pageId={MaintenanceTypePageId} />
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: "update/:id",
              element: (
                <QIResolutionWorkOrderForm
                  mode="Edit"
                  pageId={resolutionWorkOrderPageId}
                />
              ),
            },
            {
              path: "edit/:id",
              element: (
                <QIResolutionWorkOrderForm pageId={resolutionWorkOrderPageId} />
              ),
            },
          ],
        },
        {
          path: "checklist-execution",
          children: [
            {
              index: true,
              element: (
                <QIChecklistExecution pageId={checklistExecutionPageId} />
              ),
            },
            {
              path: "add",
              element: (
                <QIChecklistExecutionStepper
                  mode="Add"
                  pageId={checklistExecutionPageId}
                />
              ),
            },

            {
              path: "update/:id",
              element: (
                <QIChecklistExecutionStepper
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
              element: <QIChecklist pageId={checklistPageId} />,
            },
            {
              path: "add",
              element: <QIChecklistForm mode="Add" pageId={checklistPageId} />,
            },
            {
              path: "update/:id",
              element: <QIChecklistForm mode="Edit" pageId={checklistPageId} />,
            },
            {
              path: "view/:id",
              element: <QIChecklistForm mode="View" pageId={checklistPageId} />,
            },
            {
              path: "uploadChecklist",
              element: <QIChecklistUpload />,
            },
            {
              path: "check-type",
              element: <QICheckType pageId={checkTypePageId} />,
            },
            {
              path: "checks",
              element: <QICheck pageId={checkPageId} />,
            },
          ],
        },

        {
          path: "resolution-work-order-reports",
          element: <QIReports />,
        },
        {
          path: "checklist-execution-reports",
          element: (
            <QIChecklistExecutionReports
              pageId={checklistExecutionReportsPageId}
            />
          ),
        },
      ],
    },
    {
      path: "settings",
      children: [
        {
          index: true,
          element: <Navigate to="asset" />,
        },
        {
          path: "entity",
          element: <Entity />,
        },
        {
          path: "location",
          element: <Location />,
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
          path: "user-group",
          element: <UserGroup pageId={userGroupPageId} />,
        },

        {
          path: "entity-heirarchy",
          element: <EntityHeirarchy />,
        },
        {
          path: "module-selection",
          element: <ModuleSelection />,
        },

        {
          path: "gateway",
          element: <Gateway />,
        },
        {
          path: "menu",
          element: <Menu />,
        },
        {
          path: "sms-mail-configuration",
          element: <SmsMailConfig pageId={smsandmailConfigurationId} />,
        },
        {
          path: "color/*",
          element: <Color />,
        },
        {
          path: "asset",
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
              element: <Preview mode="View" pageId={assetPageId} />,
            },
            {
              path: "asset-family",
              element: <AssetFamily />,
            },
          ],
        },
      ],
    },
    {
      path: "energy",
      children: [
        {
          index: true,
          element: <AssetEnergy />,
        },
        {
          path: "dashboard",
          children: [
            {
              index: true,
              element: <EnergyLiveDashboard />,
            },
          ],
        },
        {
          path: "reports",
          element: <EnergyReports />,
        },
      ],
    },
    {
      path: "dashboard-designer",
      children: [
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
      ],
    },
    {
      path: "dwi",
      children: [
        {
          index: true,
          element: <DigitalInstructionExecution />,
        },
        {
          path: "update/:id",
          element: <DigitalInstructionExecution />,
        },
        {
          path: "report",
          element: <WorkInstructionReport />,
        },
        {
          path: "work-instruction",
          children: [
            {
              index: true,
              element: <DigitalWorkInstructionList />,
            },
            {
              path: "add",
              element: <DigitalWorkInstructionStepper />,
            },
            {
              path: "process",
              element: <ProcessList />,
            },
          ],
        },
      ],
    },

    {
      path: "excel-upload",
      element: <DwiExcelUplaodStepper />,
    },
    {
      path: "spare-parts",
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" />,
        },
        {
          path: "dashboard",
          element: <SpareDashboard />,
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
          path: "report",
          element: <InventoryReport />,
        },
      ],
    },
  ]);
  */
  const router = useRoutes([
    {
      path: "oee",
      element: <MachineDetailDashboard hideFilter={true} />,
    },
    {
      path: "cbm",
      element: <Monitoring hideFilter={true} />,
    },
    {
      path: "energy",
      element: (
        <EnergyLiveDashboard hideFilter={true} assetId={assetId} aHId={aHId} />
      ),
    },
    {
      path: "pm",
      element: (
        <PmDashboard
          hideFilter={true}
          assetId={[Number(assetId)]}
          aHId={aHId}
        />
      ),
    },
    {
      path: "im",
      element: (
        <ImDashboard
          hideFilter={true}
          assetId={[Number(assetId)]}
          aHId={aHId}
        />
      ),
    },
    {
      path: "qa",
      element: (
        <QaDashboard
          hideFilter={true}
          assetId={[Number(assetId)]}
          aHId={aHId}
        />
      ),
    },
  ]);
  return router;
}

export default Overall;
