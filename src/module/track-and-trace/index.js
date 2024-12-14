import { Card, Layout } from "antd";
import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { AccessProvider } from "../../hooks/useAccess";
import ProtectedRoute from "../../utils/protected-route";
import Andon from "./andon/andon";
import AndonNew from "./andon/andon-new";
import Andon1 from "./andon/andon1";
import Assembly from "./assembly/assembly";
import Bypass from "./bypass/bypass";
import Container from "./container";
import DefectChecklist from "./defect-checklist/defectChecklist";
import Delay from "./delay/delay";
import Device from "./device/device";
import DeviceType from "./device/deviceType";
import JobOrder from "./job-order/job-order";
import JobOrderAssembly from "./job-order/job-order-assembly";
import Landing from "./landing";
import LineMaster from "./line/line-master";
import LossReason from "./loss-reason/loss-reason";
import OverallReport from "./ole reports/overall-report";
import Ole from "./ole/ole";
import Operation from "./operation/operation";
import OperatorLanding from "./operator-landing";
import Product from "./product/product-list";
import Report from "./report/report";
import ScannerForm from "./scanner-byepass/scanner-form";
import ShiftWisePartCountForm from "./shift-setting/part-count-form";
import ShiftSetting from "./shift-setting/shift-setting";
import Traceability from "./traceability/traceability";
import WorkInstruction from "./work-instruction/work-instruction";
import WorkInstructionFormNew from "./work-instruction/work-instruction-form-new";
import CameraStation from "./work-station-instance/camera-station";
import Operator from "./work-station-instance/operator";
import QualityAnalysis from "./work-station-instance/work-station-qa";
import ReworkStation from "./work-station-instance/work-station-rework";
import Preview from "./work-station/preview-list";
import Properties from "./work-station/property-list";
import ServiceList from "./work-station/service-list";
import SubscriptionList from "./work-station/subscription-list";
import WorkStation from "./work-station/work-station";
import Devicelist from "./work-station/work-station-device-list";
import WorkStationForm from "./work-station/work-station-form";
import WorkstationStepper from "./work-station/work-station-stepper";
import Category from "./product/category/category";
import Model from "./product/model/model";
import Variant from "./product/variant/variant";
import Reprint from "./assembly/reprint";

const ShiftModule = lazy(() => import("../shift"));
const UserModule = lazy(() => import("../configurations"));

const { Content } = Layout;
function TAT() {
  const router = useRoutes([
    {
      path: "operator/*",
      element: <OperatorLanding />,
      children: [
        {
          path: "andon1",
          element: <Andon1 />,
        },
        {
          path: "station/:id",
          element: <Operator />,
        },
        {
          path: "camera",
          element: <CameraStation />,
        },
        { path: "andon", element: <AndonNew /> },
      ],
    },
    {
      element: (
        <ProtectedRoute>
          <AccessProvider>
            <Container />
          </AccessProvider>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" />,
        },
        {
          path: "station/:id",
          element: <Operator />,
        },
        {
          path: "assembly",
          element: <Assembly />,
        },
        {
          path: "work-station-instance/:id",
          element: <Operator />,
        },
        {
          path: "job-order",
          children: [
            {
              index: true,
              element: <JobOrder />,
            },
            {
              path: ":id/assembly",
              element: <JobOrderAssembly />,
            },
          ],
        },

        { path: "assembly-quality/:id", element: <QualityAnalysis /> },
        { path: "andon1", element: <Andon /> },
        { path: "report", element: <OverallReport /> },
        { path: "rework-station/:id", element: <ReworkStation /> },
        { path: "traceability", element: <Traceability /> },

        { path: "dashboard", element: <Ole /> },
        { path: "shift-setting", element: <ShiftSetting /> },
        { path: "bypass", element: <ScannerForm /> },
        { path: "delay", element: <Delay /> },
        { path: "reprint", element: <Reprint /> },
        { path: "shift-wise-parts", element: <ShiftWisePartCountForm /> },
        { path: "andon", element: <AndonNew /> },
        {
          path: "configuration/*",
          children: [
            {
              index: true,
              element: <Landing />,
            },
            { path: "loss-reason", element: <LossReason /> },
            {
              path: "job-order",
              element: <JobOrder />,
            },
            {
              path: "work-instruction",

              children: [
                { index: true, element: <WorkInstruction /> },
                {
                  path: "add",
                  element: <WorkInstructionFormNew />,
                },

                {
                  path: ":id",
                  element: <WorkInstructionFormNew disabled={true} />,
                },
                {
                  path: ":id/update",
                  element: <WorkInstructionFormNew />,
                },
              ],
            },
            {
              path: "work-station",
              children: [
                {
                  index: true,
                  element: <WorkStation />,
                },
                {
                  path: "add",
                  element: <WorkstationStepper />,
                  children: [
                    {
                      index: true,
                      element: <WorkStationForm />,
                    },
                    {
                      path: ":id/basic-details",
                      element: <WorkStationForm />,
                    },
                    {
                      path: ":id/device",
                      element: <Devicelist />,
                    },
                    {
                      path: ":id/properties",
                      element: <Properties />,
                    },
                    {
                      path: ":id/service",
                      element: <ServiceList />,
                    },
                    {
                      path: ":id/subscription",
                      element: <SubscriptionList />,
                    },
                    {
                      path: ":id/preview",
                      element: <Preview mode="view" />,
                    },
                  ],
                },

                {
                  path: "update",
                  element: <WorkstationStepper />,
                  children: [
                    {
                      index: true,
                      element: <WorkStationForm />,
                    },
                    {
                      path: ":id/basic-details",
                      element: <WorkStationForm />,
                    },
                    {
                      path: ":id/device",
                      element: <Devicelist />,
                    },
                    {
                      path: ":id/properties",
                      element: <Properties />,
                    },
                    {
                      path: ":id/subscription",
                      element: <SubscriptionList />,
                    },
                    {
                      path: ":id/service",
                      element: <ServiceList />,
                    },
                    {
                      path: ":id/preview",
                      element: <Preview />,
                    },
                  ],
                },
                {
                  path: ":id/view",
                  element: (
                    <Card>
                      <Preview />
                    </Card>
                  ),
                },
              ],
            },
            {
              path: "category",
              element: <Category />,
            },
            { path: "model", element: <Model /> },
            { path: "variant", element: <Variant /> },

            {
              path: "product",
              element: <Product />,
            },
            {
              path: "line-master",
              element: <LineMaster />,
            },
            {
              path: "device",
              element: <Device />,
            },
            {
              path: "device-type",
              element: <DeviceType />,
            },
            {
              path: "defect-checklist",
              element: <DefectChecklist />,
            },
            { path: "loss-reason", element: <LossReason /> },
            {
              path: "shift/*",
              element: <ShiftModule />,
            },
          ],
        },
        {
          path: "user/*",
          element: <UserModule />,
        },

        {
          path: "part-count-report",
          element: <Report />,
        },
        {
          path: "operation",
          element: <Operation />,
        },
      ],
    },
  ]);

  return router;
}

export default TAT;
