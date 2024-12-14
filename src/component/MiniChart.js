import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import EnergyDetailDashboardService from "../services/energy-services/energy-detail-dashboard-service";
const colors = [
  "#26a0fc",
  "#26e7a6",
  "#febc3b",
  "#ff6178",
  "#8b75d7",
  "#6d848e",
  "#46b3a9",
  "#d830eb",
];
function MiniChart(props) {
  const service = new EnergyDetailDashboardService();
  const [height, setHeight] = useState(250);
  const [width, setWidth] = useState(0);
  const [title, setTitle] = useState("");
  const [yaxisTitle, setYaxisTitle] = useState("");
  const [series, setSeries] = useState([]);
  const [typee, setType] = useState("line");
  const [xaxisCategory, setXaxisCategory] = useState([]);
  useEffect(() => {
    const { series, height, width, title, type, yaxisTitle, assetId } = props;
    // if (series) {
    //   setSeries([
    //     {
    //       data: series,
    //     },
    //   ]);
    //   // setXaxisCategory(series.map((e) => e.x));
    // }
    if (assetId) {
      service.getDashboardDetails(assetId).then(({ data }) => {
        setSeries([
          {
            data: data.map((e) => e.meterReading),
          },
        ]);
      });
    }
    if (props.yaxisTitle) setYaxisTitle(props.yaxisTitle);
    if (props.title) setTitle(props.title);
    if (props.height) setHeight(height);
    if (width) setWidth(width);
    if (type) setType(type);
  }, [props]);

  var options1 = {
    // series: [
    //   {
    //     data: series,
    //   },
    // ],
    chart: {
      type: "line",
      height: props.height,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      width: 3,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };
  const options = {
    chart: {
      height: height,
      events: {
        click: function (event, chartContext, config) {
          if (
            props.callbackClick2 &&
            typeof props.callbackClick2 === "function"
          ) {
            // console.log("config", (xaxisCategory[config.dataPointIndex]))
            props.callbackClick2(xaxisCategory[config.click]);
          }
        },
      },
    },
    colors: colors,
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
        labels: {
          show: true,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },

    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return new Intl.NumberFormat("en-IN").format(val);
      },
    },
    tooltip: {
      enabled: true,

      y: {
        formatter: (val, opts) => {
          return new Intl.NumberFormat("en-IN").format(val);
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: colors,
    },
    labels: xaxisCategory,
    yaxis: {
      dataLabels: "floating",
      title: {
        text: yaxisTitle,
        style: {
          color: undefined,
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    title: {
      text: props.title,
    },
    xaxis: {
      type: "category",
      // categories: xaxisCategory,
      position: "bottom",
    },
    noData: {
      text: "No Data",
    },
  };
  return (
    // console.log("series", series),
    <>
      {/* {JSON.stringify(props)} */}
      <Chart
        title={title}
        options={options1}
        series={series}
        height={options1.chart?.height}
        width={width}
      />
    </>
  );
}

export default MiniChart;
