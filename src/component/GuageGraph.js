import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function GuageGraph(props) {
  const [height, setHeight] = useState(175);
  const [title, setTitle] = useState("");
  const [series, setSeries] = useState([]);
  useEffect(() => {
    if (props.title) setTitle(props.title);
    if (props.height) setHeight(props.height);
    if (props.series && props.series.length > 0) setSeries(props.series);
  }, [props]);

  const options = {
    series: [240],
    options: {
      chart: {
        type: "radialBar",
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "60%",
            background: "#fff",
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: "front",
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24,
            },
          },
          track: {
            background: "#fff",
            strokeWidth: "67%",
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35,
            },
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: "#888",
              fontSize: "14px",
            },
            value: {
              formatter: function (val) {
                return parseInt(val);
              },
              color: "#111",
              fontSize: "18px",
              show: true,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#ABE5A1"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Voltage"],
    },
  };
  return (
    <Chart
      title={title}
      options={options.options}
      series={options.series}
      type="radialBar"
      height={height}
    />
  );
}

export default GuageGraph;
