import { Card, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import OeeCalculationService from "../../../services/oee-calculation-service";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";

function DowntimeCardTwo({ startDate, endDate, assetId }) {
  const options = {
    chart: {
      height: 250,
      type: "rangeBar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
      },
    },
    legends: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      show: true,
    },

    grid: {
      row: {
        colors: ["#f3f4f5", "#fff"],
        opacity: 1,
      },
    },
  };

  /* const options = {
    chart: {
      height: 350,
      type: "rangeBar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        rangeBarGroupRows: true,
      },
    },

    fill: {
      type: "solid",
    },
    xaxis: {
      type: "datetime",
    },
    legend: {
      position: "right",
    },
  };*/
  const [reason, setReason] = useState([]);
  const [reasonHash, setReasonHash] = useState({});
  const [series, setSeries] = useState([]);

  useMemo(() => {
    const service = new DowntimeReasonService();
    service.list().then(({ data }) => {
      setReason([
        { text: "Running", color: "#13ef10" },
        { text: "Down", color: "#e42f0a" },
        ...data
          ?.filter((e) => e.parentId === null)
          .map((e) => ({ text: e.downtimeReason, color: e.colourCode })),
      ]);
    });
  }, []);

  useEffect(() => {
    let rh = {};
    for (let r of reason) {
      rh[r.text?.toLowerCase()] = r.color;
    }
    setReasonHash(rh);
  }, [reason]);

  useEffect(() => {
    setSeries([
      {
        name: "Downtime",
        data: [],
      },
    ]);
    const service = new OeeCalculationService();
    service
      .getMachineStatusSummary({
        startDate,
        endDate,
        assetId,
      })
      .then(({ data }) => {
        setSeries([
          {
            name: "Downtime",
            data: data
              ?.map((e) => ({
                x: e.downtimeReason,
                y: [
                  new Date(e.start).getTime(),
                  e.end ? new Date(e.end).getTime() : new Date().getTime(),
                ],
                fillColor: e.color,
              }))
              .slice(0, 10),
          },
        ]);
      });
  }, [startDate, endDate, assetId]);

  return (
    <Card size="small">
      <Typography.Title level={5}>Machine Status</Typography.Title>
      {/*
      <Flex wrap="wrap" justify="center">
        {reason?.map((e) => (
          <Tag style={{ marginBottom: 10 }}>
            <Badge
              color={e.color}
              text={e.text}
              styles={{ whiteSpace: "no-wrap" }}
            />
          </Tag>
        ))}
      </Flex> */}
      <ReactApexChart
        options={options}
        series={series}
        type="rangeBar"
        height={250}
      />
    </Card>
  );
}

export default DowntimeCardTwo;
