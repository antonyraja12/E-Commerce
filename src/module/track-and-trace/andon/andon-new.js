import {
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";
import dayjs from "dayjs";
import TatReportService from "../../../services/track-and-trace-service/tat-report-service";
import { Link, useOutletContext } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";

const AndonNew = () => {
  const [data, setData] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [oleData, setOleData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const filters = {
    startDate: dayjs().startOf("day").toISOString(),
    endDate: dayjs().endOf("day").toISOString(),
  };
  const { isFullscreen, toggleFullscreen, setTitle } = useOutletContext();
  const service = new TatReportService();

  const [progressSize, setProgressSize] = useState(450);
  const [fontSize, setFontSize] = useState(50);
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1600) {
        setProgressSize(400);
        setFontSize("35px");
      } else if (screenWidth >= 1200) {
        setProgressSize(260);
        setFontSize("20px");
      } else if (screenWidth >= 768) {
        setProgressSize(200);
        setFontSize("15px");
      } else {
        setProgressSize(100);
        setFontSize("10px");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (setTitle) setTitle("Andon 1");
    const fetchShiftData = () => {
      setIsLoading(true);
      service
        .getShiftWisePartCount(filters)
        .then(({ data }) => {
          setIsLoading(false);
          setData(data);
          const inProgressData = data.find(
            (e) => e.shiftStatus === "INPROGRESS"
          );
          setShiftData(inProgressData.hourlyProductionDtoList);
          setOleData(
            Math.round(
              (inProgressData.completedPart / inProgressData.targetedPart) *
                1000
            ) / 10
          );
        })

        .catch((err) => {
          console.log("error", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchShiftData();
    const interval = setInterval(fetchShiftData, 600000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const columns = [
    {
      dataIndex: "timing",
      key: "time",
      title: "TIMING",
      align: "center",
      // render: (value, rec) => {
      //   let start = new Date(rec.startTime);
      //   let end = new Date(rec.endTime);
      //   start.setHours(start.getHours());
      //   start.setMinutes(start.getMinutes());

      //   end.setHours(end.getHours());
      //   end.setMinutes(end.getMinutes());

      //   const formattedStart = start
      //     .toLocaleString("en-GB", {
      //       hour: "2-digit",
      //       minute: "2-digit",
      //       hour12: true,
      //     })
      //     .replace("am", "AM")
      //     .replace("pm", "PM");

      //   const formattedEnd = end
      //     .toLocaleString("en-GB", {
      //       hour: "2-digit",
      //       minute: "2-digit",
      //       hour12: true,
      //     })
      //     .replace("am", "AM")
      //     .replace("pm", "PM");

      //   return `${formattedStart} - ${formattedEnd}`;
      // },
      render: (value, rec) => {
        const start = new Date(rec.startTime);
        const end = new Date(rec.endTime);
        const formatTime = (date) => {
          const hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const period = hours >= 12 ? "PM" : "AM";
          const formattedHours = hours % 12 || 12;
          return `${formattedHours}:${minutes} ${period}`;
        };
        const formattedStart = formatTime(start);
        const formattedEnd = formatTime(end);
        return `${formattedStart} - ${formattedEnd}`;
      },
    },
    {
      dataIndex: "targetedPart",
      key: "target",
      title: "TARGET",
      align: "center",
      render: (value) => {
        return Math.floor(value);
      },
    },
    {
      dataIndex: "actualProduction",
      key: "production",
      title: "PRODUCTION",
      align: "center",
      render: (text, record) => {
        const difference =
          Math.floor(record.actualProduction) - Math.floor(record.targetedPart);
        let color = "black";
        let Diff = difference;

        const startTime = new Date(record.startTime);
        startTime.setHours(startTime.getHours());
        startTime.setMinutes(startTime.getMinutes());

        const currentTime = new Date();

        const hasTimePassed = currentTime >= startTime;

        if (hasTimePassed) {
          if (difference > 0) {
            color = "green";
            Diff = `+${difference}`;
          } else if (difference < 0) {
            color = "red";
          } else {
            color = "orange";
          }
        }
        if (!hasTimePassed) {
          return 0;
        }

        return (
          <Flex gap={30} justify="center" vertical={false}>
            <div>{record.actualProduction}</div>
            <div>
              <Tag className="tag-table" color={color}>
                {Diff}
              </Tag>
            </div>
          </Flex>
        );
      },
    },
  ];
  const getBorderColor = (status) =>
    status === "INPROGRESS" ? "#06D001" : "#F3C623";

  const renderCards = () => {
    if (!data || data.length === 0) {
      return <Typography.Text>No shifts available</Typography.Text>;
    }

    return data
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .map((e) => (
        <Card
          key={e.shiftAllocationId}
          style={{
            marginTop: 10,
            border: `.5px solid ${getBorderColor(e.shiftStatus)}`,
          }}
        >
          <Flex justify="space-around" gap={10} vertical={false}>
            <div
              style={{
                marginTop: "1%",
              }}
            >
              <div className="card-title">{e.shiftName}</div>
              <div className="card-sub-title">Production</div>
            </div>
            <div>
              <Statistic
                title={<span className="stat-title">Target</span>}
                value={e.targetedPart}
                formatter={formatter}
                valueStyle={{
                  color: getBorderColor(e.shiftStatus),
                  fontSize: fontSize,
                  fontWeight: "bold",
                }}
              />
            </div>
            <div>
              <Statistic
                title={<span className="stat-title">Actual</span>}
                value={e.completedPart}
                formatter={formatter}
                valueStyle={{
                  color: getBorderColor(e.shiftStatus),
                  fontSize: fontSize,
                  fontWeight: "bold",
                }}
              />
            </div>
          </Flex>
        </Card>
      ));
  };

  const formatter = (value) => <CountUp end={value} />;
  return (
    <Spin spinning={isLoading}>
      <Flex gap={"middle"} vertical={false}>
        <div style={{ padding: "1% 0 0 1%", width: "70%" }}>
          <Table
            className="table-shift"
            size="large"
            columns={columns}
            dataSource={shiftData}
            pagination={false}
            bordered
          />
        </div>
        <div style={{ paddingRight: "1%", width: "30%" }}>
          <Flex justify="end">
            <Link to={"../andon1"}>
              <Button icon={<ExportOutlined />} type="text">
                Andon 2
              </Button>
            </Link>
          </Flex>

          <Flex justify="center">
            <Progress
              type="dashboard"
              percent={oleData}
              strokeLinecap="butt"
              strokeWidth={15}
              size={progressSize}
              strokeColor={"#06D001"}
              format={(percent) => (
                <>
                  <span style={{ fontSize: "22px", fontWeight: "600" }}>
                    OLE
                  </span>
                  <br />
                  <span
                    style={{ color: "#06d001", fontWeight: "600" }}
                  >{`${percent}%`}</span>
                </>
              )}
            />
          </Flex>
          <div style={{ marginTop: 20 }}>{renderCards()}</div>
        </div>
      </Flex>
    </Spin>
  );
};
export default AndonNew;
