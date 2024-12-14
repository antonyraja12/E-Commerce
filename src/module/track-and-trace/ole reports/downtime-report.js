import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, Col, Row, Typography } from "antd";

const { Title } = Typography;

const DowntimeReport = () => {
  const [data, setData] = useState({
    runtime: [120, 100, 90, 80],
    downtime: [30, 20, 15, 25],
    reasons: [
      { reason: "Machine failure loss", minutes: 40, color: "#FEBC3B" },
      { reason: "Setup & adjustment", minutes: 10, color: "#FF928A" },
      { reason: "Minor stoppages ", minutes: 30, color: "#00AAFF" },
      { reason: "Startup loss ", minutes: 20, color: "#82A3C9" },
      { reason: "Speed loss", minutes: 10, color: "#26E7A6" },
    ],
    occurrences: [
      { reason: "Machine failure loss", count: 40, color: "#FEBC3B" },
      { reason: "Setup & adjustment", count: 10, color: "#FF928A" },
      { reason: "Minor stoppages ", count: 30, color: "#00AAFF" },
      { reason: "Startup loss ", count: 20, color: "#82A3C9" },
      { reason: "Speed loss", count: 10, color: "#26E7A6" },
    ],
  });

  const xAxisCategories = ["1", "2", "3", "4"];

  // Chart options for Runtime/Downtime
  const runtimeDowntimeOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: 350,
    },
    xaxis: {
      categories: xAxisCategories,
      title: {
        text: "Date",
        offsetY: 90,
        offsetX: -20,
      },
    },
    yaxis: {
      title: {
        text: "Minutes",
      },
    },
    colors: ["rgba(0, 227, 150, 0.85)", "#FF0000"],
  };

  // Chart options for Downtime Reasons
  const downtimeReasonsOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    // labels: data.reasons.map((reason) => reason.reason),
    labels: {
      show: true,
      style: {
        fontSize: "12px", // Adjust font size as needed
      },
      formatter: (val) => {
        const words = val.split(" ");
        return words.slice(0, 2).join(" "); // Show only the first two words
      },
    },
    xaxis: {
      categories: data.occurrences.map((entry) => entry.reason),
      title: {
        text: "Reasons",
        offsetY: 90,
        offsetX: -20,
      },
      labels: {
        show: true,
        style: {
          fontSize: "12px", // Adjust font size as needed
        },
        formatter: (val) => {
          const words = val.split(" ");
          return words.slice(0, 2).join(" "); // Show only the first two words
        },
      },
    },
    tooltip: {
      enabled: true,
      x: {
        formatter: (val) => `${val}`,
      },
    },
    yaxis: {
      title: {
        text: "Counts",
      },
    },
    // tooltip: {
    //   y: {
    //     formatter: (val) => `${val} minutes`,
    //   },
    // },

    colors: data.reasons.map((reason) => reason.color),
  };

  // Chart options for Downtime Occurrences
  const downtimeOccurrencesOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      title: {
        text: "Reason",
      },
    },
    xaxis: {
      categories: data.occurrences.map((entry) => entry.reason),
      title: {
        text: "Count",
      },
    },
    tooltip: {
      enabled: true,
      x: {
        formatter: (val) => `${val} counts`,
      },
    },
    colors: data.occurrences.map((entry) => entry.color),
  };

  // Chart options for Downtime in Minutes
  const downtimeMinutesOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: data.reasons.map((reason) => reason.reason),
    tooltip: {
      y: {
        formatter: (val) => `${val} minutes`,
      },
    },
    colors: data.reasons.map((reason) => reason.color),
  };

  return (
    <Row gutter={[16, 16]}>
      <Col sm={24} xs={24} md={24} lg={12} xl={12}>
        <Card size="small" hoverable>
          <Title level={5}>Total Runtime/Downtime</Title>
          <ReactApexChart
            options={runtimeDowntimeOptions}
            series={[
              {
                name: "Runtime",
                data: data.runtime,
              },
              {
                name: "Downtime",
                data: data.downtime,
              },
            ]}
            type="bar"
            height={250}
          />
        </Card>
      </Col>
      <Col sm={24} xs={24} md={24} lg={12} xl={12}>
        <Card size="small" hoverable>
          <Title level={5}>Downtime Reasons</Title>
          <ReactApexChart
            options={downtimeReasonsOptions}
            series={[
              { name: "Downtime", data: data.reasons.map((r) => r.minutes) },
            ]}
            type="bar"
            height={250}
          />
          {/* <Modal
              title={`Details for ${
                selectedReason ? selectedReason.reason : ""
              }`}
              open={open}
              onOk={() => setOpen(false)}
              onCancel={() => setOpen(false)}
              width={1000}
              destroyOnClose
            >
              {selectedReason && (
                <DowntimeReasonList
                  reason={selectedReason.reason}
                  minutes={selectedReason.minutes}
                  // Pass any additional props needed here
                />
              )}
            </Modal> */}
        </Card>
      </Col>
      <Col sm={24} xs={24} md={24} lg={12} xl={12}>
        <Card size="small" hoverable>
          <Title level={5}>Downtime Occurrences</Title>
          <ReactApexChart
            options={downtimeOccurrencesOptions}
            series={[
              {
                name: "Counts",
                data: data.occurrences.map((item) => item.count),
              },
            ]}
            type="bar"
            height={250}
          />
        </Card>
      </Col>
      <Col sm={24} xs={24} md={24} lg={12} xl={12}>
        <Card size="small" hoverable>
          <Title level={5}>Downtime (Minutes)</Title>
          <ReactApexChart
            options={downtimeMinutesOptions}
            series={data.reasons.map((reason) => reason.minutes)}
            type="pie"
            height={250}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DowntimeReport;
