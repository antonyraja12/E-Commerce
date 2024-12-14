import { Card, Col, Flex, Image, Row, Spin, Typography } from "antd";
import "./andon.css";
import AndonCard from "./andon-card";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { useEffect, useState } from "react";
import useCrudOperations from "../utils/useCrudOperation";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import TatReportService from "../../../services/track-and-trace-service/tat-report-service";
import dayjs from "dayjs";
const { Text, Title } = Typography;

const filters = {
  startDate: dayjs().startOf("day").toISOString(),
  endDate: dayjs().endOf("day").toISOString(),
};
function Andon() {
  const workStationService = new WorkStationService();
  const service = new TatReportService();
  const { isFullscreen, toggleFullscreen, setTitle } = useOutletContext();
  const [state, setState] = useState({});
  const colors = [
    { name: "Pallet Release", background: "#53c41aa7", color: "#FFF" },
    { name: "Material Call", background: "#ffc107b0", color: "#233E7F" },
    { name: "Work Delay", background: "#FF5353", color: "#FFF" },
    { name: "Maintenance Call", background: "#1890FF", color: "#FFF" },
    { name: "Quality Call", background: "#F2F2F2", color: "#233E7F" },
  ];
  useState(() => {
    if (setTitle) setTitle("Andon");
  }, []);
  const { data, isLoading, setIsLoading, fetchData } = useCrudOperations(
    workStationService,
    { status: true }
  );
  useEffect(() => {
    service
      .getShiftWisePartCount(filters)
      .then(({ data }) => {
        const inProgressData = data?.find(
          (e) => e.shiftStatus === "INPROGRESS"
        );
        setState(inProgressData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    return () => {
      if (isFullscreen) {
        toggleFullscreen();
      }
    };
  }, [isFullscreen]);

  return (
    <Spin spinning={isLoading}>
      <Card
        className="andon-legend"
        // title={
        //   isFullscreen ? (
        //     <Image
        //       src="/byteFactory.png"
        //       preview={false}
        //       style={{
        //         maxWidth: "150px",
        //         position: "relative",
        //       }}
        //     />
        //   ) : (
        //     "Andon"
        //   )
        // }
        extra={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {colors.map((legend, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "20px",
                }}
              >
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    backgroundColor: legend?.background,
                    boxShadow: `0 0 5px ${legend?.background}`,
                    marginRight: "8px",
                  }}
                />
                <Text>{legend?.name}</Text>
              </div>
            ))}
            <div
              onClick={toggleFullscreen}
              style={{ cursor: "pointer", marginLeft: "20px" }}
            >
              {isFullscreen ? (
                <FullscreenExitOutlined />
              ) : (
                <FullscreenOutlined />
              )}
            </div>
          </div>
        }
      >
        <Row gutter={[15, 15]} align="middle">
          <Col sm={12} lg={8}>
            <div className="andon-header">
              <div className="andon-info">
                <Text strong className="andon-top-text">
                  Model
                </Text>
                <Title
                  className="andon-top-title"
                  level={3}
                  style={{ margin: 0 }}
                >
                  {state ? state.productDetail?.model : ""}
                </Title>
              </div>
              <div className="andon-info">
                <Text strong className="andon-top-text">
                  Variant
                </Text>
                <Title
                  className="andon-top-title"
                  level={3}
                  style={{ margin: 0 }}
                >
                  {state ? state.productDetail?.variant : ""}
                </Title>
              </div>
              <div className="andon-info">
                <Text strong className="andon-top-text">
                  Seat Type
                </Text>
                <Title
                  className="andon-top-title"
                  level={3}
                  style={{ margin: 0 }}
                >
                  {state ? state.productDetail?.category : ""}
                </Title>
              </div>
            </div>
          </Col>
          <Col sm={12} lg={10}>
            <div className="andon-header">
              <div className="andon-info">
                <Text strong className="andon-top-text">
                  Job Per Hour
                </Text>
                <Title
                  className="andon-top-title"
                  level={3}
                  style={{ margin: 0 }}
                >
                  {state
                    ? Math.floor(state?.targetedPart / state?.shiftHours)
                    : ""}
                </Title>
              </div>
              <div className="andon-info">
                <Text strong className="andon-top-text">
                  Planned Parts
                </Text>
                <Title
                  className="andon-top-title"
                  level={3}
                  style={{ margin: 0 }}
                >
                  {state ? state?.targetedPart : ""}
                </Title>
              </div>
              <div className="andon-info">
                <Text strong className="andon-top-text">
                  Parts Produced
                </Text>
                <Title
                  className="andon-top-title"
                  level={3}
                  style={{ margin: 0 }}
                >
                  {state ? state.completedPart : ""}
                </Title>
              </div>
            </div>
          </Col>
          <Col sm={12} lg={6}>
            <div className="andon-header">
              <div className="andon-info">
                <Text strong className="andon-top-text">
                  Cycle Time
                </Text>
                <Title
                  className="andon-top-title"
                  level={3}
                  style={{ margin: 0 }}
                >
                  {state ? 90 : ""}
                </Title>
              </div>
              <div className="andon-info">
                <Text strong className="andon-top-text">
                  Shift
                </Text>
                <Title
                  className="andon-top-title"
                  level={3}
                  style={{ margin: 0 }}
                >
                  {state ? state.shiftName : ""}
                </Title>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <Row gutter={[10, 10]}>
              {data
                ?.sort((a, b) => a.seqNo - b.seqNo)
                .map((value, index) => (
                  <Col key={index} sm={6} md={4} lg={3}>
                    <AndonCard
                      name={value?.workStationName}
                      workStationId={value?.workStationId}
                    />
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}

export default Andon;
