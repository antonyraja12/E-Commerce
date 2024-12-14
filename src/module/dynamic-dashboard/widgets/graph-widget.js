import BaseWidget from "./base-widget";
import { GraphLibrary } from "../library";
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
export class GraphWidget extends BaseWidget {
  state = {
    series: [],
    options: {
      chart: {
        height: "100%",
        width: "100%",
        events: {
          // dataPointSelection: (event, chartContext, config) => {
          //   props.click(event, chartContext, config);
          // },
        },
      },
      colors: colors,
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 0,
        position: "back",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
          labels: {
            show: true,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
        radar: {
          // size: 140,
          polygons: {
            strokeColors: "#e9e9e9",
            fill: {
              colors: ["#f8f8f8", "#fff"],
            },
          },
        },
      },

      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return new Intl.NumberFormat("en-IN").format(val);
        },
      },
      tooltip: {
        enabled: true,

        y: {
          formatter: (val, opts) => {
            return new Intl.NumberFormat("en-IN").format(val);
          },
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: colors,
      },
      // labels: xaxisCategory,
      yaxis: {
        dataLabels: "floating",
        title: {
          // text: yaxisTitle,
          style: {
            color: undefined,
            fontSize: "12px",
            fontWeight: 600,
          },
        },
      },
      fill: {
        opacity: 1,
      },

      // title: {
      //   text: props.title,
      // },
      xaxis: {
        type: "category",
        // categories: xaxisCategory,
        position: "bottom",
      },
      noData: {
        text: "No Data",
      },
    },
  };
  widgetStyle() {
    return {
      width: "100%",
      height: "calc(100% - 20px)",
    };
  }
  componentDidMount() {
    // this.setState();
  }
  render() {
    const { style, properties } = this.props;
    const { series, options } = this.state;

    return (
      <div style={this.styleBuilder(style)}>
        <GraphLibrary
          series={series ?? []}
          options={options}
          height="100%"
          style={{ width: "100%" }}
          {...properties}
        />
      </div>
    );
  }
}
