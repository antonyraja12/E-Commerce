import ChartLibrary from "../library/chart-library";
import BaseWidget from "./base-widget";

export class ChartWidget extends BaseWidget {
  widgetStyle() {
    return {
      width: "100%",
      height: "100%",
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { properties } = props;
    const { data, height, width } = properties;
    const type = properties?.type ? properties.type : "pie";
    return {
      ...state,
      type: type,
      series: data.map((e) => e.value),

      options: {
        labels: data.map((e) => e.label),
        chart: {
          type: type,
          height: "100%",
          width: "100%",
        },
        dataLabels: {
          enabled: true,
        },
        noData: {
          text: "No Data",
        },
      },
    };
  }

  render() {
    const { style } = this.props;
    const { series, options, type } = this.state;

    return (
      <div style={this.styleBuilder(style)}>
        <ChartLibrary
          type={type}
          options={options}
          series={series}
          style={{ width: "10px", height: "10px" }}
        />
      </div>
    );
  }
}
