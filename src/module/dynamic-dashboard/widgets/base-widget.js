import { Component } from "react";

class BaseWidget extends Component {
  state = {};
  constructor() {
    super();
    this.widgetStyle = this.widgetStyle.bind(this);
  }

  baseStyle = (properties) => {
    return {
      // border: "1px solid #ddd",
      alignItems: properties?.align ? properties?.align : "flex-start",
      gap: properties?.gutter ? properties?.gutter + "px" : 0,
      display: "flex",
      flexDirection: properties?.direction === "vertical" ? "column" : "row",
      height: properties?.height,
      width: properties?.width ? properties?.width : "100%",
    };
  };
  styleBuilder = (style) => {
    let obj = this.baseStyle(this.props?.layoutProperties);
    let obj2 = this.widgetStyle();

    return { ...obj, ...obj2, ...style };
  };
  widgetStyle() {
    return {};
  }
}
export default BaseWidget;
