import React from "react";
import GaugeChart from "react-gauge-chart";

const Pressure = () => {
  return (
    <div>
      <h1>Pressure Gauge</h1>
      <GaugeChart id="pressure-gauge" percent={0.283} />
    </div>
  );
};

export default Pressure;
