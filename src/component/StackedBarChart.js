import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ChecklistExecution from "../module/preventive-maintenance/checklistexecution/checklist-execution";
const colors = ["#26a0fc"];

function StackedBarChart(props) {
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
            return item ? (item.count == 0 ? null : item.count) : null;
          }),
        };
      });
      console.log("seri", seriesData, series);
      setSeries(
        seriesData.map((item) => ({
          name: item.name,
          data: item.data,
        }))
      );
      const dayNames = series.map((data) => data.dayName);
      const uniqueDates = [...new Set(dayNames)];

      console.log(uniqueDates, "seri");
      setXaxisCategory([...uniqueDates]);
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
      stacked: true,
      toolbar: {
        show: false,
      },
      markers: { size: 0 },
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: horizontal,
        distributed: false,
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
      // colors: colors,
    },
    tooltip: {
      enabled: true,

      y: {
        // title: { formatter: (seriesName) => "" },
        formatter: (val, opts) => {
          return new Intl.NumberFormat("en-IN").format(val);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    yaxis: {},

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

export default StackedBarChart;
