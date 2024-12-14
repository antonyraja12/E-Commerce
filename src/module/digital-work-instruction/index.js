import React from "react";

import { Navigate, useRoutes } from "react-router-dom";
import ProcessList from "./configuration/process_config/process-list";
import DigitalInstructionExecution from "./Execution/dwi-execution";
import DwiExcelUplaodStepper from "./digital-work-instruction-excel-upload/stepper";

import WorkInstructionReport from "./work-instruction-report/report";
import DigitalWorkInstructionStepper from "./configuration/digital-work-instruction-config/digital-work-instruction-stepper";
import WorkinstructionList from "./configuration/digital-work-instruction-config/digital-work-instruction-list";
import PreviewList from "./configuration/digital-work-instruction-config/work-instruction-preview";
import { Card } from "antd";
function Dwi() {
  const router = useRoutes([
    {
      index: true,
      element: <Navigate to="execution" />,
    },
    {
      path: "execution",
      children: [
        {
          index: true,
          element: <DigitalInstructionExecution />,
        },
        {
          path: "update/:id",
          element: <DigitalInstructionExecution />,
        },
      ],
    },

    {
      path: "work-instruction",

      children: [
        {
          index: true,
          element: <WorkinstructionList />,
        },
        {
          path: "add",
          element: <DigitalWorkInstructionStepper mode="add" />,
        },
        {
          path: "edit/:id",
          element: <DigitalWorkInstructionStepper mode="edit" />,
        },
        {
          path: "view/:id",
          element: (
            <Card>
              <PreviewList mode="view" />
            </Card>
          ),
        },
      ],
    },
    {
      path: "process",
      element: <ProcessList />,
    },
    {
      path: "excel-upload",
      element: <DwiExcelUplaodStepper />,
    },
    {
      path: "report",
      element: <WorkInstructionReport />,
    },
  ]);
  return router;
}

// Export the component without invoking it
export default Dwi;
