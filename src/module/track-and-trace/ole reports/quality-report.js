import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, Col, Row, Typography } from "antd";

const { Title } = Typography;

const QualityReport = () => {
  const [data] = useState({
    partCounts: {
      accepted: [120, 100, 90, 80],
      rejected: [30, 20, 15, 25],
    },
    defectCategories: [
      { reason: "Wrinkles", count: 15, color: "#D9B4B4" },
      {
        reason: "Recliner Noise - Timing / Rattling Issue",
        count: 10,
        color: "#D9B4B4",
      },
      { reason: "Defective ODS module", count: 8, color: "#D9B4B4" },
      { reason: "Plastic Part scratch mark", count: 6, color: "#D9B4B4" },
      { reason: "Loose thread", count: 5, color: "#D9B4B4" },
    ],
  });

  const xAxisCategories = ["1", "2", "3", "4"];

  const partCountsOptions = {
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
        text: "Count",
      },
    },
    colors: ["rgba(0, 227, 150, 0.85)", "#FF0000"],
  };

  const defectCategoriesOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: true,
        borderRadius: 10,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.defectCategories.map((defect) => defect.reason),
      title: {
        text: "Defect Reasons",
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
    yaxis: {
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
    colors: data.defectCategories.map((defect) => defect.color),
  };

  return (
    <Row gutter={[16, 16]}>
      <Col sm={24} xs={24} md={12} lg={12}>
        <Card size="small" hoverable>
          <Title level={5}>Part Counts</Title>
          <ReactApexChart
            options={partCountsOptions}
            series={[
              {
                name: "Accepted",
                data: data.partCounts.accepted,
              },
              {
                name: "Rejected",
                data: data.partCounts.rejected,
              },
            ]}
            type="bar"
            height={250}
          />
        </Card>
      </Col>
      <Col sm={24} xs={24} md={12} lg={12}>
        <Card size="small" hoverable>
          <Title level={5}>Top 5 Defect Categories</Title>
          <ReactApexChart
            options={defectCategoriesOptions}
            series={[
              {
                name: "Defect Count",
                data: data.defectCategories.map((defect) => defect.count),
              },
            ]}
            type="bar"
            height={250}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default QualityReport;
