import { Card, Col, Row, Typography } from "antd";
import ReactApexChart from "react-apexcharts";
import { offset } from "react-tooltip";

const ProductionReport = () => {
  const data = [
    {
      date: "2023-09-25",
      oee: 70,
      productionCount: 80,
      performance: 75,
      quality: 90,
    },
    {
      date: "2023-09-26",
      oee: 75,
      productionCount: 85,
      performance: 80,
      quality: 95,
    },
    {
      date: "2023-09-27",
      oee: 80,
      productionCount: 90,
      performance: 85,
      quality: 92,
    },
    // Add more data points as needed
  ];

  const getChartOptions = (title, color) => ({
    chart: {
      type: "area",
      height: 350,
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      type: "datetime",
      categories: data.map((point) => new Date(point.date).getTime()), // Use timestamps
      title: {
        text: "Date", // Set X-axis title
        offsetY: 70,
        offsetX: -25,
      },
      labels: {
        formatter: function (value) {
          return new Date(value).toLocaleDateString(); // Format date for labels
        },
        rotate: -45,

        // Optional: rotate labels for better readability
      },
    },
    yaxis: {
      title: {
        text: "Percentage", // Set Y-axis title
      },
      labels: {
        formatter: function (val) {
          return val + "%"; // Add % sign
        },
      },
    },
    tooltip: {
      x: {
        formatter: function (val) {
          return new Date(val).toLocaleDateString(); // Format date in tooltip
        },
      },
      y: {
        formatter: function (val) {
          return val + "%"; // Add % sign to tooltip values
        },
      },
    },
    colors: [color],
  });

  return (
    <Row gutter={[16, 16]}>
      <Col sm={24} xs={24} md={12} lg={24}>
        <Card size="small" style={{ height: "300px" }} hoverable>
          <Typography.Title level={5}>OLE (%)</Typography.Title>
          <ReactApexChart
            options={getChartOptions("OLE", "#FFBD5A")}
            series={[{ name: "OEE", data: data.map((point) => point.oee) }]}
            type="area"
            height={250}
          />
        </Card>
      </Col>
      <Col sm={24} xs={24} md={12} lg={12}>
        <Card size="small" style={{ height: "300px" }} hoverable>
          <Typography.Title level={5}>Production Count</Typography.Title>
          <ReactApexChart
            options={getChartOptions("Production Count", "#8979FF")}
            series={[
              {
                name: "Total PartCount",
                data: data.map((point) => point.productionCount),
              },
            ]}
            type="area"
            height={250}
          />
        </Card>
      </Col>
      <Col sm={24} xs={24} md={12} lg={12}>
        <Card size="small" style={{ height: "300px" }} hoverable>
          <Typography.Title level={5}>Performance</Typography.Title>
          <ReactApexChart
            options={getChartOptions("Performance", "#F16529")}
            series={[
              {
                name: "Performance",
                data: data.map((point) => point.performance),
              },
            ]}
            type="area"
            height={250}
          />
        </Card>
      </Col>
      <Col sm={24} xs={24} md={12} lg={12}>
        <Card size="small" style={{ height: "300px" }} hoverable>
          <Typography.Title level={5}>Quality</Typography.Title>
          <ReactApexChart
            options={getChartOptions("Quality", "#928DAB")}
            series={[
              { name: "Quality", data: data.map((point) => point.quality) },
            ]}
            type="area"
            height={250}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ProductionReport;
