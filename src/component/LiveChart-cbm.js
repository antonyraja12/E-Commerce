import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function LiveChartCBM(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const newDataPoint = {
        x: currentTime,
        y: parseFloat(props.data2),
      };

      setData((prevData) => [...prevData, newDataPoint]);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [props.data2]);
  useEffect(() => {
    setData([]);
  }, [props.title]);

  const options = {
    chart: {
      id: props.id,
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    grid: {
      strokeDashArray: 5,
      show: true,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    noData: {
      text: "No Data",
    },
    markers: {
      size: 0,
    },
    yaxis: {
      // max: 100,
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
      align: "left",
    },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={[
          {
            name: props.title || "Series",
            data: data,
          },
        ]}
        type={options.chart.type}
        height={props.height || "300px"}
      />
    </div>
  );
}

export default LiveChartCBM;