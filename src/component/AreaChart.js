import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import OeeCalculationService from "../services/oee-calculation-service";

function AreaChart(props) {
  const oeecalService = new OeeCalculationService();
  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (props.Id) {
      const fetchData = async () => {
        try {
          const response = await oeecalService.getGraph(props.Id);
          const formattedData = response.data.map((item) => ({
            x: new Date(item.timeStamp).getTime(),
            y: item.totalPartproduced,
          }));

          setSeries([
            {
              name: "Total Part Produced",
              data: formattedData,
              type: "line",
            },
          ]);

          // console.log("The timeStamps are ", formattedData);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 20000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [props.Id]);

  const options = {
    chart: {
      id: props.id,
      type: "area",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 2000,
        },
      },
      toolbar: {
        show: true,
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
      width: 1.5,
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
    yaxis: {},
    xaxis: {
      type: "datetime",
      tickAmount: 7,
      categories: (() => {
        const start = moment()
          .startOf("day")
          .set("hour", 10)
          .set("minute", 50)
          .valueOf();
        const end = moment()
          .startOf("day")
          .set("hour", 20)
          .set("minute", 0)
          .valueOf();
        const interval = (end - start) / 11; // Dividing the duration into 12 parts
        const xAxisCategories = [];
        for (let i = 0; i <= 11; i++) {
          const time = start + i * interval;
          xAxisCategories.push(moment(time).format("h:mm a"));
        }
        return xAxisCategories;
      })(),
      labels: {
        formatter: function (value) {
          return moment(value).format("h:mm a");
        },
      },
      max: new Date(props.ended).getTime,
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
        series={series}
        type="line"
        height={200}
      />
    </div>
  );
}

export default AreaChart;