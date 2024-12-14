import React from "react";
import { ChromePicker } from "react-color";

class ColorPicker extends React.Component {
  handleChange = (color) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(color.hex);
    }
  };

  render() {
    const { value } = this.props;
    return (
      <ChromePicker
      className="color-picker"
        color={value}
        onChange={this.handleChange}
        disableAlpha={true}
      />
    );
  }
}

export default ColorPicker;
