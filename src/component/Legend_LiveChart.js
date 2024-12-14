import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
const RealTimeChart = (props) => {
  const [interval, setIntervalVal] = useState(null);
  const [height, setHeight] = useState("auto");
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [type, setType] = useState("line");

  const options = {
    chart: {
      type: type,
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: true,
        zoom: {
          enabled: true,
        },
      },
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },

    yaxis: {
      // max: 100,
      dataLabels: "floating",
      title: {
        style: {
          // color: undefined,
          fontSize: "12px",
          fontWeight: 600,
        },
      },
      labels: {
        formatter: (val, opts) => {
          return val?.toFixed();
        },
      },
    },
    fill: {
      opacity: 1,
    },

    xaxis: {
      type: "datetime",
      labels: {
        show: true,
        formatter: function (value, timestamp) {
          const date = new Date(timestamp);
          return date.toLocaleTimeString();
        },
      },
      range: 20000,
      // min: currentTime,
      max: new Date().getTime(),
    },

    title: {
      text: props.title,
    },
    legend: {
      show: true,
    },
    // colors: ["red", "yellow", "blue"],
    colors: props.colors,
  };

  const [series, setSeries] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date().getTime();
      setSeries((prevSeries) => {
        if (!Array.isArray(prevSeries)) {
          prevSeries = [];
        }
        if (!props?.data) {
          return prevSeries;
        }
        const updatedSeries = props.data.map((e, index) => {
          const existingLine = prevSeries.find((line) => line.name === e.name);
          const lineColor = options.colors[index] || "blue";
          if (existingLine) {
            return {
              name: e.name,
              data: [...existingLine.data, { x: newDate, y: e.data }],
              color: lineColor,
            };
          } else {
            return {
              name: e.name,
              data: [{ x: newDate, y: e.data }],
              color: lineColor,
            };
          }
        });
        return updatedSeries;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.data]);

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="line"
        height={props.height}
      />
    </div>
  );
};

export default RealTimeChart;
