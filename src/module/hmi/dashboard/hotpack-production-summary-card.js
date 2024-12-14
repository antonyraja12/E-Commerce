// import { Card, Tooltip, Typography, Button, Modal } from "antd";
// import React, { useContext, useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import QualityRejectionForm from "../../OEE/quality-rejection/quality-rejection-form";
// import { OeeDashboardContext } from "../../OEE/oee-dashboard/oee-dashboard-context";
// import HotpackPartcountForm from "./hotpack-partcount-form";
// import ModelTotalPartCountList from "../../OEE/model-total-part-count/model-total-part-count-list";
// function HotPackProductionSummaryCard({
//   assetId,
//   acceptedPartCount,
//   rejectedPartCount,
//   shiftAllocationId,
//   refreshService,
//   manualStatus,
//   runningStatus,
// }) {
//   const options = {
//     chart: {
//       height: 200,
//       type: "radialBar",
//     },
//     plotOptions: {
//       radialBar: {
//         offsetY: 0,
//         startAngle: 0,
//         endAngle: 280,
//         hollow: {
//           margin: 5,
//           size: "50%",
//         },
//         dataLabels: {
//           name: {
//             show: true,
//             fontSize: 8,
//             fontWeight: 400,
//           },
//           value: {
//             show: true,
//             offsetY: 7,
//             fontSize: 16,
//             formatter: function (val) {
//               return val;
//             },
//           },
//           total: {
//             show: true,
//             label: "Total",
//             formatter: function (w) {
//               return w.globals.seriesTotals?.reduce((a, b) => a + b, 0);
//             },
//           },
//         },
//       },
//     },
//     colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
//     labels: ["Accepted", "Rejected"],
//     legend: {
//       show: true,
//       floating: true,
//       fontSize: "12px",
//       position: "left",
//       offsetX: 50,
//       offsetY: 0,
//       labels: {
//         useSeriesColors: false,
//       },
//       markers: {
//         size: 0,
//       },
//       formatter: function (seriesName, opts) {
//         return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
//       },
//       itemMargin: {
//         vertical: 3,
//       },
//     },
//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           legend: {
//             show: false,
//           },
//         },
//       },
//     ],
//   };
//   const series = [acceptedPartCount, rejectedPartCount];
//   const { reloadDowntime, setReloadDowntime } = useContext(OeeDashboardContext);

//   const [qualityPopup, setQualityPopup] = useState({
//     open: false,
//     title: "Quality Rejection",
//   });
//   const [partCountPopup, setPartCountPopup] = useState({
//     open: false,
//     title: "Part Count",
//     mode: "Add",
//   });
//   const [Loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     if (partCountOnClose) {
//       partCountOnClose(); // Call the provided close function if available
//     }
//   };
//   const qualityPop = () => {
//     setLoading(true);
//     setQualityPopup({
//       ...qualityPopup,
//       open: true,
//       shiftAllocationId: shiftAllocationId,
//     });
//   };
//   const partCountPop = () => {
//     setLoading(true);
//     setPartCountPopup({
//       ...partCountPopup,
//       open: true,
//       shiftAllocationId: shiftAllocationId,
//     });
//   };

//   const qualityOnClose = () => {
//     setQualityPopup({ ...qualityPopup, open: false });
//     setReloadDowntime((prevReload) => prevReload + 1);
//     refreshService({ assetId });
//   };
//   const partCountOnClose = () => {
//     setPartCountPopup({ ...partCountPopup, open: false });
//     setReloadDowntime((prevReload) => prevReload + 1);
//     refreshService({ assetId });
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       refreshService({ assetId });
//     }, 60000);

//     return () => clearInterval(intervalId);
//   }, [assetId, refreshService]);
//   return (
//     <Card size="small">
//       <Typography.Title level={5}>Production Summary</Typography.Title>

//       <Tooltip title="Quality Rejection">
//         <img
//           src="/approved.png"
//           alt="Quality Assurance"
//           style={{
//             position: "absolute",
//             top: "16px",
//             right: "14px",
//             height: "26px",
//             width: "26px",
//             cursor: "pointer",
//           }}
//           size="small"
//           onClick={qualityPop}
//         />
//       </Tooltip>
//       <Tooltip title="Target PartCount">
//         <img
//           src="/Total.png"
//           style={{
//             top: "16px",
//             right: "54px",
//             height: "26px",
//             width: "26px",
//             cursor: "pointer",
//           }}
//           size="small"
//           onClick={showModal}
//         />
//       </Tooltip>
//       {manualStatus && manualStatus?.quality && runningStatus == "#33D04C" && (
//         <Tooltip title="Part Count">
//           <img
//             src="/partcount.png"
//             alt="Part Count"
//             style={{
//               position: "absolute",
//               top: "16px",
//               right: "54px",
//               height: "26px",
//               width: "26px",
//               cursor: "pointer",
//             }}
//             size="small"
//             onClick={partCountPop}
//           />
//         </Tooltip>
//       )}
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="radialBar"
//         height={200}
//       />

