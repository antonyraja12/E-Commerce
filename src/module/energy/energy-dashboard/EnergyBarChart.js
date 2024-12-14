import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
const colors = ["#26a0fc"];

function BarChart(props) {
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
          data: series.map((e) => e.y),
        },
      ]);
      setXaxisCategory(series.map((e) => e.name));
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
      toolbar: {
        show: false,
      },
      markers: { size: 0 },
      events: {
        dataPointSelection: function (event, chartContext, config) {
          props.scrollTo(config);
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
        title: { formatter: (seriesName) => "" },
        formatter: (val, opts) => {
          return new Number(val) + " kWh";
        },
      },
    },

    yaxis: {},
    // fill: {
    //   opacity: 1,
    // },

    title: {
      text: title,
    },
    xaxis: {
      categories: xaxisCategory,
    },
    legend: { show: false },
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

export default BarChart;
