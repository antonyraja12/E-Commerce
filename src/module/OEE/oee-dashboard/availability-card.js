import { Card, Typography } from "antd";
import ReactApexChart from "react-apexcharts";
function AvailabilityCard({ downTime, runTime, plannedDownTime }) {
  const options = {
    chart: {
      height: 200,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 40,
        offsetX: 80,
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
            fontSize: 12,
            fontWeight: 400,
          },
          value: {
            show: true,
            offsetY: 7,
            fontSize: 16,
            formatter: function (val) {
              return val + " mins";
            },
          },
          total: {
            show: true,
            label: "Run Time",
            formatter: function (w) {
              return w.globals.seriesTotals[0] + " mins";
            },
          },
          // offsetX: 0,
          // offsetY: -100,
        },
      },
    },
    colors: ["#4caf50", "#1ab7ea", "#ff9800", "#91caff"],
    labels: ["Run Time", "Unplanned Down Time", "Planned Down Time"],
    legend: {
      show: true,
      floating: true,
      fontSize: "12px",
      position: "left",
      offsetX: -10,
      offsetY: 0,
      labels: {
        // useSeriesColors: true,
      },
      markers: {
        size: 0,
      },
      formatter: function (seriesName, opts) {
        return (
          seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + " mins"
        );
      },
      // itemMargin: {
      //   vertical: 3,
      // },
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
  const series = [
    runTime ?? 0,
    downTime ?? 0 - plannedDownTime ?? 0,
    plannedDownTime ?? 0,
  ];

  return (
    <Card size="small">
      <Typography.Title level={5}>Availability</Typography.Title>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={200}
      />
    </Card>
  );
}

export default AvailabilityCard;
