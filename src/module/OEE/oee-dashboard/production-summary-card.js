import { Card, Tooltip, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import QualityRejectionForm from "../quality-rejection/quality-rejection-form";
import { OeeDashboardContext } from "./oee-dashboard-context";

function ProductionSummaryCard({
  assetId,
  acceptedPartCount,
  rejectedPartCount,
  shiftAllocationId,
  refreshService,
}) {
  const options = {
    chart: {
      height: 200,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 40,
        offsetX: 50,
        startAngle: 0,
        endAngle: 280,
        hollow: {
          margin: 5,
          size: "50%",
          // background: "transparent",
          // image: undefined,
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
      offsetX: -10,
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
  const [Loading, setLoading] = useState(false);

  const qualityPop = () => {
    setLoading(true);
    setQualityPopup({
      ...qualityPopup,
      open: true,
      shiftAllocationId: shiftAllocationId,
    });
  };

  const qualityOnClose = () => {
    setQualityPopup({ ...qualityPopup, open: false });
    setReloadDowntime((prevReload) => prevReload + 1);

    // Refresh the service when quality popup is closed
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
      <Tooltip title="Quality Rejection">
        <img
          src="/approved.png"
          alt="Quality Assurance"
          style={{
            position: "absolute",
            top: "16px",
            right: "14px",
            height: "26px",
            width: "26px",
            cursor: "pointer",
          }}
          size="small"
          onClick={qualityPop}
        />
      </Tooltip>
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
    </Card>
  );
}

export default ProductionSummaryCard;
