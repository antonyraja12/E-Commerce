import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Divider, Space, Statistic, Tag } from "antd";
import { useMemo } from "react";
function TaktTime(props) {
  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: new String(hours)?.padStart(2, "0"),
      m: new String(minutes)?.padStart(2, "0"),
      s: new String(seconds)?.padStart(2, "0"),
    };

    return obj;
  };
  const timer = useMemo(() => {
    return secondsToTime(props.taktTime);
  }, [props.taktTime]);
  const exceed = useMemo(() => {
    return Number(props.taktTime) > Number(props.cycleTime);
  }, [props.taktTime, props.cycleTime]);
  return (
    <Statistic
      //   title="Takt Time"
      valueStyle={{
        // fontSize: "2em",
        color: exceed ? "#cf1322" : "#3f8600",
        // textAlign: "center",
      }}
      value={`${timer?.m}:${timer?.s}`}
      prefix={exceed ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
    />
  );
}

export default TaktTime;
