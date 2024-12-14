import { ArrowRightOutlined, DeploymentUnitOutlined } from "@ant-design/icons";
import { Col, Flex, Progress, Row, Space, Typography } from "antd";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom/dist";
import OeeCalculationService from "../../services/oee-calculation-service";
import Container from "./container";
import InnerStatistic from "./inner-statistic";
import { iconStyle } from "./variable";

export function OeeCard({ startDate, endDate, aHId, length }) {
  const [oeeData, setOeeData] = useState(null);
  const oeeservice = new OeeCalculationService();

  const fetchData = () => {
    return oeeservice
      .getbyOverall(startDate, endDate, aHId)
      .then((response) => {
        setOeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching OEE data:", error);
      });
  };

  useMemo(() => {
    if (aHId && endDate && startDate) fetchData();
  }, [startDate, endDate, aHId]);
  return (
    <Container
      icon={<DeploymentUnitOutlined style={iconStyle} />}
      link="./machine/oee"
      iconBg="linear-gradient(135deg, #c9d8fe, #7b91ca)"
      // title="Overall Equipment Efficiency"
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={5}>
              Overall Equipment Efficiency
            </Typography.Title>
          </Col>
          <Col>
            <Link to="../oee/dashboard">
              <ArrowRightOutlined style={{ fontSize: "1em", width: "3em" }} />
            </Link>
          </Col>
        </Row>
      }
    >
      <Flex
        gap={length >= 3 ? 50 : 150}
        style={{ width: "100%" }}
        align="center"
      >
        <Progress
          type="circle"
          percent={oeeData?.overAllOee ?? 0}
          strokeWidth={9}
          size={120}
          strokeColor="#6580c8"
          format={(percent) => {
            return (
              <Typography.Title
                style={{ marginBottom: 0, color: "#0f1a35" }}
                level={3}
              >
                {percent}%
              </Typography.Title>
            );
          }}
        />

        <Space
          direction={length >= 3 ? "vertical" : "horizontal"}
          size={length >= 3 ? 10 : 180}
        >
          <InnerStatistic
            title="Downtime"
            value={
              <>
                {oeeData?.downTime ?? 0}{" "}
                <Typography.Text
                  style={{
                    fontWeight: 350,
                    color: "#0f1a35",
                    fontSize: ".8em",
                  }}
                >
                  mins
                </Typography.Text>
              </>
            }
          />
          <InnerStatistic
            title="Part Count"
            value={<>{oeeData?.totalPartCount ?? 0} </>}
          />
        </Space>
      </Flex>
    </Container>
  );
}
