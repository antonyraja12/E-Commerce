import { Card, Typography } from "antd";
import BaseWidget from "./base-widget";
export class CardWidget extends BaseWidget {
  widgetStyle() {
    return {
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      borderRadius: "10px",
    };
  }
  render() {
    const { style, properties } = this.props;
    return (
      <Card style={this.styleBuilder(style)}>
        <Typography.Text style={{ color: "inherit" }} level={4}>
          {properties?.title}
        </Typography.Text>
        <Typography.Title style={{ margin: 0, color: "inherit" }}>
          {properties?.value ?? <>&nbsp;</>}
        </Typography.Title>
      </Card>
    );
  }
}