//       {qualityPopup.open && (
//         <QualityRejectionForm
//           {...qualityPopup}
//           close={qualityOnClose}
//           shiftAllocationId={shiftAllocationId}
//           assetId={assetId}
//         />
//       )}
//       {partCountPopup.open && (
//         <HotpackPartcountForm
//           {...partCountPopup}
//           close={partCountOnClose}
//           shiftAllocationId={shiftAllocationId}
//           assetId={assetId}
//         />
//       )}

//       <Modal
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width="80VW"
//       >
//         <ModelTotalPartCountList
//           {...partCountPopup}
//           close={handleCancel}
//           assetId={assetId}
//         />
//       </Modal>
//     </Card>
//   );
// }

// export default HotPackProductionSummaryCard;

import { Card, Tooltip, Typography, Button, Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import QualityRejectionForm from "../../OEE/quality-rejection/quality-rejection-form";
import { OeeDashboardContext } from "../../OEE/oee-dashboard/oee-dashboard-context";
import HotpackPartcountForm from "./hotpack-partcount-form";
import ModelTotalPartCountList from "../../OEE/model-total-part-count/model-total-part-count-list";

function HotPackProductionSummaryCard({
  assetId,
  acceptedPartCount,
  rejectedPartCount,
  shiftAllocationId,
  refreshService,
  manualStatus,
  runningStatus,
}) {
  const options = {
    chart: {
      height: 200,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 280,
        hollow: {
          margin: 5,
          size: "50%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: 8,
            fontWeight: 400,
          },
          value: {
            show: true,
            offsetY: 7,
            fontSize: 16,
            formatter: function (val) {
              return val;
            },
          },
          total: {
            show: true,
            label: "Total",
            formatter: function (w) {
              return w.globals.seriesTotals?.reduce((a, b) => a + b, 0);
            },
          },
        },
      },
    },
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
    labels: ["Accepted", "Rejected"],
    legend: {
      show: true,
      floating: true,
      fontSize: "12px",
      position: "left",
      offsetX: 50,
      offsetY: 0,
      labels: {
        useSeriesColors: false,
      },
      markers: {
        size: 0,
      },
      formatter: function (seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        vertical: 3,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  const series = [acceptedPartCount, rejectedPartCount];
  const { reloadDowntime, setReloadDowntime } = useContext(OeeDashboardContext);

  const [qualityPopup, setQualityPopup] = useState({
    open: false,
    title: "Quality Rejection",
  });
  const [partCountPopup, setPartCountPopup] = useState({
    open: false,
    title: "Part Count",
    mode: "Add",
  });
  const [Loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (partCountOnClose) {
      partCountOnClose(); // Call the provided close function if available
    }
  };

  const qualityPop = () => {
    setLoading(true);
    setQualityPopup({
      ...qualityPopup,
      open: true,
      shiftAllocationId: shiftAllocationId,
    });
  };

  const partCountPop = () => {
    setLoading(true);
    setPartCountPopup({
      ...partCountPopup,
      open: true,
      shiftAllocationId: shiftAllocationId,
    });
  };

  const qualityOnClose = () => {
    setQualityPopup({ ...qualityPopup, open: false });
    setReloadDowntime((prevReload) => prevReload + 1);
    refreshService({ assetId });
  };

  const partCountOnClose = () => {
    setPartCountPopup({ ...partCountPopup, open: false });
    setReloadDowntime((prevReload) => prevReload + 1);
    refreshService({ assetId });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshService({ assetId });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [assetId, refreshService]);

  return (
    <Card size="small">
      <Typography.Title level={5}>Production Summary</Typography.Title>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Tooltip title="Quality Rejection">
          <img
            src="/approved.png"
            alt="Quality Assurance"
            style={{
              height: "26px",
              width: "26px",
              cursor: "pointer",
              marginRight: "20px", // Adjust spacing as needed
            }}
            onClick={qualityPop}
          />
        </Tooltip>

        <Tooltip title="Target PartCount">
          <img
            src="/Total.png"
            alt="Target Part Count"
            style={{
              height: "26px",
              width: "26px",
              cursor: "pointer",
              marginRight: "20px", // Adjust spacing as needed
            }}
            onClick={showModal}
          />
        </Tooltip>

        {manualStatus &&
          manualStatus?.quality &&
          runningStatus === "#33D04C" && (
            <Tooltip title="Part Count">
              <img
                src="/partcount.png"
                alt="Part Count"
                style={{
                  height: "26px",
                  width: "26px",
                  cursor: "pointer",
                }}
                onClick={partCountPop}
              />
            </Tooltip>
          )}
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={200}
      />

      {qualityPopup.open && (
        <QualityRejectionForm
          {...qualityPopup}
          close={qualityOnClose}
          shiftAllocationId={shiftAllocationId}
          assetId={assetId}
        />
      )}

      {partCountPopup.open && (
        <HotpackPartcountForm
          {...partCountPopup}
          close={partCountOnClose}
          shiftAllocationId={shiftAllocationId}
          assetId={assetId}
        />
      )}

      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="80vw" // Corrected width value to 'vw' unit
      >
        <ModelTotalPartCountList
          {...partCountPopup}
          close={handleCancel}
          assetId={assetId}
        />
      </Modal>
    </Card>
  );
}

export default HotPackProductionSummaryCard;
