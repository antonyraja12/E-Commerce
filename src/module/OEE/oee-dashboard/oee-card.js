import { Card, Typography } from "antd";
import ReactApexChart from "react-apexcharts";
function OeeCard({ oee, availability, performance, quality }) {
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
          size: "40%",
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
          },
          total: {
            show: true,
            label: "OEE",
            formatter: function (w) {
              return w.globals.seriesTotals[0] + "%";
            },
          },
          // offsetX: 0,
          // offsetY: -100,
        },
      },
    },
    colors: ["#1ab7ea", "#ff9800", "#cddc39", "#4caf50"],
    labels: ["OEE", "Availability", "Performance", "Quality"],
    legend: {
      show: true,
      floating: true,
      fontSize: "12px",
      position: "left",
      fontWeight: 500,
      offsetX: -10,
      offsetY: 0,
      labels: {
        // useSeriesColors: true,
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
  const series = [oee, availability, performance, quality];
  return (
    <Card size="small">
      <Typography.Title level={5}>
        Overall Equipment Efficiency
      </Typography.Title>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={200}
      />
    </Card>
  );
}

export default OeeCard;
