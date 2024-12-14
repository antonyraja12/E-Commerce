import React from "react";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const StackedBarChartCopy = (props) => {
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
      const parsedData = series.map((item) => ({
        date: new Date(item.date),
        dayName: item.dayName,
        sparePartId: item.sparePartId,
        count: item.count,
        sparePartName: item.sparePartName,
      }));

      const groupedData = parsedData.reduce((acc, cur) => {
        acc[cur.date] = acc[cur.date] || [];
        acc[cur.date].push(cur);
        return acc;
      }, {});

      const sparePartIds = [
        ...new Set(parsedData.map((item) => item.sparePartId)),
      ];

      const seriesData = sparePartIds.map((id) => {
        const spareDetails = parsedData.find((e) => e.sparePartId === id);
        return {
          name: spareDetails.sparePartName,
          dayName: spareDetails.dayName,
          data: Object.keys(groupedData).map((date) => {
            const item = groupedData[date].find(
              (item) => item.sparePartId === id
            );
            return item ? item.count : 0;
          }),
        };
      });
      console.log("seriesData", seriesData);
      setSeries(
        seriesData.map((item) => ({
          name: item.name,
          data: item.data,
        }))
      );
      console.log(
        "series.map((e) => e.name)",
        seriesData.map((e) => e.name)
      );
      setXaxisCategory([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]);
    }
    if (horizontal !== undefined) setHorizantal(horizontal);
    if (props.yaxisTitle) setYaxisTitle(props.yaxisTitle);
    if (title) setTitle(props.title);
    if (props.height) setHeight(props.height);
    if (props.series && props.series.length > 0)
      if (props.type) setType(props.type);
  }, [props]);
  const options = {
    series: series,
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      // stackType: "100%",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: horizontal,
        distributed: false,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    title: {
      text: "100% Stacked Bar",
    },
    xaxis: {
      categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K";
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  return (
    <div id="chart">
      <Chart
        options={options}
        series={options.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default StackedBarChartCopy;
