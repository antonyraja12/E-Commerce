import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import dayjs from "dayjs";
function ShiftPlanningDetailChart(props) {
  useEffect(() => {
    // setSeries([
    //   {
    //     data: props.data,
    //   },
    // ]);
    setSeries(props.data ?? []);
  }, [props.data]);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "rangeBar",
    },

    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
        // distributed: true,
        // dataLabels: {
        //   hideOverflowingLabels: true,
        // },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        var label =
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].meta
            .sequenceNumber;
        var a = moment(val[0]);
        var b = moment(val[1]);
        var diff = b.diff(a, "minutes");
        return label + " : " + diff + " min";
      },
      style: {
        colors: ["#f3f4f5", "#fff"],
      },
    },
    xaxis: {
      type: "datetime",
    },

    grid: {
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
      row: {
        colors: ["#f3f4f5", "#fff"],
        opacity: 1,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
        format: "dd MMM yyyy hh:mm tt",
      },
    },
  });
  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="rangeBar"
        height={350}
      />
    </div>
  );
}

export default ShiftPlanningDetailChart;
