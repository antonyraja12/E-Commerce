import { ArrowRightOutlined } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import { useMemo, useState } from "react";
import { BsFileEarmarkCheckFill } from "react-icons/bs";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { IoTicket } from "react-icons/io5";
import { Link } from "react-router-dom";
import WorkOrderResolutionService from "../../services/quality-inspection/workorder-resolution-service";
import CommonCard from "./common-card";
import { iconStyle } from "./variable";
function QaCard({ startDate, endDate, aHId, length }) {
  const [qaData, setqaData] = useState(null);
  const service = new WorkOrderResolutionService();

  const fetchData = () => {
    return service
      .getbyOverallqa(startDate, endDate, aHId)
      .then((response) => {
        setqaData(response.data);
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
      // title="Quality Audit"
      length={length}
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={5}>Quality Audit</Typography.Title>
          </Col>
          <Col>
            <Link to="../qi/dashboard">
              <ArrowRightOutlined style={{ fontSize: "1em", width: "3em" }} />
            </Link>
          </Col>
        </Row>
      }
      icon={<BsFileEarmarkCheckFill style={iconStyle} />}
      link="./machine/qi"
      iconBg="linear-gradient(135deg,#ffed8f, #e8b912)"
      content={[
        {
          title: "Non-compliance count ",
          icon: <IoTicket style={{ color: "#e8b912" }} />,
          value: qaData?.QiTotalCount ?? 0,
        },
        {
          title: "Resolved",
          icon: (
            <FiArrowUpRight style={{ color: "#6ab13f", fontSize: "1.5em" }} />
          ),
          value: qaData?.QiResolve ?? 0,
        },
        {
          title: "Yet To Resolve",
          icon: (
            <FiArrowDownLeft style={{ color: "#f84343", fontSize: "1.5em" }} />
          ),
          value: qaData?.QiYetResolve ?? 0,
        },
      ]}
    />
  );
}

export default QaCard;
