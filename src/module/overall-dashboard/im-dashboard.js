import {
  ArrowRightOutlined,
  BarsOutlined,
  CheckOutlined,
  ExceptionOutlined,
  PlusOutlined,
  SelectOutlined,
  UserAddOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Calendar,
  Card,
  Col,
  Empty,
  Progress,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Donut from "../../component/Donut";
import Page from "../../utils/page/page";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSelector } from "react-redux";
import CheckListExecutionService from "../../services/inspection-management-services/checklist-execution-service";
import DashboardService from "../../services/inspection-management-services/dashboard-service";
import SchedulerService from "../../services/inspection-management-services/scheduler-service";
import WorkOrderResolutionService from "../../services/inspection-management-services/workorder-resolution-service";
dayjs.extend(utc);
dayjs.extend(timezone);
const ImDashboard = () => {
  const reduxSelectedAhId = useSelector(
    (state) => state.mainDashboardReducer.selectedAhId
  );
  const reduxSelectedAssetId = useSelector(
    (state) => state.mainDashboardReducer.selectedAssetId
  );
  const service = new DashboardService();
  const resolutionService = new WorkOrderResolutionService();
  const schedulerService = new SchedulerService();
  const checklistExecutionService = new CheckListExecutionService();
  const [isLoading, setIsLoading] = useState(false);
  // const [value, setValue] = useState(moment(new Date()));
  const [value, setValue] = useState(dayjs());
  const [abnormality, setAbnormality] = useState([]);
  const [ticketStatus, setTicketStatus] = useState([]);
  const [resolutionWorkOrderData, setResolutionWorkOrderData] = useState([]);
  const [schedulerData, setSchedulerData] = useState([]);
  const strokeColor = ["#7474FE", "#72AF35", "#E18984", "#929090", "#4FA3BD"];
  const getColor = (status) => {
    switch (status) {
      case "InProgress":
        return "#FAE9FF";
      case "Scheduled":
        return "#FFF6E4";
      case "Closed":
        return "#CBD0FF";
      default:
        return "#ccc";
    }
  };

  // for overallticketcount
  const iconStyleDiv = {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
    borderRadius: "4px",
  };

  const iconStyleDiv1 = {
    display: "flex",
    marginLeft: "40px",
    alignItems: "center",
  };

  const realtimePopStyle = {
    height: "20px",
    width: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const resolutionColumns = [
    {
      title: "Work Order No",
      dataIndex: "rwoNumber",
      key: "rwoNumber",
    },
    {
      title: "Execution No",
      dataIndex: "checkListExecutionNumber",
      key: "checkListExecutionNumber",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (value) => {
        return value ? moment(value).format("DD-MM-YYYY") : "-";
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (assignedTo) => {
        const userName = assignedTo?.userName || "-";
        return <span>{userName}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value, record) => (
        <Link
          to={`resolution-work-order/update/${record.resolutionWorkOrderId}`}
        >
          <Button type="dashed" style={{ width: "100%" }}>
            {resolutionService.status(value)}
          </Button>
        </Link>
      ),
    },
  ];
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (reduxSelectedAssetId) {
      setIsLoading(true);
      service
        .dashboard({ assetId: [reduxSelectedAssetId] })
        .then((response) => {
          setIsLoading(true);
          setAbnormality(response.data.abnormality.sort((a, b) => b.y - a.y));
          setTicketStatus(
            response.data.ticketStatus.map((item) => ({ [item.x]: item.y }))
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
      resolutionService
        .list({ assetId: [reduxSelectedAssetId] })
        .then((response) => {
          setIsLoading(true);
          setResolutionWorkOrderData(response.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [reduxSelectedAssetId]);
  useEffect(() => {
    if (reduxSelectedAssetId && value) {
      setIsLoading(true);

      const timeZone = dayjs.tz.guess();

      const originalDate = dayjs.tz(value, timeZone);
      const startOfDay = originalDate.startOf("day");
      const endOfDay = originalDate.endOf("day");
      const convertedTimestamp = startOfDay.toISOString();
      const convertedTimestamp1 = endOfDay.toISOString();
      schedulerService
        .list({
          assetId: [reduxSelectedAssetId],
          startDate: convertedTimestamp,
          endDate: convertedTimestamp1,
        })
        .then((response) => {
          setIsLoading(true);
          setSchedulerData(response.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [reduxSelectedAssetId, value]);
  const totalAbnormalitySum = abnormality
    .slice(0, 5)
    .reduce((sum, item) => sum + item.y, 0);
  return (
    <Page>
      <Spin spinning={isLoading}>
        {/* {console.log(abnormality, "page", ticketStatus, totalAbnormalitySum)} */}
        <Row gutter={[10, 10]}>
          <Col xs={24} sm={24} md={16} lg={16}>
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Card
                  size="small"
                  title="Resolution Work Order"
                  extra={
                    <Link to="resolution-work-order">
                      <Button size="small">View all</Button>
                    </Link>
                  }
                  style={{ minHeight: "320px", borderRadius: "10px" }}
                >
                  <Table
                    size="small"
                    columns={resolutionColumns}
                    dataSource={resolutionWorkOrderData}
                    scroll={{
                      y: 200,
                    }}
                    pagination={false}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Card
                  size="small"
                  style={{ minHeight: "320px", borderRadius: "10px" }}
                >
                  <Row gutter={16} style={{ marginBottom: "16px" }}>
                    <Col flex={2}>
                      <h4
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "8px",
                        }}
                      >
                        Scheduled Checklist
                      </h4>
                    </Col>
                    <Col>
                      <Row align="middle">
                        <Col>
                          <Link to="scheduler">
                            <ArrowRightOutlined />
                          </Link>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={[10, 10]}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Calendar
                        headerRender={({
                          value,
                          type,
                          onChange,
                          onTypeChange,
                        }) => {
                          const start = 0;
                          const end = 12;
                          const monthOptions = [];
                          let current = value.clone();
                          const localeData = value.localeData();
                          const months = [];
                          for (let i = 0; i < 12; i++) {
                            current = current.month(i);
                            months.push(localeData.monthsShort(current));
                          }
                          for (let i = start; i < end; i++) {
                            monthOptions.push(
                              <Select.Option
                                key={i}
                                value={i}
                                className="month-item"
                              >
                                {months[i]}
                              </Select.Option>
                            );
                          }
                          const year = value.year();
                          const month = value.month();
                          const options = [];
                          for (let i = year - 10; i < year + 10; i += 1) {
                            options.push(
                              <Select.Option
                                key={i}
                                value={i}
                                className="year-item"
                              >
                                {i}
                              </Select.Option>
                            );
                          }
                          return (
                            <div
                              style={{
                                padding: 8,
                              }}
                            >
                              <Row gutter={8}>
                                <Col>
                                  <Select
                                    size="small"
                                    dropdownMatchSelectWidth={false}
                                    className="my-year-select"
                                    value={year}
                                    onChange={(newYear) => {
                                      const now = value.clone().year(newYear);
                                      onChange(now);
                                    }}
                                  >
                                    {options}
                                  </Select>
                                </Col>
                                <Col>
                                  <Select
                                    size="small"
                                    dropdownMatchSelectWidth={false}
                                    value={month}
                                    onChange={(newMonth) => {
                                      const now = value.clone().month(newMonth);
                                      onChange(now);
                                    }}
                                  >
                                    {monthOptions}
                                  </Select>
                                </Col>
                              </Row>
                            </div>
                          );
                        }}
                        value={value}
                        fullscreen={false}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Row gutter={16} style={{ marginBottom: "16px" }}>
                        <Col flex={2}>
                          <h3
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              marginBottom: "8px",
                            }}
                          >
                            {/* {moment(value).format("DD-MMM-YYYY")} */}
                            {value.format("DD-MMM-YYYY")}
                          </h3>
                        </Col>
                        <Col>
                          <Row align="middle">
                            <Col>
                              <Button style={realtimePopStyle} size="small">
                                <PlusOutlined style={{ fontSize: "12px" }} />
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <div
                        style={{
                          maxHeight: "300px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <Row gutter={[10, 10]}>
                          {schedulerData.map((item, index) => (
                            <Col key={index} span={24}>
                              <Card
                                size="small"
                                style={{
                                  borderRadius: "10px",
                                  background: `linear-gradient(to right, #FFFFFF, ${getColor(
                                    item?.checkListExecution?.status
                                  )})`,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div>
                                    <p style={{ marginBottom: "0" }}>
                                      <strong>{item?.scheduledNumber}</strong>
                                    </p>
                                    <p
                                      style={{
                                        marginBottom: "0",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {item?.user?.userName}
                                    </p>
                                  </div>
                                  <span>{item?.description}</span>
                                  <div>
                                    <Link
                                      to={`checklist-execution/update/${item.checkListExecutionId}`}
                                    >
                                      <Button
                                        size="small"
                                        style={{ width: "100px" }}
                                        type="dashed"
                                      >
                                        {item?.checkListExecution?.status
                                          ? item?.checkListExecution?.status
                                          : "Scheduled"}
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Link to="/im/resolution-work-order">
                  <div
                    style={{
                      height: "100px",
                      borderRadius: "10px",
                      background: "linear-gradient(to right, #E2EDFE, #97C0FD)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 25px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor: "white",
                          color: "#000",
                        }}
                      >
                        <ExceptionOutlined />
                      </div>
                    </div>
                    <h3
                      style={{ margin: 0, color: "white", textAlign: "center" }}
                    >
                      Raise new order ticket
                    </h3>

                    <div
                      style={{
                        color: "#fff",
                        fontSize: "20px",
                      }}
                    >
                      <ArrowRightOutlined />
                    </div>
                  </div>
                </Link>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Card>
                  <Row>
                    <Col span={24}>
                      <h4
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "8px",
                        }}
                      >
                        Overall Ticket Count
                      </h4>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12}>
                      <Donut
                        series={ticketStatus}
                        color={[
                          "#36A8F7",
                          "#7E574F",
                          "#4C5F8D",
                          "#F77A5F",
                          "#83BB61",
                        ]}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12}>
                      <div style={iconStyleDiv1}>
                        <div
                          style={{
                            ...iconStyleDiv,
                            backgroundColor: "#36A8F7",
                          }}
                        >
                          <SelectOutlined
                            style={{ color: "white", fontSize: "15px" }}
                          />
                        </div>
                        <div>
                          <p style={{ marginBottom: "0", fontSize: "12px" }}>
                            Opened
                          </p>
                          <p style={{ marginBottom: "0" }}>
                            <strong>
                              {ticketStatus.length > 0
                                ? ticketStatus[0]?.Opened
                                : 0}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div style={iconStyleDiv1}>
                        <div
                          style={{
                            ...iconStyleDiv,
                            backgroundColor: "#7E574F",
                          }}
                        >
                          <UserAddOutlined
                            style={{ color: "white", fontSize: "15px" }}
                          />
                        </div>
                        <div>
                          <p style={{ marginBottom: "0", fontSize: "12px" }}>
                            Assigned
                          </p>
                          <p style={{ marginBottom: "0" }}>
                            <strong>
                              {ticketStatus.length > 0
                                ? ticketStatus[1]?.Assigned
                                : 0}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div style={iconStyleDiv1}>
                        <div
                          style={{
                            ...iconStyleDiv,
                            backgroundColor: "#4C5F8D",
                          }}
                        >
                          <BarsOutlined
                            style={{ color: "white", fontSize: "15px" }}
                          />
                        </div>
                        <div>
                          <p style={{ marginBottom: "0", fontSize: "12px" }}>
                            Resolved
                          </p>
                          <p style={{ marginBottom: "0" }}>
                            <strong>
                              {ticketStatus.length > 0
                                ? ticketStatus[2]?.Resolved
                                : 0}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div style={iconStyleDiv1}>
                        <div
                          style={{
                            ...iconStyleDiv,
                            backgroundColor: "#F77A5F",
                          }}
                        >
                          <WarningOutlined
                            style={{ color: "white", fontSize: "15px" }}
                          />
                        </div>
                        <div>
                          <p style={{ marginBottom: "0", fontSize: "12px" }}>
                            Rejected
                          </p>
                          <p style={{ marginBottom: "0" }}>
                            <strong>
                              {ticketStatus.length > 0
                                ? ticketStatus[3]?.Rejected
                                : 0}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div style={iconStyleDiv1}>
                        <div
                          style={{
                            ...iconStyleDiv,
                            backgroundColor: "#83BB61",
                          }}
                        >
                          <CheckOutlined
                            style={{ color: "white", fontSize: "15px" }}
                          />
                        </div>
                        <div>
                          <p style={{ marginBottom: "0", fontSize: "12px" }}>
                            Completed
                          </p>
                          <p style={{ marginBottom: "0" }}>
                            <strong>
                              {ticketStatus.length > 0
                                ? ticketStatus[4]?.Completed
                                : 0}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Card style={{ minHeight: "350px" }}>
                  <Row gutter={16} style={{ marginBottom: "16px" }}>
                    <Col flex={2}>
                      <h4
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "8px",
                        }}
                      >
                        Repeated Abnormalities
                      </h4>
                    </Col>
                    <Col>
                      <Row align="middle">
                        <Col>
                          <Button style={realtimePopStyle} size="small">
                            {" "}
                            <img src="/vector.svg" />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {abnormality.length > 0 ? (
                    abnormality.slice(0, 5)?.map((item, index) => {
                      return (
                        <div key={index}>
                          <span style={{ fontSize: "13px" }}>{item.x}</span>
                          <Progress
                            percent={(item.y / totalAbnormalitySum) * 100}
                            strokeColor={strokeColor[index]}
                            format={() =>
                              item.y ||
                              `${(item.y / totalAbnormalitySum) * 100}%`
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <Empty />
                  )}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Spin>
    </Page>
  );
};
export default ImDashboard;
