import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import ChecklistExecution from "../module/preventive-maintenance/checklistexecution/checklist-execution";
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

function BarChart1(props) {
  const Navigate = useNavigate();
  const [height, setHeight] = useState(200);
  const [title, setTitle] = useState();
  const [yaxisTitle, setYaxisTitle] = useState("");
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);
  const [horizontal, setHorizantal] = useState(true);
  const [xaxisCategory, setXaxisCategory] = useState([]);
  const [type, setType] = useState("bar");
  const [toolbarShow, setToolBarShow] = useState(true);
  const [legendStatus, setLegendStatus] = useState(true);
  const [ylableStatus, setYlableStatus] = useState(true);
  useEffect(() => {
    const {
      horizontal,
      series,
      height,
      title,
      type,
      ylableShow,
      toolbarStatus,
      legendShow,
    } = props;
    if (series) {
      setSeries([
        {
          data: series.map((e) => e.y),
        },
      ]);
      setXaxisCategory(series.map((e) => e.x));
    }
    if (horizontal !== undefined) setHorizantal(horizontal);
    if (props.yaxisTitle) setYaxisTitle(props.yaxisTitle);
    if (title) setTitle(props.title);
    if (props.height) setHeight(props.height);
    if (props.series && props.series.length > 0)
      if (props.type) setType(props.type);
    if (toolbarStatus !== undefined) setToolBarShow(toolbarStatus);
    if (legendShow !== undefined) setLegendStatus(legendShow);
    if (ylableShow !== undefined) setYlableStatus(ylableShow);
  }, [props]);

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: toolbarShow, // Set toolbar show option to false to hide the download button
      },

      events: {
        dataPointSelection: function (event, chartContext, config) {
          //  console.log("config", props.callbackClick(xaxisCategory[config.dataPointIndex]))
          if (
            props.callbackClick &&
            typeof props.callbackClick === "function"
          ) {
            // console.log("config", (xaxisCategory[config.dataPointIndex]))
            props.callbackClick(xaxisCategory[config.dataPointIndex]);
          }
        },
      },
    },
    colors: colors,
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: horizontal,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return new Intl.NumberFormat("en-IN").format(val);
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: colors,
    },
    tooltip: {
      enabled: true,
      formatter: function (tooltipModel) {
        let tooltipText = "";
        if (tooltipModel.body && tooltipModel.body.length) {
          const dataPoint = tooltipModel.dataPoints[0]; // Assuming single data point
          const value = dataPoint.raw.y; // Fetching the y value
          tooltipText = new Intl.NumberFormat("en-IN").format(value); // Formatting the value
        }
        return tooltipText;
      },
      y: {
        formatter: (val, opts) => {
          return new Intl.NumberFormat("en-IN").format(val);
        },
      },
    },
    yaxis: {
      labels: {
        show: ylableStatus,
      },
    },

    title: {
      text: title,
    },
    xaxis: {
      categories: xaxisCategory,
      // type:props.xaxisType?props.xaxisType:'datetime',
      title: {
        text: props.xaxisTitle ? props.xaxisTitle : "",
      },
      labels: {
        show: true,
        style: {
          // colors: colors,
          // fontSize: "12px",
        },
      },
    },
    legend: {
      // Add the legend property here
      show: legendStatus, // Set to true to enable legend
      position: "top", // Adjust position as per your requirement
    },
    noData: {
      text: "No Data",
    },
  };
  return (
    <Chart
      title={title}
      options={options}
      series={series}
      type={type}
      height={height}
    />
  );
}

export default BarChart1;
