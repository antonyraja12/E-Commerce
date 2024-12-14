import moment from "moment";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function TimeSeriesGraphCbm(props) {
  const [height, setHeight] = useState("auto");
  const [title, setTitle] = useState("");
  const [series, setSeries] = useState([]);
  const [type, setType] = useState("line");
  const [category, setCategory] = useState([]);
  useEffect(() => {
    if (props.type) setType(props.type);
    if (props.title) setTitle(props.title);
    if (props.height) setHeight(props.height);
    if (props.series) {
      setSeries([
        {
          name: props.yaxis,
          data: props.series?.map((e) => e[props.yaxis]),
        },
      ]);
      setCategory(
        props.series?.map((e) =>
          moment(e.timestamp).format("YYYY-MM-DD hh:mm:ss A")
        )
      );
    }
  }, [props]);

  const options = {
    chart: {
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      //  labels: category,

      toolbar: {
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true | '<img src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "stepline",
      width: 2,
    },

    yaxis: {
      // max: 100,
      dataLabels: "floating",
      title: {
        style: {
          // color: undefined,
          fontSize: "12px",
          fontWeight: 600,
        },
      },
      // labels: {
      //   formatter: (val, opts) => {
      //     return val?.toFixed();
      //   },
      // },
    },
    fill: {
      opacity: 1,
    },

    xaxis: {
      type: "category",
      categories: category,
      // tickAmount: 7, // interval you want
      // labels: {
      //   show: true,
      //   formatter: function (val) {
      //     return moment(new Date(val)).format("h:mm a");
      //   },
      // },
      tooltip: {
        enabled: false,
        formatter: function (val) {
          return moment(new Date(val)).format("dddd, MMMM Do YYYY");
        },
      },
    },

    title: {
      text: props.title,
    },
  };
  return (
    <Chart
      title={title}
      options={{ ...options }}
      series={series}
      //type={type}
      height={height}
    />
  );
}

export default TimeSeriesGraphCbm;
