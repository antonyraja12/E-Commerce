import React, { Component } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import Card from "antd/lib/card/Card";
import { WarningFilled } from "@ant-design/icons";
class Gauge extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { min, max, value } = this.props;
    let val = 0;

    if (value < min || value > max) val = min;
    else val = value;

    return (
      <Card
        className={!this.props.connected ? "gauge disabled" : "gauge"}
        size="small"
        title={this.props.label}
        bodyStyle={{ width: "100%", height: 150, textAlign: "center" }}
        // extra={<WarningFilled className="blink_me" />}
      >
        <ReactSpeedometer
          needleHeightRatio={0.6}
          ringWidth={25}
          minValue={Number(min)}
          maxValue={Number(max)}
          height={150}
          width={200}
          value={val}
          // fluidWidth
        />
      </Card>
    );
  }
}

export default Gauge;
