import React from "react";
import Thermometer from "react-thermometer-component";

const MyTemperatureComponent = () => {
  return (
    <Thermometer
      theme="light"
      value="18"
      max="100"
      steps="3"
      format="°C"
      size="large"
      height="300"
    />
  );
};

export default MyTemperatureComponent;
