import React from "react";
import { ChromePicker } from "react-color";

class ColorPicker extends React.Component {
  handleChange = (color) => {
    const { onChange } = this.props;
    if (onChange && color.hex) {
      onChange(color.hex);
    }
  };

  render() {
    const { value } = this.props;
    const defaultColor = "#ffffff";
    return (
      <ChromePicker
        className="color-picker"
        color={value ? value : defaultColor}
        onChange={this.handleChange}
        disableAlpha={true}
      />
    );
  }
}

export default ColorPicker;
