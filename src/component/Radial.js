import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const MyCircularProgress = () => {
  return (
    <div style={{ width: "100px" }}>
      <CircularProgressbar value={50} text={`${50}%`} />
    </div>
  );
};

export default MyCircularProgress;
