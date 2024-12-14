import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Image,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
import "./andon.css";
import AndonCard from "./andon-card";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { useEffect, useState } from "react";
import useCrudOperations from "../utils/useCrudOperation";
import { Link, useOutletContext } from "react-router-dom";
import TatReportService from "../../../services/track-and-trace-service/tat-report-service";
import dayjs from "dayjs";
import { EditButton } from "../../../utils/action-button/action-button";
import { ExportOutlined } from "@ant-design/icons";

const filters = {
  startDate: dayjs().startOf("day").toISOString(),
  endDate: dayjs().endOf("day").toISOString(),
};
function Andon1() {
  const workStationService = new WorkStationService();
  const reportService = new TatReportService();

  const [state, setState] = useState([]);
  const { isFullscreen, toggleFullscreen, setTitle } = useOutletContext();
  const colors = [
    { name: "Pallet Release", background: "#53c41aa7", color: "#FFF" },
    { name: "Material Call", background: "#ffc107b0", color: "#233E7F" },
    { name: "Work Delay", background: "#ff4d50bb", color: "#FFF" },
    { name: "Maintenance Call", background: "#1890ffad", color: "#FFF" },
    { name: "Quality Call", background: "#F2F2F2", color: "#233E7F" },
  ];
  const { data, isLoading, setIsLoading, fetchData } = useCrudOperations(
    workStationService,
    { status: true }
  );
  useState(() => {
    if (setTitle) setTitle("Andon 2");
  }, []);
  useEffect(() => {
    return () => {
      if (isFullscreen) {
        toggleFullscreen();
      }
    };
  }, [isFullscreen]);
  useEffect(() => {
    reportService
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

  return (
    <div style={{ padding: 10 }}>
      <Row gutter={[10, 10]}>
        {state?.productDetail?.map((e) => (
          <Col lg={12}>
            <Card size="small" styles={{ body: { padding: 0 } }}>
              <Descriptions
                size="small"
                column={3}
                colon={false}
                bordered
                //   layout="horizontal"
                layout="vertical"
                items={[
                  {
                    key: "1",
                    label: "Product Name",
                    children: e ? e?.productName : " ",
                    span: 2,
                  },
                  {
                    key: "2",
                    label: "Product Code",
                    children: e ? e?.code : " ",
                  },
                  {
                    key: "3",
                    label: "Model",
                    children: e ? e?.model : " ",
                  },
                  {
                    key: "4",
                    label: "Variant",
                    children: e ? e?.variant : " ",
                  },
                  {
                    key: "5",
                    label: "Seat type",
                    children: e ? e?.category : " ",
                  },
                  // {
                  //   key: "6",
                  //   label: "Job Per Hour",
                  //   children: "320",
                  // },
                  // {
                  //   key: "7",
                  //   label: "Planned",
                  //   children: "3200",
                  // },
                  // {
                  //   key: "8",
                  //   label: "Actual",
                  //   children: "1780",
                  // },
                  // {
                  //   key: "9",
                  //   label: "Avg Cycle Time",
                  //   children: "180s",
                  // },
                ]}
              />
            </Card>
          </Col>
        ))}

        <Col lg={6}>
          <Card size="small" styles={{ body: { padding: 8 } }}>
            <Space split={<Divider type="vertical" />}>
              <Space size="small" direction="vertical">
                <Statistic
                  title="Parts Planned"
                  value={state ? state?.targetedPart : ""}
                />
                <Statistic
                  title="Parts Produced"
                  value={state ? state.completedPart : ""}
                />
              </Space>
              <Statistic
                title="Job Per Hour"
                value={
                  state
                    ? Math.floor(state?.targetedPart / state?.shiftHours)
                    : ""
                }
              />
            </Space>
          </Card>
        </Col>
        <Col lg={6}>
          <Card size="small" styles={{ body: { padding: 6 } }}>
            <Row justify={"space-between"}>
              <Col>
                <Space direction="vertical" size="small">
                  {colors.map((legend, index) => (
                    <Badge
                      style={{
                        fontSize: 12,
                      }}
                      size="small"
                      text={legend?.name}
                      color={legend?.background}
                    />
                  ))}
                </Space>
              </Col>
              <Col>
                <Link to={"../andon"}>
                  <Button icon={<ExportOutlined />} type="text">
                    Andon 1
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          {/* <Card title="Station Summary" size="small"> */}
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
          {/* </Card> */}
        </Col>
      </Row>
    </div>
  );
}

export default Andon1;
