import { BarChartOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { AiFillAlert } from "react-icons/ai";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import CommonCard from "./common-card";
import { iconStyle } from "./variable";
import { GrVmMaintenance } from "react-icons/gr";
import { IoTicket } from "react-icons/io5";
import { HiDocumentSearch } from "react-icons/hi";
import { useEffect, useMemo, useState } from "react";
import WorkOrderResolutionService from "../../services/inspection-management-services/workorder-resolution-service";
import { Col, Row, Space, Typography } from "antd";
import { Link } from "react-router-dom";
function ImCard({ startDate, endDate, aHId,length }) {
  const [imData, setimData] = useState(null);
  const service = new WorkOrderResolutionService();

  const fetchData = () => {
    return service
      .getbyOverallim(startDate, endDate, aHId)
      .then((response) => {
        setimData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching OEE data:", error);
      });
  };

  useMemo(() => {
    if (aHId && endDate && startDate) fetchData();
  }, [startDate, endDate, aHId]);
  return (
    <CommonCard
      // title="Inspection Management"
      length={length}
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={5}>Inspection Management</Typography.Title>
          </Col>
          <Col>
            <Link to="../im/dashboard">
              <ArrowRightOutlined style={{ fontSize: "1em", width: "3em" }} />
            </Link>
          </Col>
        </Row>
      }
      icon={<HiDocumentSearch style={iconStyle} />}
      link="./machine/pm"
      iconBg="linear-gradient(135deg,#b2ffec, #19cca1)"
      content={[
        {
          title: "Non conformance count",
          icon: <IoTicket style={{ color: "#19cca1" }} />,
          value: imData?.ImTotalCount ?? 0,
        },
        {
          title: "Resolved",
          icon: (
            <FiArrowUpRight style={{ color: "#6ab13f", fontSize: "1.5em" }} />
          ),
          value: imData?.ImTotalCount ?? 0,
        },
        {
          title: "Yet To Resolve",
          icon: (
            <FiArrowDownLeft style={{ color: "#f84343", fontSize: "1.5em" }} />
          ),
          value: imData?.ImTotalCount ?? 0,
        },
      ]}
    />
  );
}

export default ImCard;
