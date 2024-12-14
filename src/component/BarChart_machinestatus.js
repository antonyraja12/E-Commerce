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

function BarChart_Machinestatus(props) {
  const Navigate = useNavigate();
  const [height, setHeight] = useState(200);
  const [title, setTitle] = useState(undefined);
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
    const { horizontal, series, height, title, type, yaxisTitle, mode } = props;
    if (series) {
      setSeries([
        {
          name: "Running",
          data: series.filter((e) => {
            return e.status === "Running";
          }),
        },
        {
          name: "Down",
          data: series.filter((e) => {
            return e.status === "Down";
          }),
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
      stacked: true,
      type: "bar",

      dataPointSelection: function (event, chartContext, config) {
        // console.log("config", props.callbackClick(xaxisCategory))
        //  console.log("config", props.callbackClick1(xaxisCategory[config.dataPointIndex]))
        if (props.callbackClick && typeof props.callbackClick === "function") {
          // console.log("config", (xaxisCategory[config.dataPointIndex]))
          props.callbackClick(xaxisCategory[config.dataPointIndex]);
        }
      },
    },

    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: horizontal,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val, opts) {
        return new Intl.NumberFormat("en-IN").format(val);
      },
    },

    tooltip: {
      enabled: true,
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

export default BarChart_Machinestatus;
