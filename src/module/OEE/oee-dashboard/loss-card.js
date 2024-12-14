import { Card, Typography } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import OeeCalculationService from "../../../services/oee-calculation-service";
import { OeeDashboardContext } from "./oee-dashboard-context";
import color from "../../configurations/color/color";

function LossCard({ startDate, endDate, assetId }) {
  const { reloadDowntime, setReloadDowntime } = useContext(OeeDashboardContext);
  const options = {
    chart: {
      height: 250,
      type: "line",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        endingShape: "rounded",
      },
    },
    stroke: {
      show: true,
      width: [1, 3],
    },
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    xaxis: {
      type: "category",
    },
    yaxis: [
      {
        title: {
          show: false,
        },
      },
      {
        opposite: true,
        title: {
          show: false,
        },
      },
    ],
  };

  const [series, setSeries] = useState([]);

  useMemo(() => {
    setSeries([
      {
        name: "Minutes",
        type: "column",
        data: [],
      },
      {
        name: "Loss %",
        type: "line",
        data: [],
      },
    ]);
    const service = new OeeCalculationService();
    service
      .getLossPercentage({
        startDate,
        endDate,
        assetId,
      })
      .then(({ data }) => {
        setSeries([
          {
            name: "Minutes",
            type: "column",
            data: data?.map((e, index) => ({
              x: e.reason,
              y: e.minutes,
              fillColor: e.color,
            })),
          },
          {
            name: "Loss %",
            type: "line",
            data: data?.map((e, index) => ({
              x: e.reason,
              y: e.lossPercentage,
              fillColor: e.color,
            })),
          },
        ]);
      });
  }, [reloadDowntime, startDate, endDate, assetId]);

  return (
    <Card size="small">
      <Typography.Title level={5}>Loss (%)</Typography.Title>

      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={250}
      />
    </Card>
  );
}

export default LossCard;
