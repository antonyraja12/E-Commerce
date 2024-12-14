import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
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
function BarGraph(props) {
  const Navigate = useNavigate();
  const [height, setHeight] = useState(250);
  const [title, setTitle] = useState("");
  const [yaxisTitle, setYaxisTitle] = useState("");
  const [series, setSeries] = useState([]);
  const [typee, setType] = useState("line");
  const [xaxisCategory, setXaxisCategory] = useState([]);
  useEffect(() => {
    const { series, height, title, type, yaxisTitle } = props;
    if (series) {
      setSeries([
        {
          name: "Ticket",
          type: typee,
          data: series.map((e) => e.y),
        },
      ]);
      setXaxisCategory(series.map((e) => e.x));
    }
    if (props.yaxisTitle) setYaxisTitle(props.yaxisTitle);
    if (props.title) setTitle(props.title);
    if (props.height) setHeight(height);

    if (type) setType(type);
  }, [props]);

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
    <>
      {/* {JSON.stringify(props)} */}
      <Chart title={title} options={options} series={series} height={height} />
    </>
  );
}

export default BarGraph;
