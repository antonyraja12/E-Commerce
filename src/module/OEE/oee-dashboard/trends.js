import { useEffect, useMemo, useState } from "react";
import OeeCalculationService from "../../../services/oee-calculation-service";
import { Card, Typography } from "antd";
import moment from "moment";
import ReactApexChart from "react-apexcharts";

function Trends({ assetId, startDate, endDate }) {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const options = {
    chart: {
      height: 250,
      type: "line",
    },
    fill: {
      //   type: ["solid", "gradient", "gradient", "gradient"],
    },
    stroke: {
      width: [4, 4, 4, 4],
    },

    dataLabels: {
      enabled: false,
      enabledOnSeries: [1],
    },
    labels: labels,
    // colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
    colors: ["#1ab7ea", "#ff9800", "#cddc39", "#4caf50"],
    xaxis: {
      type: "datetime",
      labels: {
        formatter: function (val) {
          return moment(val).utcOffset("+05:30").format(" hh:mm A");
        },
      },
    },
    yaxis: [
      {
        max: 100,
      },
    ],
    // yaxis: [
    //   {
    //     title: {
    //       text: "OEE",
    //     },
    //   },
    //   {
    //     opposite: true,
    //     title: {
    //       text: "Availability",
    //     },
    //   },
    //   {
    //     opposite: true,
    //     title: {
    //       text: "Performance",
    //     },
    //   },
    //   {
    //     opposite: true,
    //     title: {
    //       text: "Quality",
    //     },
    //   },
    // ],
  };
  // useMemo(() => {
  //   if (assetId && startDate && endDate) {
  //     const service = new OeeCalculationService();
  //     setLoading(true);
  //     service
  //       .getGraph({ assetId, startDate, endDate })
  //       .then(({ data }) => {
  //         // let lastData = data.slice(-100); // Limit data to last 100 entries
  //         let lastData = data;
  //         // Map and cap values to maximum of 100 for each series
  //         const cappedData = lastData.map((e) => ({
  //           ...e,
  //           oee: Math.min(e.oee ?? 0, 100),
  //           availability: Math.min(e.availability ?? 0, 100),
  //           performance: Math.min(e.performance ?? 0, 100),
  //           quality: Math.min(e.quality ?? 0, 100),
  //         }));

  //         setLabels(
  //           cappedData?.map((e) => new Date(e.timestamp).getTime()) ?? []
  //         );
  //         setSeries([
  //           {
  //             name: "OEE",
  //             data: cappedData?.map((e) => e.oee ?? 0) ?? [],
  //           },
  //           {
  //             name: "Availability",
  //             data: cappedData?.map((e) => e.availability ?? 0) ?? [],
  //           },
  //           {
  //             name: "Performance",
  //             data: cappedData?.map((e) => e.performance ?? 0) ?? [],
  //           },
  //           {
  //             name: "Quality",
  //             data: cappedData?.map((e) => e.quality ?? 0) ?? [],
  //           },
  //         ]);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   } else {
  //     setLabels([]);
  //     setSeries([
  //       {
  //         name: "OEE",
  //         data: [],
  //       },
  //       {
  //         name: "Availability",
  //         data: [],
  //       },
  //       {
  //         name: "Performance",
  //         data: [],
  //       },
  //       {
  //         name: "Quality",
  //         data: [],
  //       },
  //     ]);
  //   }
  // }, [assetId, startDate, endDate]);

  useMemo(() => {
    if (assetId && startDate && endDate) {
      const service = new OeeCalculationService();
      setLoading(true);
      service
        .getGraph({ assetId, startDate, endDate })
        .then(({ data }) => {
          // let lastData = data.slice(-20);
          let lastData = data;
          setLabels(
            lastData?.map((e) => new Date(e.timestamp).getTime()) ?? []
          );
          setSeries([
            // {
            //   name: "Part Produced",
            //   type: "line",
            //   data: data?.map((e) => e.totalPartProduced ?? 0),
            // },
            {
              name: "OEE",
              // type: "line",
              data: lastData?.map((e) => e.oee ?? 0) ?? [],
            },
            {
              name: "Availability",
              // type: "line",
              data: lastData?.map((e) => e.availability) ?? [],
            },
            {
              name: "Performance",
              // type: "area",
              data: lastData.map((e) => e.performance) ?? [],
            },
            {
              name: "Quality",
              // type: "area",
              data: lastData.map((e) => e.quality) ?? [],
            },
          ]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLabels([]);
      setSeries([
        {
          name: "OEE",
          // type: "line",
          data: [],
        },
        {
          name: "Availability",
          // type: "line",
          data: [],
        },
        {
          name: "Performance",
          // type: "area",
          data: [],
        },
        {
          name: "Quality",
          // type: "area",
          data: [],
        },
      ]);
    }
  }, [assetId, startDate, endDate]);

  return (
    <Card loading={loading} size="small">
      <Typography.Title level={5}>Trends</Typography.Title>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={250}
      />
    </Card>
  );
}

export default Trends;
