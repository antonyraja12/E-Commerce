import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const Donut = (props) => {
  const [series, setSeries] = useState([]);
  const [height, setHeight] = useState(200);
  const [option, setOptions] = useState({});
  const [legend, setLegend] = useState(false);
  const [legendPosition, setLegendPosition] = useState("right");

  useEffect(() => {
    props.legend && setLegend(props.legend);
    props.legendPosition && setLegendPosition(props.legendPosition);
  }, [props.legend]);

  const options = {
    ...(props.color && { colors: props.color }),
    chart: {
      type: "donut",
    },
    dataLabels: {
      enabled: true,
      formatter: function (value, { seriesIndex, w }) {
        return w.config.series[seriesIndex];
      },
      style: {
        fontSize: "12px",
      },
    },
    legend: {
      show: legend,
      position: legendPosition,
    },
    labels: props.series?.map((item) => Object.keys(item)[0]),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  useEffect(() => {
    if (props.series) {
      setSeries(props.series?.map((item) => Object.values(item)[0]));
      setOptions((prevOptions) => ({
        ...prevOptions,
        labels:
          props.series.length > 0
            ? props.series?.map((item) => Object.keys(item)[0])
            : [],
      }));
      const { height } = props;
      setHeight(height);
    }
  }, [props.series]);
  return (
    <>
      <Chart
        options={options}
        series={series}
        type="donut"
        height={height}
        labels="center"
      />
    </>
  );
};

export default Donut;
