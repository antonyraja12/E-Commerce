import {
  ArrowRightOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { AiFillAlert } from "react-icons/ai";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import CommonCard from "./common-card";
import { iconStyle } from "./variable";
import Container from "./container";
import InnerStatistic from "./inner-statistic";
import { Avatar, Col, Row, Space, Tooltip, Typography } from "antd";
import { IoIosFlash } from "react-icons/io";
import { GiCash, GiTakeMyMoney } from "react-icons/gi";
import { useEffect, useMemo, useState } from "react";
import EnergyConsumptionDashboardService from "../../services/energy-services/energy-consumption-dashboard-service";
import { Link } from "react-router-dom";
function EnergyCard({ startDate, endDate, aHId, length }) {
  const [energyData, setenergyData] = useState(null);
  const energyservice = new EnergyConsumptionDashboardService();

  const fetchData = () => {
    return energyservice
      .getbyOverallenergy(startDate, endDate, aHId)
      .then((response) => {
        setenergyData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching energy data:", error);
      });
  };
  // const conversionRate = 2.5;
  useMemo(() => {
    if (aHId && endDate && startDate) fetchData();
  }, [startDate, endDate, aHId]);
  return (
    <Container
      // title="Energy"
      length={length}
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={5}>Energy</Typography.Title>
          </Col>
          <Col>
            <Link to="../energy/live-dashboard">
              <ArrowRightOutlined style={{ fontSize: "1em", width: "3em" }} />
            </Link>
          </Col>
        </Row>
      }
      icon={<IoIosFlash style={iconStyle} />}
      link="./machine/qi"
      iconBg="linear-gradient(135deg, #ffbaf0, #ec358d)"
    >
      <Row gutter={[10, 10]}>
        <Col span={length >= 3 ? 24 : 12}>
          <Space>
            <Avatar
              className="dashboard-avatar"
              shape="square"
              size={45}
              icon={<IoIosFlash style={{ color: "#f365b1" }} />}
            />
            <InnerStatistic
              title="Total Consumed"
              value={
                <>
                  {(energyData?.consumption ?? 0).toFixed(2)}{" "}
                  <Typography.Text
                    style={{
                      fontWeight: 350,
                      color: "#0f1a35",
                      fontSize: ".8em",
                    }}
                  >
                    kWh
                  </Typography.Text>
                </>
              }
            />
          </Space>
        </Col>
        <Col span={length >= 3 ? 24 : 12}>
          <Space>
            <Avatar
              className="dashboard-avatar"
              shape="square"
              size={45}
              icon={<GiTakeMyMoney style={{ color: "#14ccc1" }} />}
            />
            <InnerStatistic
              title={
                <>
                  Carbon Emission (kg of CO<sub>2</sub>){" "}
                  <Tooltip title="Calculated based on GHG standards">
                    <InfoCircleOutlined style={{ color: "#1677FF" }} />
                  </Tooltip>
                  {/* <br />
                  <span style={{ fontSize: "10px" }}>
                    Calculated based on GHG standards
                  </span> */}
                </>
              }
              value={(energyData?.carbonEmission ?? 0).toFixed(2)}
            />
          </Space>
        </Col>
      </Row>
    </Container>
  );
}

export default EnergyCard;
