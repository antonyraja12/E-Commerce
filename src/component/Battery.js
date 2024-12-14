import React from "react";
import BatteryGauge from "react-battery-gauge";

const Battery = () => {
  return (
    <div>
      <BatteryGauge value={40} style={{ width: "200px" }} />
    </div>
  );
};

export default Battery;
