import {
  Row,
  Col,
  Descriptions,
  Button,
  Tag,
  Statistic,
  Space,
  Card,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import "../work-station-instance/work-station-instance.css";
import dayjs from "dayjs";
import { FaLongArrowAltDown } from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";
import TaktTime from "./takt-time";
const { Countdown } = Statistic;

function WorkStationInstanceHeader(props) {
  const { jobOrder, data, property } = props;
  const [isBlinking, setIsBlinking] = useState(false);
  const [takTime, setTakTime] = useState(0);
  const [diffTime, setDiffTime] = useState(0);
  const onFinish = () => {
    console.log("result");
  };
  useEffect(() => {
    if (!property?.taktTime || property?.taktTime === 0) {
      setTakTime(null); // Reset taktTime
      setDiffTime(null); // Reset diffTime
      setIsBlinking(false); // Stop blinking
      return; // Exit early to avoid further conditions
    }
    if (property?.taktTime === property?.cycleTime) {
      setTakTime(property.cycleTime); // Freeze taktTime at cycleTime
      setIsBlinking(true); // Start blinking
    } else if (property?.taktTime < property?.cycleTime) {
      setTakTime(property.taktTime); // Set taktTime normally
      setIsBlinking(false); // No blinking, green background
    } else if (property?.taktTime > property?.cycleTime) {
      setTakTime(property?.cycleTime); // Freeze taktTime at cycleTime
      setDiffTime(property.taktTime - property.cycleTime); // Calculate the difference
      setIsBlinking(true); // Start blinking
    }
  }, [property?.taktTime, property?.cycleTime]);

  const items = [
    {
      key: "jobOrderNo",
      label: "Job.No",
      children: jobOrder?.jobOrderNo,
    },
    {
      key: "model",
      label: "Model",
      children: property?.model,
    },
    {
      key: "variant",
      label: "Variant",
      children: property?.variant,
    },

    {
      key: "p_code",
      label: "P.Code",
      children: property?.code,
    },

    {
      key: "category",
      label: "Seat Type",
      children: property?.category,
    },
    {
      key: "quantity",
      label: "Jobs",
      children: `${property?.jobCount}`,
    },
    {
      key: "cycleTime",
      label: "Cycle Time",
      children: `${property?.cycleTime ? property.cycleTime + " Sec" : "-"}`,
    },
    {
      key: "difference",
      label: "Difference",

      children: `${
        property?.cycleTime && property?.taktTime
          ? Number(property?.cycleTime) - Number(property?.taktTime) + " Sec"
          : "-"
      }`,
    },
    // {
    //   key: "takttime",
    //   // label: "Takt Time",
    //   children: <TaktTime {...property} />,
    // },
  ];

  return (
    <div className="ws-header">
      <Card size="small">
        <Row align="middle">
          <Col flex="1 1 90%">
            <Descriptions
              size="small"
              items={items}
              bordered={false}
              column={8}
              layout="vertical"
            />
          </Col>
          <Col flex="1 0 80px">
            <TaktTime {...property} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default WorkStationInstanceHeader;
