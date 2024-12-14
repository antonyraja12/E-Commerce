import BaseWidget from "./base-widget";
import GaugeComponent from "react-gauge-component";
export class GaugeWidget extends BaseWidget {
  widgetStyle() {
    return {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: "10px",
      borderRadius: "10px",
      height: "100%",
      width: "100%",
    };
  }
  render() {
    const { style, properties } = this.props;

    return (
      <div style={this.styleBuilder(style)}>
        <GaugeComponent
          type={properties?.type ?? "grafana"}
          labels={{
            valueLabel: {
              matchColorWithArc: true,
              style: {
                fontSize: "32px",
                fill: "#333333",
                textShadow: "none",
              },
            },
            markLabel: {
              type: "outer",
              valueConfig: {
                style: {
                  fontSize: "10px",
                  fill: "#333333",
                  textShadow: "none",
                },
              },
              markerConfig: {
                style: {
                  fontSize: "18px",
                  fill: "#333333",
                  textShadow: "none",
                },
              },
            },
          }}
          value={properties?.value ?? 0}
          maxValue={properties?.max}
          minValue={properties?.min}
        />
      </div>
    );
  }
}
