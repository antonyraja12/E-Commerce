import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const XAXISRANGE = 40000;
function LiveChart(props) {
  const [data, setData] = useState([]);
  const { value, title, id } = props;
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const newDataPoint = {
        x: currentTime,
        y: parseFloat(props.value),
      };
      setData((data) => [
        ...data,
        {
          x: currentTime,
          y: parseFloat(props.value),
        },
      ]);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  const options = {
    chart: {
      id: id,
      height: 350,
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
    title: {
      // text: title,
      align: "left",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      range: XAXISRANGE,
    },
    // yaxis: {
    //   max: 100,
    // },
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

export default LiveChart;
