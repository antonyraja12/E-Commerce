import React, { useEffect, useState } from "react";
import { Spin, Row, Col, Button, Card, Progress, Space, Tooltip } from "antd";
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import LiveChartOee from "../../component/LiveChartOee";
import { ChartWidget } from "../dynamic-dashboard/widgets/chart-widget";
import OeeCalculationService from "../../services/oee-calculation-service";
import MachineStatusService from "../../services/oee/machine-status-service";
import moment from "moment";
import { useSelector } from "react-redux";
import Page from "../../utils/page/page";

const OeeDashboard = () => {
  const reduxSelectedAhId = useSelector(
    (state) => state.mainDashboardReducer.selectedAhId
  );
  const reduxSelectedAssetId = useSelector(
    (state) => state.mainDashboardReducer.selectedAssetId
  );
  const [isLoading, setIsLoading] = useState(false);
  const oeeCalculationService = new OeeCalculationService();
  const machinestatusservice = new MachineStatusService();
  const [totalPartCount, setTotalPartCount] = useState(0);
  const [acceptedPartCount, setAcceptedPartCount] = useState(0);
  const [rejectedPartCount, setRejectedPartCount] = useState(0);
  const [oee, setOee] = useState(0);
  const [availability, setAvailability] = useState(0);
  const [performance, setPerformance] = useState(0);
  const [quality, setQuality] = useState(0);
  const [runTime, setRuntime] = useState(0);
  const [defaultOEEData, setdefaultOEEData] = useState(0);
  const [startDate, setstartDate] = useState("");
  const [runTimePercentage, setRuntimePercentage] = useState(0);
  const [downTimePercentage, setdowntimePercentage] = useState(0);
  const [formattedStartTime, setFormattedStartTime] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");
  const [splitTimes, setSplitTimes] = useState([]);
  const [oeeId, setOeeId] = useState(0);
  const [endDate, setendDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [shiftAllocationId, setShiftAllocationId] = useState("");
  const [machineStatus, setMachineStatus] = useState([]);
  const oeeCalculation = (ahId, assetId) => {
    oeeCalculationService
      .getbyahIdassetId(ahId, assetId)
      .then(({ data }) => {
        if (data === null) {
          setAvailability(0);
          setOeeId(0);
          setShiftAllocationId(0);
          setOee(0);
          setPerformance(0);
          setdefaultOEEData(0);
          setQuality(0);
          setstartDate(0);
          setendDate(0);
          setTotalPartCount(0);
          setAcceptedPartCount(0);
          setRejectedPartCount(0);
          setRuntime(0);
        } else {
          setOee(data.oee);
          setOeeId(data.oeeCalculationId);
          setShiftAllocationId(data.shiftAllocationId);
          setAvailability(data.availability);
          setPerformance(data.performance);
          setQuality(data.quality);
          setdefaultOEEData(data.oee);
          setstartDate(data.shiftAllocation.startDate);
          setendDate(data.shiftAllocation.endDate);
          setTotalPartCount(data.totalPartCount);
          setAcceptedPartCount(data.acceptedPartCount);
          setRejectedPartCount(data.rejectedPartCount);
          setRuntime(data.runTime);
        }
      })
      .catch((e) => {
        setAvailability(0);
        setOeeId(0);
        setShiftAllocationId(0);
        setOee(0);
        setPerformance(0);
        setdefaultOEEData(0);
        setQuality(0);
        setstartDate(0);
        setendDate(0);
        setTotalPartCount(0);
        setAcceptedPartCount(0);
        setRejectedPartCount(0);
        setRuntime(0);
      });
  };
  const fetchProductionSummaryData = (oeeId) => {
    if (oeeId !== 0) {
      oeeCalculationService.retrieve(oeeId).then((response) => {
        const assetData = response.data;
        // setOeeId(assetData.oeeCalculationId);
        setstartDate(assetData.shiftAllocation.startDate);
        setendDate(assetData.shiftAllocation.endDate);
        setTotalPartCount(assetData.totalPartCount);
        setAcceptedPartCount(assetData.acceptedPartCount);
        setRejectedPartCount(assetData.rejectedPartCount);
        setOee(assetData.oee);
        setdefaultOEEData(assetData.oee);
        setAvailability(assetData.availability);
        setPerformance(assetData.performance);
        setQuality(assetData.quality);
      });
    }
  };
  useEffect(() => {
    if (reduxSelectedAhId && reduxSelectedAssetId) {
      oeeCalculation(reduxSelectedAhId, reduxSelectedAssetId);
    }
  }, [reduxSelectedAhId, reduxSelectedAssetId]);
  useEffect(() => {
    fetchProductionSummaryData(oeeId);

    const intervalId = setInterval(() => {
      fetchProductionSummaryData(oeeId);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [oeeId]);
  useEffect(() => {
    fetchMachineStatus();

    const intervalId = setInterval(() => {
      fetchMachineStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [oeeId]);
  useEffect(() => {
    setRuntimePercentage(availability);
    const dowtimepercent = 100 - availability;
    setdowntimePercentage(dowtimepercent);
  }, [availability, runTime]);

  const updateProgress = () => {
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    const formattedStartTime = moment(startTime).format("DD-MM-YYYY HH:mm");
    setFormattedStartTime(formattedStartTime);
    const formattedEndTime = moment(endTime).format("DD-MM-YYYY HH:mm");
    setFormattedEndTime(formattedEndTime);

    const totalTime = endTime - startTime;
    setStartTime(formattedStartTime);
    setEndTime(formattedEndTime);
    const interval = totalTime / 5;
    const splitTimesArray = [];
    for (let i = 0; i < 5; i++) {
      const splitTime = new Date(startTime.getTime() + interval * (i + 1));
      splitTimesArray.push(splitTime);
    }
    setSplitTimes(splitTimesArray);
  };

  useEffect(() => {
    updateProgress();
    const intervalId = setInterval(updateProgress, 6000);
    return () => {
      clearInterval(intervalId);
    };
  }, [startDate, endDate]);

  const fetchMachineStatus = () => {
    if (shiftAllocationId) {
      machinestatusservice
        .getMachineStatus(startDate, endDate, reduxSelectedAssetId)
        .then((response) => {
          // console.log("ms", response.data);
          let shiftstart = new Date(response.data.shiftStartDate).getTime();
          let shiftend = new Date(response.data.shiftEndDate).getTime();
          let arr = [];
          let duration = 0;

          response.data.machineStatusList?.map((e, i) => {
            const endTime = e.endTime
              ? new Date(e.endTime).getTime()
              : new Date().getTime();

            duration = duration + (endTime - new Date(e.startTime).getTime());

            arr.push({
              duration: endTime - new Date(e.startTime).getTime(),
              start: e.startTime,
              end: e.endTime,
              status: e.status,
              running: e.running,
              percent: Number(
                ((endTime - new Date(e.startTime).getTime()) /
                  (shiftend - shiftstart)) *
                  100
              ).toFixed(1),
              fillColor: e.status === "Down" ? "#fc2c03" : "#30fc03",
            });
            setMachineStatus(arr);
          });
        });
    } else {
      setMachineStatus([]);
    }
  };
  const badgeStyle = {
    fontSize: "12px",
    marginRight: "20px",
  };
  const realtimePopStyle = {
    height: "20px",
    width: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const progressBarStyles = {
    width: "100%",
    height: "10px",
    borderRadius: "10px",
    background: "#f0f0f0",
    position: "relative",
  };

  return (
    <Page>
      <Spin spinning={isLoading}>
        <Row gutter={[10, 10]}>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Row gutter={[10, 10]} style={{ minHeight: "250px" }}>
              <Col span={24}>
                <strong style={{ fontSize: "40px" }}>{oee} %</strong>
              </Col>
              <Col span={24}>
                <div>
                  <p style={{ lineHeight: "0.5" }}>
                    <span style={{ fontSize: "25px", color: "#13D048" }}>
                      <ArrowUpOutlined /> 1.5% (127)
                    </span>
                  </p>
                  <p style={{ lineHeight: "0.5" }}>
                    As on 06 Nov, 2023 | 14:36
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <p style={{ lineHeight: "1", fontSize: "12px" }}>
                    Availability
                  </p>
                  <p style={{ lineHeight: "1" }}>
                    <strong style={{ fontSize: "20px", color: "#55E0AE" }}>
                      {availability} %
                    </strong>
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <p style={{ lineHeight: "1", fontSize: "12px" }}>
                    Performance
                  </p>
                  <p style={{ lineHeight: "1" }}>
                    <strong style={{ fontSize: "20px", color: "#7DBCFB" }}>
                      {performance} %
                    </strong>
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <p style={{ lineHeight: "1", fontSize: "12px" }}>Quality</p>
                  <p style={{ lineHeight: "1" }}>
                    <strong style={{ fontSize: "20px", color: "#FFBD5A" }}>
                      {quality} %
                    </strong>
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Card
              // title="Part Count Realtime"
              //  extra={<Button style={realtimePopStyle} size="small"><DehazeIcon style={{fontSize:"12px"}}/></Button>}
              style={{
                minHeight: "250px",
                borderRadius: "10px",
                backgroundColor: "#FBFCFF",
              }}
            >
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                <Col flex={2}>
                  <h3>Part Count Realtime</h3>
                </Col>
                <Col>
                  <Row align="middle">
                    <Col>
                      <Button style={realtimePopStyle} size="small">
                        <img src="/SideMenu.svg" />
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div>
                <p style={{ lineHeight: "0.5" }}>Total</p>
                <p style={{ lineHeight: "0.5" }}>
                  <strong style={{ fontSize: "35px" }}>{totalPartCount}</strong>
                </p>
              </div>
              <div>
                {" "}
                <Progress
                  percent={(acceptedPartCount / totalPartCount) * 100}
                  strokeColor="#72B481"
                  showInfo={false}
                />
              </div>
              <Row style={{ marginTop: "10px" }} gutter={[10, 10]}>
                <Col span={12}>
                  <p style={{ lineHeight: "0.5" }}>Accepted</p>
                  <h2 style={{ color: "#5AAE6D" }}>
                    <CheckCircleOutlined />{" "}
                    <strong> {acceptedPartCount}</strong>
                  </h2>
                </Col>
                <Col span={12}>
                  <p style={{ lineHeight: "0.5" }}>Rejected</p>
                  <h2 style={{ color: "#E05B5B" }}>
                    <StopOutlined /> <strong> {rejectedPartCount}</strong>
                  </h2>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Card style={{ maxHeight: "260px", borderRadius: "10px" }}>
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                <Col flex={2}>
                  <h3>OEE Realtime</h3>
                </Col>
                <Col>
                  <Row align="middle">
                    <Col>
                      <Button style={realtimePopStyle} size="small">
                        <img src="/SideMenu.svg" />
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <LiveChartOee
                data={defaultOEEData}
                Id={oeeId}
                started={formattedStartTime}
                ended={formattedEndTime}
                parameter={1}
                id={1}
              ></LiveChartOee>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8}>
            <Card style={{ minHeight: "240px", borderRadius: "10px" }}>
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                <Col flex={2}>
                  <h3>Availability</h3>
                </Col>
                <Col>
                  <Row align="middle">
                    <Col>
                      <Button style={realtimePopStyle} size="small">
                        <img src="/SideMenu.svg" />
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div
                style={{
                  width: "80%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChartWidget
                  type="pie"
                  properties={{
                    data: [
                      { label: "Run Time", value: runTimePercentage },
                      { label: "Down Time", value: downTimePercentage },
                    ],
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Card style={{ minHeight: "240px", borderRadius: "10px" }}>
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                <Col flex={2}>
                  <h3>Performance</h3>
                </Col>
                <Col>
                  <Row align="middle">
                    <Col>
                      <Button style={realtimePopStyle} size="small">
                        <img src="/SideMenu.svg" />
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div
                style={{
                  width: "80%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Progress
                  type="circle"
                  percent={performance}
                  strokeWidth={10}
                  strokeColor="#7DBCFB"
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: "#7DBCFB",
                      marginRight: "5px",
                    }}
                  ></div>
                  <div style={{ fontSize: "14px" }}>Performance</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Card style={{ minHeight: "240px", borderRadius: "10px" }}>
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                <Col flex={2}>
                  <h3>Quality</h3>
                </Col>
                <Col>
                  <Row align="middle">
                    <Col>
                      <Button style={realtimePopStyle} size="small">
                        <img src="/SideMenu.svg" />
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div
                style={{
                  width: "80%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Progress
                  type="circle"
                  percent={quality}
                  strokeWidth={10}
                  strokeColor="#FFBD5A"
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: "#FFBD5A",
                      marginRight: "5px",
                    }}
                  ></div>
                  <div style={{ fontSize: "14px" }}>Quality</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card style={{ minHeight: "220px", borderRadius: "10px" }}>
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                <Col flex={2}>
                  <h3>Machine Status</h3>
                </Col>
                <Col>
                  <Row align="middle">
                    <Col>
                      <Button style={realtimePopStyle} size="small">
                        <img src="/SideMenu.svg" />
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div
                style={{
                  margin: "auto",
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: "center",
                }}
              >
                <Space>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "green",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Running</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "red",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Down</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "yellow",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Minor Stoppage</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "#66FFB2",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Break Time</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "#660066",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Maintenance</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "#FF7F50",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Management Loss</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "#F08080",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Reduced Speed</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "#FFA500",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Quality</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "#FFC0CB",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Distribution Loss</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "#FF69B4",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Setup</span>
                  </div>
                  <div style={badgeStyle}>
                    <span
                      style={{
                        color: "#A0522D",
                        fontSize: "18px",
                      }}
                    >
                      ●
                    </span>
                    <span> Operator Loss</span>
                  </div>
                </Space>
                <br />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>{startTime}</p>
                  <p>{endTime}</p>
                </div>
                <div style={progressBarStyles}>
                  {machineStatus.map((segment, index) => (
                    //  <Tooltip title={`${segment.percent}%`} placement="topRight">
                    <div
                      key={index}
                      style={{
                        height: "100%",
                        width: `${segment.percent}%`,
                        borderRadius:
                          index === 0
                            ? "10px 0 0 10px"
                            : index === machineStatus.length - 1
                            ? "0 10px 10px 0"
                            : "0",
                        background: segment.fillColor,
                        position: "absolute",
                        top: "0",
                        left:
                          index === 0
                            ? 0
                            : `${machineStatus
                                .slice(0, index)
                                .reduce(
                                  (acc, s) => acc + parseFloat(s.percent),
                                  0
                                )}%`,
                      }}
                    ></div>
                  ))}
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {splitTimes.map((time, index) => (
                    <div key={index} style={{ margin: "10px 50px" }}>
                      {time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </Page>
  );
};
export default OeeDashboard;
