import React, { useEffect, useMemo, useState } from "react";

import { BlockOutlined, DisconnectOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Progress,
  Row,
  Typography,
  Descriptions,
  Statistic,
  Space,
  Flex,
  Tooltip,
} from "antd";
import { MdOutlineArrowOutward } from "react-icons/md";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import BarChart1 from "../../../component/BarChart1";
import TatReportService from "../../../services/track-and-trace-service/tat-report-service";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import AndonCard from "../andon/andon-card";
import DowntimeForm from "./downtime-form";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
const { Title, Text } = Typography;
const Ole = () => {
  const [station, setStation] = useState([]);
  const [data, setData] = useState({
    ole: 0,
  });
  const [popup, setPopup] = useState({});

  const colors = [
    { name: "Pallet Release", background: "#13D048", color: "#FFF" },
    { name: "Material Call", background: "#FFD600", color: "#233E7F" },
    { name: "Work Delay", background: "#FF5353", color: "#FFF" },
    { name: "Maintenance Call", background: "#1890FF", color: "#FFF" },
    { name: "Quality Call", background: "#F2F2F2", color: "#233E7F" },
  ];

  const headerStyle = {
    display: "flex",
    justifyContent: "space-around",
  };

  const headerContent = {
    backgroundColor: "#f7f8fd",
    borderRadius: "5px",
    padding: "10px",
    alignItems: "center",
  };
  const oleText = {
    fontSize: "12px",
  };
  const twoColors = {
    "0%": "#928DAB",
    "100%": "#00D2FF",
  };
  const avatarStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f7f8fd",
    borderRadius: "5px",
    padding: "10px",
  };
  const handleCardClick = (id, name) => {
    setPopup({
      open: true,
      mode: "Add",
      title: "Station Details",
      id: id,
      disabled: false,
      name: name,
    });
  };
  const onClose = () => {
    setPopup({
      open: false,
      mode: null,
      title: null,
      id: null,
      disabled: false,
      name: null,
    });
  };

  // const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const getData = (value = {}) => {
    setLoading(true);
    const service = new TatReportService();
    const today = dayjs();

    setLoading(true);
    service
      .getOle()
      .then(({ data }) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        setLoading(false);
      });
    // Promise.all([
    //   service.getPartCount({
    //     shiftDateStart: start.toISOString(),
    //     shiftDateEnd: end.toISOString(),
    //   }),
    // ])
    //   .then((response) => {
    //     const todayShift = response[0].data;
    //     const currentShift = todayShift?.find(
    //       (e) => e.shiftStatus == "INPROGRESS"
    //     );
    //     const ole = currentShift.targetedPart / currentShift.totalPart;
    //     setData({
    //       ole: ole,
    //       currentShift: currentShift,
    //       todays: todayShift.reduce(
    //         (p, e) => {
    //           p.target += e.targetedPart;
    //           p.actual += e.totalPart;
    //           p.accepted += e.completedPart;
    //           p.rejected += e.rejectedPart;
    //           return p;
    //         },
    //         { target: 0, actual: 0, accepted: 0, rejected: 0 }
    //       ),
    //     });
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  const getWorkstations = () => {
    const workStationService = new WorkStationService();
    workStationService.list({ status: true }).then(({ data }) => {
      setStation(data?.sort((a, b) => a.seqNo - b.seqNo));
    });
  };
  useEffect(() => {
    getWorkstations();
    getData();
  }, []);
  const gridStyle = {
    width: "25%",
    textAlign: "center",
  };
  const diffOle = () => {
    const value =
      Math.round(
        ((data?.currentShiftSummary?.ole ?? 0) -
          (data?.previousShiftSummary?.ole ?? 0)) *
          10
      ) / 10;

    if (value > 0) {
      return (
        <Tooltip title={`${value}% greater than last shift`}>
          <Typography.Text type="success">
            +{value}% <ArrowUpOutlined />
          </Typography.Text>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={`${Math.abs(value)}% less than last shift`}>
          <Typography.Text type="danger">
            {value}% <ArrowDownOutlined />
          </Typography.Text>
        </Tooltip>
      );
    }
  };
  const series = data.lossReasonSummary
    ?.sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((e) => ({
      x: e.lossReason,
      y: e.count,
    }));
  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={6}>
          <Typography.Title level={5}>Current Shift OLE %</Typography.Title>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Card
                styles={{
                  body: {
                    display: "flex",
                    justifyContent: "center",
                    padding: 18,
                  },
                }}
              >
                <Progress
                  type="circle"
                  percent={data?.currentShiftOle}
                  // steps={5}
                  strokeColor={"rgb(0 143 251)"}
                  strokeWidth={15}
                  gapDegree={100}
                  format={(percent) => (
                    <>
                      <Typography.Text>
                        {Math.round(percent * 10) / 10}%
                      </Typography.Text>
                      <br />
                      {diffOle()}
                    </>
                  )}
                  size={143}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Typography.Title level={5}>Current Shift Summary</Typography.Title>
          <Card>
            <Card.Grid style={gridStyle}>
              <Statistic
                title="Target"
                value={data?.currentShiftSummary?.target}
              />
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <Statistic
                title="Actual"
                value={data?.currentShiftSummary?.actual}
              />
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <Statistic
                title="Difference"
                value={data?.currentShiftSummary?.difference}
              />
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <Statistic
                title="Re-worked"
                value={data?.currentShiftSummary?.reworked}
              />
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <Statistic
                title="Accepted"
                value={data?.currentShiftSummary?.accepted}
              />
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <Statistic
                title="Rejected"
                value={data?.currentShiftSummary?.rejected}
              />
            </Card.Grid>
            {/* <Card.Grid
              style={{
                width: "100%",
                flex: "1 0 100%",
              }}
            >
              <Typography.Text type="secondary">OLE</Typography.Text>
              <Progress
                type="line"
                percent={data?.currentShiftSummary?.ole}
                // steps={5}
                // strokeColor={"rgb(0 143 251)"}
                // strokeWidth={15}
                // gapDegree={100}
                // format={(percent) => (
                //   <>
                //     <Typography.Title level={2}>{percent}%</Typography.Title>
                //   </>
                // )}
                // size={180}
              />
            </Card.Grid> */}
          </Card>
        </Col>
        <Col span={6}>
          <Title level={5}>Today's OLE</Title>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Card
                styles={{
                  body: {
                    display: "flex",
                    justifyContent: "center",
                    padding: 18,
                  },
                }}
              >
                {data.previ}
                <Progress
                  type="dashboard"
                  percent={data?.todaysSummary?.ole}
                  // steps={5}
                  strokeColor={"rgb(0 143 251)"}
                  strokeWidth={15}
                  gapDegree={100}
                  format={(percent) => (
                    <>
                      <Typography.Text level={2}>
                        {Math.round(percent * 10) / 10}%
                      </Typography.Text>
                    </>
                  )}
                  size={143}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Title level={5}>Top Loss</Title>
          <Card size="small">
            <BarChart1
              height={220}
              legendShow={false}
              toolbarStatus={false}
              series={series}
              horizontal={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Title level={5}>Station Status</Title>

          <Card size="small">
            <Row gutter={[10, 10]}>
              {station?.map((value, index) => (
                <Col key={index} sm={12} md={8} lg={4}>
                  <AndonCard
                    name={value?.workStationName}
                    workStationId={value?.workStationId}
                    level={5}
                    height="60px"
                    onClick={() =>
                      handleCardClick(
                        value?.workStationId,
                        value?.workStationName
                      )
                    }
                  />
                </Col>
              ))}
            </Row>
            <div
              style={{
                ...headerStyle,
                marginTop: "12px",
              }}
            >
              {colors.map((legend, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: legend?.background,
                      boxShadow: `0 0 5px ${legend?.background}`,
                      marginRight: "5px",
                    }}
                  />
                  <Text style={{ fontSize: "12px" }}>{legend?.name}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* {popup?.type === 1 ? ( */}
      <DowntimeForm {...popup} onClose={onClose} />
      {/* ) : ( // <StationDetail {...popup} onClose={onClose} />
       )} */}
    </>
  );
};

function PieChart(props) {
  const options = {
    chart: {
      type: "donut",
      parentHeightOffset: 0,
      height: 200,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return `${opts.w.globals.series[opts.seriesIndex]}`;
      },
      // offsetY: 100,
      style: {
        fontSize: "12px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 500,
      },
      // background: {
      //   enabled: true,
      //   foreColor: "#000", // Label text color
      //   borderRadius: 4, // Rounded corner
      //   borderWidth: 1, // Border thickness
      //   borderColor: "#333333", // Border color
      //   opacity: 0.9, // Background opacity
      // },
      dropShadow: {
        enabled: false,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
    },
    // plotOptions: {
    //   pie: {
    //     startAngle: -90,
    //     endAngle: 90,
    //     offsetY: 10,
    //   },
    // },
    labels: props.labels,
    legend: {
      position: "bottom",
      floating: false,
      offsetY: 0,
      formatter: function (seriesName, opts) {
        return seriesName + ": " + opts.w.globals.series[opts.seriesIndex]; // Show value next to label
      },
    },
  };

  const series = useMemo(() => {
    return props.series;
  }, [props]);
  return (
    <>
      <div id="chart">
        <ReactApexChart
          height={220}
          options={options}
          series={series}
          type="donut"
        />
      </div>
    </>
  );
}

export default Ole;
