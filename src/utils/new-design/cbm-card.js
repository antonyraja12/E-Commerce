import { ArrowRightOutlined } from "@ant-design/icons";
import { AiFillAlert } from "react-icons/ai";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import CommonCard from "./common-card";
import { iconStyle } from "./variable";
import { BsBarChartLine } from "react-icons/bs";
import { Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import AlertReportService from "../../services/alert-report-cbm-services";
import { useEffect, useState, useMemo } from "react";
function CbmCard(props) {
  const { aHId, startDate, endDate, length } = props;
  const [data, setData] = useState({ total: 0, active: 0, inactive: 0 });
  const fetch = (filter) => {
    const service = new AlertReportService();
    service.getAlertCount(filter).then(({ data }) => {
      setData({
        total: data.total,
        active: data.active,
        inactive: data.unResolved,
      });
    });
  };

  useMemo(() => {
    if (aHId && startDate && endDate) {
      fetch({
        entityId: aHId,
        fromDate: startDate,
        toDate: endDate,
      });
    }
  }, [aHId, startDate, endDate]);

  const { total, active, inactive } = data;
  return (
    <CommonCard
      // title="Condition Monitoring"
      length={length}
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={5}>Condition Monitoring</Typography.Title>
          </Col>
          <Col>
            <Link to={`../cbm/monitoring?entityId=${aHId}`}>
              <ArrowRightOutlined style={{ fontSize: "1em", width: "3em" }} />
            </Link>
          </Col>
        </Row>
      }
      icon={<BsBarChartLine style={iconStyle} />}
      link="./machine/cbm"
      iconBg="linear-gradient(135deg, #d2bdff, #6648bb)"
      content={[
        {
          title: "Alert Count",
          icon: <AiFillAlert style={{ color: "#ebd300" }} />,
          value: total,
        },
        {
          title: "Alert Resolved",
          icon: (
            <FiArrowUpRight style={{ color: "#6ab13f", fontSize: "1.5em" }} />
          ),
          value: inactive,
        },
        {
          title: "Alert Yet Resolved",
          icon: (
            <FiArrowDownLeft style={{ color: "#f84343", fontSize: "1.5em" }} />
          ),
          value: active,
        },
      ]}
    />
  );
}

export default CbmCard;
