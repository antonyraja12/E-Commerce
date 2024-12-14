import React, { useState } from "react";
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
function ChartLibrary(props) {
  const { type, data, legend } = props;
  const [_type, setType] = useState("pie");
  const [series, setSeries] = useState([]);

  const [_options, setOptions] = useState({
    chart: {
      // width: 380,
      type: _type,
    },
    labels: ["SDFSDF", "SDfsdf", "SDFsdf"],
    legend: {
      position: "right",
      show: true,
      horizontalAlign: "left",
      floating: false,
      fontSize: "14px",
      fontWeight: 400,
      showForNullSeries: true,
      showForZeroSeries: true,
      showForSingleSeries: false,
    },
    responsive: [
      {
        // breakpoint: 480,
        options: {
          chart: {
            //   width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  // useEffect(() => {
  //   // setType(type);
  //   if (legend) {
  //     setOptions((options) => ({
  //       ...options,
  //       // legend: legend,
  //     }));
  //   }
  // }, [type, legend]);
  // useEffect(() => {
  //   if (data) {
  //     setOptions((options) => ({
  //       ...options,
  //       labels: data?.map((e) => e.x) ?? [],
  //     }));
  //     setSeries(data?.map((e) => e.y) ?? []);
  //   }
  // }, [data]);
  return (
    <>
      <Chart {...props} width={"100%"} style={{ width: "100%" }} />
    </>
  );
}

export default ChartLibrary;
