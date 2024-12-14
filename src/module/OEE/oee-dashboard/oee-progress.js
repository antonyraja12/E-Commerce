import React, { useState, useEffect } from "react";
import { Progress } from "antd";

function OeeProgress(props) {
  const { value, title } = props;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Calculate the percentage based on the value received
    const calculatedPercent = value > 100 ? 100 : value;
    setPercent(calculatedPercent);
  }, [value]);

  // Determine color based on percentage ranges
  let color = "#52c41a"; // Default color (green)
  if (percent >= 0 && percent <= 50) {
    color = "#f5222d"; // Red color for 0-50 range
  } else if (percent > 50 && percent <= 80) {
    color = "#FFFF00"; // Yellow color for 51-80 range
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}>
      <Progress
        type="circle"
        percent={percent}
        width={65}
        strokeColor={color} // Set stroke color based on the calculated color
        format={(percent) => (percent === 100 ? "100%" : percent + "%")}
      />
 
      <strong>{title}</strong>
    </div>
  );
}
 
export default OeeProgress;