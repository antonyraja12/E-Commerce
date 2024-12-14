import BaseWidget from "./base-widget";
import { GraphLibrary } from "../library";

export class BarChartWidget extends BaseWidget {
  state = {};
  widgetStyle() {
    return {
      width: "100%",
      height: "100%",
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { xaxis, categories } = props.properties;

    return {
      ...state,
      type: props?.properties?.type,
      series: props.series,
      options: {
        chart: { type: props?.properties?.type, height: "100%" },
        plotOptions: {
          bar: {
            // borderRadius: 4,
            horizontal: props.properties?.direction === "Horizontal",
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
        },
        xaxis: {
          tickAmount: xaxis?.tickAmount,
          tickPlacement: xaxis?.tickPlacement,
          position: xaxis?.position,
          label: {
            show: xaxis?.showLabel ?? true,
            rotate: xaxis?.rotateLabel,
          },
          categories: [...categories],
        },
        noData: {
          text: "No Data",
        },
      },
    };
  }
  render() {
    const { style } = this.props;
    const { options, series, type } = this.state;

    return (
      <div style={this.styleBuilder(style)}>
        <GraphLibrary
          type={type}
          options={options}
          series={series}
          height={"97%"}
          width={"100%"}
          style={{ width: "100%" }}
        />
      </div>
    );
  }
}
