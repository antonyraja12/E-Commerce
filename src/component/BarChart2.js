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

function BarChart2(props) {
  const Navigate = useNavigate();
  const [height, setHeight] = useState(200);
  const [title, setTitle] = useState("Aging of Work Order");
  const [yaxisTitle, setYaxisTitle] = useState("");
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);
  const [horizontal, setHorizantal] = useState(true);
  const [xaxisCategory, setXaxisCategory] = useState([]);
  const [type, setType] = useState("bar");

  useEffect(() => {
    // console.log(props);
    const { horizontal, series, height, title, type, yaxisTitle } = props;
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
  }, [props]);

  const options = {
    chart: {
      type: "bar",
      events: {
        dataPointSelection: function (event, chartContext, config) {
          // console.log("config",config)
          if (
            props.callbackClick &&
            typeof props.callbackClick === "function"
          ) {
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

      y: {
        formatter: (val, opts) => {
          return new Intl.NumberFormat("en-IN").format(val);
        },
      },
    },
    yaxis: {},

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
    noData: {
      text: "No Data",
    },
  };

  return (
    <>
      {/* {JSON.stringify(props)} */}

      <Chart
        title={title}
        options={options}
        series={series}
        type={type}
        height={height}
      />
    </>
  );
}

export default BarChart2;
